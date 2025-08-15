import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MinusCircle, ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://13.51.235.31:3000";

const JOB_PIPELINE_STAGES = [
  "Sourced",
  "Application",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

interface JobAssignment {
  job_id: number;
  status: string;
  job_title: string;
}

interface JobsCardProps {
  candidateId: number;
  jobs: JobAssignment[];
  fetchCandidates: () => void;
  onAddJob: () => void;
}

export default function JobsCard({
  candidateId,
  jobs,
  fetchCandidates,
  onAddJob,
}: JobsCardProps) {
  const [localJobs, setLocalJobs] = useState<JobAssignment[]>(jobs);

  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  const handleJobStatusChange = async (
    jobId: number,
    field: string,
    value: string
  ) => {
    const originalJobs = [...localJobs];

    const updatedJobs = localJobs.map((job) =>
      job.job_id === jobId ? { ...job, [field]: value } : job
    );
    setLocalJobs(updatedJobs);

    try {
      await axios.put(`${API_BASE_URL}/candidate/job-assignment/update`, {
        candidateId,
        jobId,
        field,
        value,
      });
      toast.success(`Status updated to "${value}"`);
      fetchCandidates();
    } catch (error) {
      console.error("Failed to update job status:", error);
      toast.error("Failed to update status. Reverting changes.");
      setLocalJobs(originalJobs);
    }
  };

  const handleRemoveJob = async (jobId: number) => {
    const originalJobs = [...localJobs];
    const updatedJobs = localJobs.filter((job) => job.job_id !== jobId);
    setLocalJobs(updatedJobs);

    try {
      await axios.post(`${API_BASE_URL}/candidate/job-detachment`, {
        jobIds: [jobId],
        candidateIds: [candidateId],
      });
      toast.success("Job removed from candidate");
      fetchCandidates();
    } catch (error) {
      console.error("Failed to remove job:", error);
      toast.error("Failed to remove job. Reverting changes.");
      setLocalJobs(originalJobs);
    }
  };

  return (
    <Card className="p-3 mt-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-xs uppercase text-slate-500">Jobs</p>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={onAddJob}
        >
          + Add job
        </Button>
      </div>
      <div className="space-y-2 pt-2">
        {localJobs?.length > 0 ? (
          localJobs.map((job) => (
            <div
              key={job.job_id}
              className="p-2 border rounded-md flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm text-slate-800">
                  {job.job_title}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 px-2 py-1 text-xs w-28 justify-between"
                    >
                      <span>{job.status}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {JOB_PIPELINE_STAGES.map((stage) => (
                      <DropdownMenuItem
                        key={stage}
                        disabled={job.status === stage}
                        onSelect={() =>
                          handleJobStatusChange(job.job_id, "status", stage)
                        }
                      >
                        {stage}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-100 hover:text-red-600 h-8 w-8"
                  onClick={() => handleRemoveJob(job.job_id)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 text-center py-2">
            No jobs assigned.
          </p>
        )}
      </div>
    </Card>
  );
}
