import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files');
    const cartelId = formData.get('cartel_id') as string;
    
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const GOOGLE_REFRESH_TOKEN = Deno.env.get('GOOGLE_REFRESH_TOKEN');
    const GOOGLE_DRIVE_FOLDER_ID = Deno.env.get('GOOGLE_DRIVE_FOLDER_ID');

    // Get access token from refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        refresh_token: GOOGLE_REFRESH_TOKEN!,
        grant_type: 'refresh_token',
      }),
    });

    const { access_token } = await tokenResponse.json();

    const uploadedFiles = [];

    for (const file of files) {
      const fileBlob = file as Blob;
      const fileName = (file as File).name;

      // Create file metadata
      const metadata = {
        name: fileName,
        parents: GOOGLE_DRIVE_FOLDER_ID ? [GOOGLE_DRIVE_FOLDER_ID] : undefined,
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', fileBlob);

      // Upload to Google Drive
      const uploadResponse = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: form,
        }
      );

      const uploadResult = await uploadResponse.json();
      
      // Make file accessible
      await fetch(`https://www.googleapis.com/drive/v3/files/${uploadResult.id}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });

      uploadedFiles.push({
        id: uploadResult.id,
        name: fileName,
        url: `https://drive.google.com/file/d/${uploadResult.id}/view`,
      });
    }

    // Save to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const insertData = uploadedFiles.map(file => ({
      cartel_id: cartelId,
      title: file.name,
      file_url: file.url,
    }));

    const { error } = await supabase
      .from('knowledge_base')
      .insert(insertData);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, files: uploadedFiles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
