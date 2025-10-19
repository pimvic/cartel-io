import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bug } from "lucide-react";

export const BugReport = () => {
  const [open, setOpen] = useState(false);
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
      setOpen(false);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="fixed bottom-4 right-4 opacity-20 hover:opacity-100 transition-opacity"
        >
          <Bug className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Feedback</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <div className="text-center text-success font-semibold text-lg py-8">
            Merci pour votre feedback !
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder="Votre commentaire..."
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleSubmit} className="w-full">
              ENTRER
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
