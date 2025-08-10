import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import CandidateViewList from "../CandidateViewTable";
import { RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_BASE_URL = "http://51.20.181.155:3000";

const STATUSES = [
  "All",
  "Sourced",
  "Application",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
];

type ViewApplicationsModalProps = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  jobId: number;
  statusFilter?: string | null;
};

export default function ViewApplicationsModal({
  open,
  onOpenChange,
  jobId,
  statusFilter,
}: ViewApplicationsModalProps) {
  const initialStatus = statusFilter ?? "All";

  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState<string>(initialStatus);

  const fetchApplicants = async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/jobs/${jobId}/applicants`
      );
      if (data.status) {
        setApplicants(data.result || []); // Always default to an empty array
      } else {
        throw new Error(data.message || "Failed to fetch applicants");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && jobId) {
      fetchApplicants();
    }
  }, [open, jobId]);

  const filteredApplicants =
    activeStatus === "All"
      ? applicants
      : applicants.filter((applicant) => applicant.status === activeStatus);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen h-screen flex flex-col p-0 gap-0">
        <div className="flex-shrink-0 p-6 border-b bg-white/80 backdrop-blur-sm">
          <DialogHeader className="space-y-0">
            <div className="flex items-center">
              <DialogTitle className="flex items-center space-x-4 text-lg">
                <span>View Applications</span>
                <Button
                  variant="outline"
                  onClick={fetchApplicants}
                  aria-label="Refresh applicants"
                >
                  Refresh
                </Button>
              </DialogTitle>
            </div>

            <div className="flex space-x-2 overflow-x-auto pt-4 pb-1">
              {STATUSES.map((status) => (
                <Button
                  key={status}
                  variant={status === activeStatus ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveStatus(status)}
                  className={
                    status === activeStatus
                      ? "whitespace-nowrap bg-blue-500"
                      : "whitespace-nowrap"
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
          </DialogHeader>
        </div>

        {/* === Scrollable Content Area === */}
        <div className="flex-grow overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <RefreshCw className="h-6 w-6 animate-spin mr-3" />
              <span>Loading Applicants...</span>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Users className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold">No Applicants Found</h3>
              <p className="text-sm">
                There are no applicants in the "{activeStatus}" stage.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-6">
              <CandidateViewList
                loading={false}
                jobId={jobId}
                candidates={filteredApplicants}
                fetchCandidates={fetchApplicants}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
