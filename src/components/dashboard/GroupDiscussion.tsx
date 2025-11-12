import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MessageSquare, Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

interface Message {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: Date;
}

const members = [
  { name: "Jean-Stéphane B.", avatar: "/placeholder.svg", initials: "JS" },
  { name: "Thierry F.", avatar: "/placeholder.svg", initials: "TF" },
  { name: "Isabelle L.", avatar: "/placeholder.svg", initials: "IL" },
  { name: "Elsa B.", avatar: "/placeholder.svg", initials: "EB" },
];

export const GroupDiscussion = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Jean-Stéphane B.",
      avatar: "/placeholder.svg",
      content: t('dashboard.groupDiscussion.sampleMessages.message1'),
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      user: "Thierry F.",
      avatar: "/placeholder.svg",
      content: t('dashboard.groupDiscussion.sampleMessages.message2'),
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: "3",
      user: "Isabelle L.",
      avatar: "/placeholder.svg",
      content: t('dashboard.groupDiscussion.sampleMessages.message3'),
      timestamp: new Date(Date.now() - 1800000),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: "Jean-Stéphane B.",
        avatar: "/placeholder.svg",
        content: newMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const formatTime = (date: Date) => {
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-accent" />
          {t('dashboard.groupDiscussion.title')}
          <Video className="w-8 h-8 text-accent ml-4" />
          {t('dashboard.menu.visio')}
        </h2>
        <p className="text-muted-foreground">
          {t('dashboard.groupDiscussion.subtitle')}
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {members.map((member, i) => (
                <Avatar key={i} className="border-2 border-background w-8 h-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span>{t('dashboard.groupDiscussion.activeMembers', { count: members.length })}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback>
                      {message.user.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">{message.user}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm bg-accent/10 rounded-lg p-3">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder={t('dashboard.groupDiscussion.messagePlaceholder')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
