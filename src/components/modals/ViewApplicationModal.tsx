import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import CandidateViewList from "../CandidateViewTable";

const API_BASE_URL = "http://51.20.181.155:3000";

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
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplicants = async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/jobs/${jobId}/applicants`
      );
      if (data.status) {
        let result = data.result;

        if (statusFilter) {
          result = result.filter(
            (applicant: any) => applicant.status === statusFilter
          );
        }

        setApplicants(result);
      } else {
        throw new Error(data.message || "Failed to fetch applicants");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && jobId) {
      fetchApplicants();
    }
  }, [open, jobId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-custom max-w-screen h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>
            View Applications
            {statusFilter && (
              <span className="ml-2 text-blue-600 text-md font-medium">
                — {statusFilter} Stage
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : error ? (
          <p className="text-red-600">No applicants found.</p>
        ) : applicants.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">
            No applications found.
          </p>
        ) : (
          <div className="space-y-4">
            <CandidateViewList
              loading={loading}
              candidates={applicants}
              fetchCandidates={fetchApplicants}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
