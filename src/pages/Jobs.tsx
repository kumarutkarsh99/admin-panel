import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, EllipsisVerticalIcon } from "lucide-react";
import PostNewJobModal from "@/components/modals/PostNewJobModal";
import JobViewModal from "@/components/modals/JobViewModal";
import ViewApplicationsModal from "@/components/modals/ViewApplicationModal";
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
  company: string | null;
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
              `No applicants found for job ID ${job.id}:`,
              err.message
            );
          }

          const stageCounts = PIPELINE_STAGES.reduce((acc, stage) => {
            acc[stage] = applicantsList.filter(
              (app) => app.status === stage
            ).length;
            return acc;
          }, {} as Record<string, number>);

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

  const groupedJobs = useMemo(() => {
    return filteredJobs.reduce((acc, job) => {
      const companyName = job.company || "Unassigned Jobs";
      if (!acc[companyName]) {
        acc[companyName] = [];
      }
      acc[companyName].push(job);
      return acc;
    }, {} as Record<string, Job[]>);
  }, [filteredJobs]);

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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <Card className="w-full border border-slate-200">
            <CardContent className="flex items-center gap-2 py-1 px-4">
              <Search className="text-slate-400" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none focus-visible:ring-0 shadow-none"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {Object.keys(groupedJobs).length > 0 ? (
            Object.entries(groupedJobs).map(([companyName, jobsInGroup]) => (
              <div key={companyName}>
                <h2 className="text-xl font-bold text-slate-700 border-b pb-2 mb-4">
                  {companyName}
                </h2>
                <div className="flex flex-col gap-6">
                  {jobsInGroup.map((job) => (
                    <Card
                      key={job.id}
                      className="w-full border border-slate-200 hover:shadow-lg transition duration-200 rounded-xl"
                    >
                      <CardContent className="p-6 space-y-5">
                        <div className="flex justify-between items-start">
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedJob(job);
                              setIsJobViewOpen(true);
                            }}
                          >
                            <h3 className="text-xl font-semibold text-slate-800">
                              {job.job_title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {job.office_primary_location} ·{" "}
                              {job.employment_type}
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
                              {job.applicants} applicant
                              {job.applicants !== 1 && "s"}
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
                                    setSelectedJob(job);
                                    setIsJobEditOpen(true);
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
            ))
          ) : (
            <p className="text-center text-slate-500">No jobs found.</p>
          )}
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
          onSuccess={() => {
            setIsJobEditOpen(false);
            fetchJobs();
          }}
        />
      )}
      {isJobCloneOpen && selectedJob && (
        <CloneJobModal
          open={isJobCloneOpen}
          onOpenChange={() => setIsJobCloneOpen(false)}
          jobId={selectedJob.id}
          onSuccess={() => {
            setIsJobCloneOpen(false);
            fetchJobs();
          }}
        />
      )}
    </Layout>
  );
}
