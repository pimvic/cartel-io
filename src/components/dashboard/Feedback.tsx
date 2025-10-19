import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export const Feedback = () => {
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!comment.trim()) {
      return;
    }
    
    setSubmitted(true);
    setComment("");
    
    // Reset submitted state after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 space-y-6">
          {submitted ? (
            <div className="text-center text-success font-semibold text-xl py-12">
              Merci pour votre feedback !
            </div>
          ) : (
            <>
              <Textarea
                placeholder="Votre message…"
                rows={8}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-base"
              />
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                ENTRER
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
