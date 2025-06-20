
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AddCandidateModal from "@/components/modals/AddCandidateModal";
import {
  Search,
  Filter,
  Mail,
  Plus,
  Phone,
  Star,
  MapPin,
  Building2,
  DollarSign,
  GraduationCap,
  MessageSquare,
  UserCheck,
  FileText,
  Eye,
  Calendar,
  Download
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
const API_BASE_URL = 'http://51.20.181.155:3000';
console.log(API_BASE_URL)


interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string;
  status: string;
  address: string;
  experience: string;
  photo_url: string;
  education: string;
  summary: string;
  resume_url: string;
  cover_letter: string;
  created_at: string;
  updated_at: string;
  rating: string;
  hmapproval: string;
  recruiter_status: string;
  current_company: string;
  current_ctc: string;
  expected_ctc: string;
  skill: string[];
  college: string;
  degree: string;

}




const getStatusColor = (status: string) => {
  switch (status) {
    case "Application": return "bg-blue-100 text-blue-800";
    case "Screening": return "bg-yellow-100 text-yellow-800";
    case "Interview": return "bg-purple-100 text-purple-800";
    case "Hired": return "bg-green-100 text-green-800";
    case "Rejected": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getRecruiterStatusColor = (status: string) => {
  switch (status) {
    case "New Application": return "bg-blue-100 text-blue-700";
    case "Initial Review": return "bg-yellow-100 text-yellow-700";
    case "Screening Complete": return "bg-purple-100 text-purple-700";
    case "Recommended": return "bg-green-100 text-green-700";
    case "Not Suitable": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getHMApprovalColor = (status: string) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-800";
    case "Approved": return "bg-green-100 text-green-800";
    case "Rejected": return "bg-red-100 text-red-800";
    case "Not Required": return "bg-gray-100 text-gray-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

const Candidates = () => {
  const [candidates, setcandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
   const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 2;
  // Add more candidates to demonstrate the compact view
  useEffect(() => {
    fetchClients();
  }, []);
  const fetchClients = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${API_BASE_URL}/candidate/getAllCandidates`);// Replace with your actual API URL

      console.log(response)
      setcandidates(response.data.result);
      console.log(response.data.result)
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const extendedCandidates = [...candidates];

    const totalPages = Math.ceil(extendedCandidates.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
   const currentJobs = extendedCandidates.slice(startIdx, startIdx + itemsPerPage);
  const [error, setError] = useState<string | null>(null);
  console.log(extendedCandidates)
  // for (let i = 6; i <= 25; i++) {
  //   extendedCandidates.push({
  //     ...candidates[i % 5],
  //     id: i,
  //     first_name: `Candidate ${i}`,
  //     email: `candidate${i}@email.com`
  //   });
  // }
  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Candidates Pipeline</h1>
            <p className="text-slate-600 text-sm">Manage candidate workflow and approvals</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/80">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </div>
        </div>
        <AddCandidateModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
        />

        {/* Search and Quick Actions */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search candidates by name, skills, company..."
                  className="pl-10 bg-white/80 h-9"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/80">Status</Button>
                <Button variant="outline" size="sm" className="bg-white/80">Skills</Button>
                <Button variant="outline" size="sm" className="bg-white/80">CTC Range</Button>
                <Button variant="outline" size="sm" className="bg-white/80">Recruiter</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Candidates Table */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800">Candidate Database ({extendedCandidates.length} candidates)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white/90 backdrop-blur-sm">
                  <TableRow>
                    <TableHead className="w-[200px]">Candidate</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[150px]">Current Company</TableHead>
                    <TableHead className="w-[100px]">Current CTC</TableHead>
                    <TableHead className="w-[200px]">Skills</TableHead>
                    <TableHead className="w-[150px]">Education</TableHead>
                    <TableHead className="w-[120px]">Recruiter Status</TableHead>
                    <TableHead className="w-[120px]">HM Approval</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extendedCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="hover:bg-slate-50/50">
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                              {[candidate.first_name, candidate.last_name].filter(Boolean).join(',')}

                              { }
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm text-slate-800">{candidate.first_name}{candidate.last_name}</div>
                            <div className="text-xs text-slate-600">{candidate.headline}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="w-3 h-3" />
                              {candidate.address}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <Badge className={`${getStatusColor(candidate.status)} text-xs`}>
                          {candidate.status}
                        </Badge>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-slate-600">{candidate.rating}</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span className="text-sm text-slate-700">{candidate.current_company}</span>
                        </div>
                        <div className="text-xs text-slate-500">{candidate.experience}</div>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-green-600" />
                          <span className="text-sm font-medium text-slate-700">{candidate.current_ctc}</span>
                        </div>
                        <div className="text-xs text-slate-500">Exp: {candidate.expected_ctc}</div>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(candidate.skill) && candidate.skill.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                              {skill}
                            </Badge>
                          ))}

                          {Array.isArray(candidate.skill) && candidate.skill.length > 2 && (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                              +{candidate.skill.length - 2}
                            </Badge>
                          )}



                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-slate-400" />
                          <div>
                            <div className="text-sm text-slate-700">{candidate.college}</div>
                            <div className="text-xs text-slate-500">{candidate.degree}</div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <Badge className={`${getRecruiterStatusColor(candidate.recruiter_status)} text-xs`}>
                          {candidate.recruiter_status}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-2">
                        <Badge className={`${getHMApprovalColor(candidate.hmapproval)} text-xs`}>
                          {candidate.hmapproval}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Calendar className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
                {/* Pagination */}
        {!loading && !error && extendedCandidates.length > itemsPerPage && (
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
                  className= {page==currentPage ? "" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"}
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

        {/* Agency Workflow Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending Recruiter Review</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Awaiting HM Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">5</p>
                </div>
                <FileText className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Ready for Interview</p>
                  <p className="text-2xl font-bold text-green-600">12</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Candidates;
