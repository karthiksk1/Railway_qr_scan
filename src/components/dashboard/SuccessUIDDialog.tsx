import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface SuccessUIDDialogProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
}

export const SuccessUIDDialog = ({ isOpen, onClose, uid }: SuccessUIDDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Installation Saved Successfully!</DialogTitle>
          <DialogDescription>
            A new UID has been generated for the part. You can use this UID to look it up later.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 p-4 bg-muted rounded-md flex items-center justify-between">
          <span className="text-lg font-mono font-bold text-primary">{uid}</span>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};