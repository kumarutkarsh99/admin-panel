import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import CandidateNotesPanel from "./CandidateNotesPanel";
import CallLogPanel from "./CallLogPanel";
import EditCandidateModal from "./modals/EditCandidateModal";

interface CandidateProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string | null;
  photo_url: string | null;
  education: string;
  experience: string;
  current_ctc: string | null;
  expected_ctc: string | null;
  skill: string[];
  current_company: string | null;
  linkedinprofile: string;
  rating: number | string | null;
  notice_period: string;
  institutiontier: string;
  companytier: string;
  resume_url: string;
}

type CandidateActionsPopoverProps = {
  candidate: CandidateProfile;
  children: React.ReactNode;
};

export function CandidateActionsPopover({
  candidate,
  children,
}: CandidateActionsPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [callLogOpen, setCallLogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div
            onMouseEnter={() => setPopoverOpen(true)}
            onMouseLeave={() => setPopoverOpen(false)}
          >
            {children}
          </div>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="start"
          className="w-32 p-2"
          onMouseEnter={() => setPopoverOpen(true)}
          onMouseLeave={() => setPopoverOpen(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              setPopoverOpen(false);
              setSheetOpen(true);
            }}
          >
            Notes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              setPopoverOpen(false);
              setCallLogOpen(true);
            }}
          >
            Call Log
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              setPopoverOpen(false);
              setEditModalOpen(true);
            }}
          >
            Edit
          </Button>
        </PopoverContent>
      </Popover>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <CandidateNotesPanel candidateId={candidate.id} authorId={1} />
        </SheetContent>
      </Sheet>
      <Sheet open={callLogOpen} onOpenChange={setCallLogOpen}>
        <SheetContent>
          <CallLogPanel candidateId={candidate.id} />
        </SheetContent>
      </Sheet>
      {editModalOpen && (
        <EditCandidateModal
          isOpen={editModalOpen}
          onOpenChange={setEditModalOpen}
          candidate={candidate}
          onSaveSuccess={() => setEditModalOpen(false)}
        />
      )}
    </>
  );
}
