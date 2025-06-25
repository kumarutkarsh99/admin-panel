import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CandidateProfilePage from "../CandidateProfilePage.tsx";

export default function CandidateProfileModal({
  open,
  onOpenChange,
  candidate,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
        </DialogHeader>
        <div className="flex h-[80vh]">
          <CandidateProfilePage candidate={candidate}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
