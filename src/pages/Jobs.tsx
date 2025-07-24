import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import PostNewJobModal from "@/components/modals/PostNewJobModal";
import JobViewModal from "@/components/modals/JobViewModal";
import ViewApplicationsModal from "@/components/modals/ViewApplicationModal";
import { EllipsisVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import EditJobModal from "@/components/modals/EditJobModal";
import CloneJobModal from "@/components/modals/CloneJobModal";

const API_BASE_URL = "http://51.20.181.155:3000";

const PIPELINE_STAGES = [
  "Sourced",
  "Application",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
];

type Job = {
  id: number;
  job_title: string;
  company_industry: string;
  employment_type: string;
  office_primary_location: string;
  applicants: number;
  stageCounts: Record<string, number>;
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [isViewApplicantsOpen, setIsViewApplicantsOpen] = useState(false);
  const [isJobEditOpen, setIsJobEditOpen] = useState(false);
  const [isJobCloneOpen, setIsJobCloneOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/jobs/getAllJobs`);
      const jobsData = res.data.result;

      const jobsWithData = await Promise.all(
        jobsData.map(async (job: any) => {
          let applicantsList: any[] = [];

          try {
            const applicantsRes = await axios.get(
              `${API_BASE_URL}/jobs/${job.id}/applicants`
            );
            applicantsList = applicantsRes.data.result || [];
          } catch (err: any) {
            console.warn(
              `No applicants found or error fetching for job ID ${job.id}:`,
              err.message
            );
          }

          const stageCounts = PIPELINE_STAGES.reduce((acc, stage) => {
            acc[stage] = 0;
            return acc;
          }, {} as Record<string, number>);

          applicantsList.forEach((app: any) => {
            const st = app.status;
            if (PIPELINE_STAGES.includes(st)) {
              stageCounts[st] += 1;
            }
          });

          return {
            ...job,
            applicants: applicantsList.length,
            stageCounts,
          };
        })
      );

      setJobs(jobsWithData);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Delete this job permanently?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
      await fetchJobs();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete job.");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Jobs Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              View current Jobs or Post new Jobs!
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <div className="flex justify-between items-center gap-4 w-full">
          <div className="flex items-center gap-2 w-full">
            <Card className="w-full border border-slate-200">
              <CardContent className="flex items-center gap-2 p-4">
                <Search className="text-slate-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="w-full border border-slate-200 hover:shadow-lg transition duration-200 rounded-xl"
            >
              <CardContent className="p-6 space-y-5">
                <div className="flex justify-between items-start">
                  <div
                    onClick={() => {
                      setSelectedJob(job);
                      setIsJobViewOpen(true);
                    }}
                  >
                    <h3 className="text-xl font-semibold text-slate-800 cursor-pointer">
                      {job.job_title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {job.office_primary_location} · {job.employment_type}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div
                      onClick={() => {
                        setSelectedJob(job);
                        setIsViewApplicantsOpen(true);
                      }}
                      className="text-sm text-blue-600 font-medium mt-1 cursor-pointer"
                    >
                      {job.applicants} applicant{job.applicants !== 1 && "s"}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1 rounded-full hover:bg-slate-100 transition"
                          aria-label="Job actions"
                        >
                          <EllipsisVerticalIcon className="w-5 h-5 text-slate-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onSelect={() => {
                            if (job.id) {
                              setSelectedJob(job);
                              setIsJobEditOpen(true);
                            }
                          }}
                        >
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedJob(job);
                            setIsJobCloneOpen(true);
                          }}
                        >
                          Clone Job
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDeleteJob(job.id)}
                        >
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div>
                  <div className="overflow-x-auto rounded-md border border-blue-200 bg-blue-50/50">
                    <table className="min-w-full table-fixed text-sm text-slate-700">
                      <thead>
                        <tr className="bg-blue-100 text-blue-800">
                          {PIPELINE_STAGES.map((stage) => (
                            <th
                              key={stage}
                              className="px-4 py-2 border-b border-r last:border-r-0 font-semibold text-center"
                            >
                              {stage}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          {PIPELINE_STAGES.map((stage) => (
                            <td
                              key={stage}
                              className="px-4 py-2 border-r last:border-r-0 text-center cursor-pointer"
                              onClick={() => {
                                setSelectedJob({ ...job });
                                setIsViewApplicantsOpen(true);
                                setSelectedStage(stage);
                              }}
                            >
                              <span className="text-blue-600 font-medium">
                                {job.stageCounts[stage] ?? 0}
                              </span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <PostNewJobModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {isJobViewOpen && selectedJob && (
        <JobViewModal
          open={isJobViewOpen}
          onOpenChange={() => setIsJobViewOpen(false)}
          job={selectedJob}
        />
      )}

      {isViewApplicantsOpen && selectedJob && (
        <ViewApplicationsModal
          open={isViewApplicantsOpen}
          onOpenChange={(open) => {
            setIsViewApplicantsOpen(open);
            setSelectedStage(null);
            if (!open) {
              setSelectedStage(null);
              fetchJobs();
            }
          }}
          jobId={selectedJob.id}
          statusFilter={selectedStage}
        />
      )}

      {isJobEditOpen && selectedJob && (
        <EditJobModal
          open={isJobEditOpen}
          onOpenChange={() => setIsJobEditOpen(false)}
          jobId={selectedJob.id}
          onSuccess={() => setIsJobEditOpen(false)}
        />
      )}

      {isJobCloneOpen && selectedJob && (
        <CloneJobModal
          open={isJobCloneOpen}
          onOpenChange={() => setIsJobCloneOpen(false)}
          jobId={selectedJob.id}
          onSuccess={() => setIsJobCloneOpen(false)}
        />
      )}
    </Layout>
  );
}
