
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, MapPin, Clock, Users, MoreHorizontal, Building2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    client: "TechCorp Solutions",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "Active",
    applicants: 24,
    posted: "2 days ago",
    salary: "$120k - $160k",
    priority: "High"
  },
  {
    id: 2,
    title: "Product Manager",
    client: "FinanceFlow Inc",
    department: "Product",
    location: "Remote",
    type: "Full-time", 
    status: "Active",
    applicants: 18,
    posted: "5 days ago",
    salary: "$130k - $170k",
    priority: "Medium"
  },
  {
    id: 3,
    title: "UX Designer",
    client: "Creative Studios",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    status: "Draft",
    applicants: 0,
    posted: "1 week ago",
    salary: "$100k - $140k",
    priority: "Low"
  },
  {
    id: 4,
    title: "Backend Engineer",
    client: "TechCorp Solutions",
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    status: "Active",
    applicants: 31,
    posted: "3 days ago",
    salary: "$110k - $150k",
    priority: "High"
  },
  {
    id: 5,
    title: "Marketing Specialist",
    client: "RetailMax Group",
    department: "Marketing",
    location: "Los Angeles, CA",
    type: "Contract",
    status: "Paused",
    applicants: 12,
    posted: "1 week ago",
    salary: "$80k - $100k",
    priority: "Medium"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Draft": return "bg-yellow-100 text-yellow-800";
    case "Paused": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-orange-100 text-orange-800";
    case "Low": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const Jobs = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Client Jobs</h1>
            <p className="text-slate-600 mt-1">Manage job postings from your clients and track applications.</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search jobs..." 
                  className="pl-10 bg-white/80"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/80">Client</Button>
                <Button variant="outline" className="bg-white/80">Status</Button>
                <Button variant="outline" className="bg-white/80">Priority</Button>
                <Button variant="outline" className="bg-white/80">Location</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-800">{job.title}</h3>
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                      <Badge className={getPriorityColor(job.priority)}>{job.priority}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-blue-600">{job.client}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applicants} applicants
                      </div>
                      <span>Posted {job.posted}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-800">{job.department}</span>
                      <span className="text-sm font-semibold text-green-600">{job.salary}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white/80">
                      View Applications
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                        <DropdownMenuItem>Edit Job</DropdownMenuItem>
                        <DropdownMenuItem>Clone Job</DropdownMenuItem>
                        <DropdownMenuItem>Contact Client</DropdownMenuItem>
                        <DropdownMenuItem>Archive Job</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Job</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
