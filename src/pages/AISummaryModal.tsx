import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Download } from "lucide-react";

interface AISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  reportId: number;
  photo?: string;
}

const AISummaryModal = ({ isOpen, onClose, title, content, reportId, photo }: AISummaryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <div className="p-4">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              {title}
            </DialogTitle>
            <DialogDescription>This summary is AI-generated based on the scanned part's data.</DialogDescription>
          </DialogHeader>
          {photo && (
            <div className="my-4 border rounded-md overflow-hidden">
              <img src={`/${photo}`} alt="Inspection Evidence" className="w-full object-contain" />
            </div>
          )}
          <div className="my-4 text-sm text-foreground bg-muted/50 p-4 rounded-md leading-relaxed">{content}</div>
        </div>
        <DialogFooter className="px-6 pb-6 pt-0">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button asChild>
            <a href={`/api/download-report/${reportId}`} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Download as PDF
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISummaryModal;