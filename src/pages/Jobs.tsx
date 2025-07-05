import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MapPin,
  Clock,
  Users,
  MoreHorizontal,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostNewJobModal from "@/components/modals/PostNewJobModal";
import CloneJobModal from "@/components/modals/CloneJobModal";
import EditJobModal from "@/components/modals/EditJobModal";
import JobViewModal from "@/components/modals/JobViewModal";
import ViewApplicationsModal from "@/components/modals/ViewApplicationModal";

const API_BASE_URL = "http://51.20.181.155:3000";

type Job = {
  id: number;
  job_code: string;
  job_title: string;
  company_industry: string;
  company_job_function: string;
  department: string;
  workplace: string;
  office_primary_location: string;
  office_on_careers_page: boolean;
  office_location_additional: string[];
  description_about: string;
  description_requirements: string;
  description_benefits: string;
  employment_type: string;
  experience: string;
  education: string;
  keywords: string[];
  salary_from: string;
  salary_to: string;
  salary_currency: string;
  status: string;
  priority: string;
  applicants: number;
  posted: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Draft":
      return "bg-yellow-100 text-yellow-800";
    case "Paused":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-orange-100 text-orange-800";
    case "Low":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCloneModal, setOpenCloneModal] = useState(false);
  const [openJobView, setOpenJobView] = useState<boolean>(false);
  const [openApplicationModal, setOpenApplicationModal] =
    useState<boolean>(false);

  const itemsPerPage = 5;

  const fetchJobList = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/jobs/getAllJobs`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const mapped: Job[] = data.result.map((item: any) => ({
          ...item,
          applicants: 0,
          posted: "Just now",
        }));
        setJobs(mapped);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobList();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Job Deleted Successfully.");
      fetchJobList();
      setCurrentPage(1);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        alert("Failed to delete job: " + err.message);
      }
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.office_primary_location
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIdx, startIdx + itemsPerPage);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Client Jobs</h1>
            <p className="text-slate-600 mt-1">
              Manage job postings from your clients and track applications.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" /> Post New Job
          </Button>
        </div>

        <PostNewJobModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            fetchJobList();
          }}
        />

        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-10 bg-white/80"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && <p>Loading jobs…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && filteredJobs.length === 0 && (
          <p className="text-slate-500">No jobs found.</p>
        )}

        <div className="space-y-4">
          {currentJobs.map((job) => (
            <Card
              key={job.id}
              className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        onClick={() => {
                          setSelectedJob(job);
                          setOpenJobView(true);
                        }}
                        className="text-xl font-semibold text-slate-800 hover:cursor-pointer"
                      >
                        {job.job_title}
                      </h3>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <Badge className={getPriorityColor(job.priority)}>
                        {job.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-blue-600">
                        {job.company_industry}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.office_primary_location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.employment_type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applicants} applicants
                      </div>
                      <span>Posted {job.posted}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-800">
                        {job.department}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {job.salary_from} - {job.salary_to}{" "}
                        {job.salary_currency}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        setSelectedJob(job);
                        setOpenApplicationModal(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-white/80"
                    >
                      View Applications
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white/95 backdrop-blur-sm"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedJob(job);
                            setOpenEditModal(true);
                          }}
                        >
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedJob(job);
                            setOpenCloneModal(true);
                          }}
                        >
                          Clone Job
                        </DropdownMenuItem>
                        <DropdownMenuItem>Contact Client</DropdownMenuItem>
                        <DropdownMenuItem>Archive Job</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={() => handleDelete(job.id)}
                        >
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && !error && jobs.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "outline" : "default"}
                  onClick={() => setCurrentPage(page)}
                  className={
                    page === currentPage
                      ? ""
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  }
                >
                  {page}
                </Button>
              );
            })}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {selectedJob && (
        <EditJobModal
          open={openEditModal}
          onOpenChange={setOpenEditModal}
          jobId={selectedJob.id}
          onSuccess={fetchJobList}
        />
      )}

      {selectedJob && (
        <CloneJobModal
          open={openCloneModal}
          onOpenChange={setOpenCloneModal}
          jobId={String(selectedJob.id)}
          onSuccess={fetchJobList}
        />
      )}

      {openJobView && (
        <JobViewModal
          open={openJobView}
          onOpenChange={setOpenJobView}
          job={selectedJob}
        />
      )}

      {openApplicationModal && (
        <ViewApplicationsModal
          open={openApplicationModal}
          onOpenChange={setOpenApplicationModal}
          jobId={selectedJob.id}
        />
      )}
    </Layout>
  );
};

export default Jobs;
