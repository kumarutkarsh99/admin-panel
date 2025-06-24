import Layout from "@/components/Layout";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AddCandidateModal from "@/components/modals/AddCandidateModal";
import { FilterColumnsModal } from "@/components/modals/FilterCoulmnModal";
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
  Download,
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
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const API_BASE_URL = "http://51.20.181.155:3000";

interface CandidateForm {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin: string;
  headline: string;
  status: string;
  address: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  experience: string;
  photo_url: string;
  education: string;
  summary: string;
  resume_url: string;
  cover_letter: string;
  rating: string;
  hmapproval: string;
  recruiter_status: string;
  current_company: string;
  current_ctc: string;
  expected_ctc: string;
  currency: string;
  skill: string[];
  college: string;
  degree: string;
}

const getStatusColor = (status: string) =>
  ({
    Application:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900",
    Screening:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900",
    Interview:
      "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900",
    Hired:
      "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900",
    Rejected: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900",
  }[status] ||
  "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900");

const getRecruiterStatusColor = (status: string) =>
  ({
    "New Application":
      "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800",
    "Initial Review":
      "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800",
    "Screening Complete":
      "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800",
    Recommended:
      "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800",
    "Not Suitable":
      "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800",
  }[status] ||
  "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800");

const getHMApprovalColor = (status: string) =>
  ({
    Pending:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900",
    Approved:
      "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900",
    Rejected: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900",
    "Not Required":
      "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700",
  }[status] ||
  "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700");

const TABS = [
  ["All", "all"],
  ["Status", "status"],
  ["Recruiter", "recruiter"],
  ["HM Approval", "hm"],
  ["CTC Range", "ctc"],
] as const;

const ALL_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "headline", label: "Headline" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email Address" },
  { key: "current_company", label: "Current Company" },
  { key: "current_ctc", label: "Current CTC" },
  { key: "expected_ctc", label: "Expected CTC" },
  { key: "skill", label: "Skills" },
  { key: "education", label: "Education" },
  { key: "rating", label: "Rating" },
  { key: "status", label: "Candidate Status" },
  { key: "recruiter_status", label: "Recruiter Status" },
  { key: "hmapproval", label: "HM Approval" },
];

export default function Candidates() {
  const [candidates, setCandidates] = useState<CandidateForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "status" | "recruiter" | "hm" | "ctc"
  >("all");
  const term = searchQuery.toLowerCase().trim();
  const itemsPerPage = 5;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.key)
  );
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const allIds = useMemo(() => candidates.map((c) => c.id), [candidates]);
  const allSelected = useMemo(
    () => allIds.length > 0 && allIds.every((id) => selected.has(id)),
    [allIds, selected]
  );

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  };

  const handleDelete = () => {
    console.log("delete: ", Array.from(selected));
  };
  const handleEdit = () => {
    console.log("edit: ", Array.from(selected));
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/candidate/getAllCandidates`
      );
      setCandidates(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (key: string, show: boolean) => {
    setVisibleColumns((prev) =>
      show ? [...prev, key] : prev.filter((c) => c !== key)
    );
  };

  const filtered = candidates.filter((c) => {
    if (!term) return true;

    switch (activeTab) {
      case "status":
        return c.status?.toLowerCase().includes(term);
      case "recruiter":
        return c.recruiter_status?.toLowerCase().includes(term);
      case "hm":
        return c.hmapproval?.toLowerCase().includes(term);
      case "ctc":
        const ctcValue = parseFloat(c.current_ctc);
        if (term.includes("-")) {
          const [min, max] = term.split("-").map(Number);
          return (
            !isNaN(min) && !isNaN(max) && ctcValue >= min && ctcValue <= max
          );
        }
        return c.current_ctc?.toLowerCase().includes(term);
      case "all":
      default:
        const name = `${c.first_name} ${c.last_name}`.toLowerCase();
        const skills = c.skill?.join(" ").toLowerCase() || "";
        const company = c.current_company?.toLowerCase() || "";
        const email = c.email?.toLowerCase() || "";
        const phone = c.phone?.toLowerCase() || "";
        const rating = c.rating || "";
        return (
          name.includes(term) ||
          skills.includes(term) ||
          company.includes(term) ||
          email.includes(term) ||
          phone.includes(term) ||
          rating.includes(term)
        );
    }
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  const handleExport = () => {
    if (!filtered.length) {
      alert("No candidates to export.");
      return;
    }

    const header = [
      "Name",
      "Email",
      "Phone",
      "LinkedIn",
      "Status",
      "Company",
      "Experience",
      "CTC",
      "Expected CTC",
      "Currency",
      "Location",
      "Skills",
    ];

    const rows = filtered.map((c) => [
      `${c.first_name} ${c.last_name}`,
      c.email,
      c.phone,
      c.linkedin,
      c.status,
      c.current_company,
      c.experience,
      c.current_ctc,
      c.expected_ctc,
      c.currency,
      `${c.street1}, ${c.city}, ${c.state}, ${c.country}, ${c.zipcode}`,
      c.skill?.join(";") || "",
    ]);

    const csvContent = [header, ...rows]
      .map((r) => r.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, "candidates.csv");
    toast.success("Exported CSV file successfully!");
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Candidates Pipeline
            </h1>
            <p className="text-slate-600 text-sm">
              Manage candidate workflow and approvals
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="bg-white/80"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
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
        <FilterColumnsModal
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          columns={ALL_COLUMNS.filter((c) => c.key !== "name")}
          visibleColumns={visibleColumns}
          onChange={toggleColumn}
        />
        <AddCandidateModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
        />

        {/* Search and Quick Actions */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === "all"
                      ? "Search any field…"
                      : `Search by ${
                          activeTab === "status"
                            ? "Status"
                            : activeTab === "recruiter"
                            ? "Recruiter Status"
                            : activeTab === "hm"
                            ? "HM Approval"
                            : "CTC Range (e.g. 3-7)"
                        }…`
                  }
                  className="pl-10 bg-white/80 h-9"
                />
              </div>
              <div className="flex gap-2">
                {TABS.map(([label, key]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={activeTab === key ? "secondary" : "outline"}
                    onClick={() => {
                      setActiveTab(key);
                      setSearchQuery("");
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Candidates Table */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800 flex items-center justify-between">
              <div>
                Candidates ({filtered.length}) • Page {currentPage} of{" "}
                {totalPages}
              </div>
              <Button
                className="text-sm font-medium"
                onClick={() => setIsFilterOpen(true)}
                variant="outline"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter Columns
              </Button>
            </CardTitle>
            {/* Action bar when selections exist */}
            {selected.size > 0 && (
              <div className="flex items-center gap-4 p-2 rounded">
                <span>{selected.size} selected</span>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelected(new Set());
                  }}
                  variant="outline"
                >
                  Clear Selection
                </Button>
                <Button size="sm" variant="outline">
                  Email
                </Button>
                <Button size="sm" variant="outline">
                  Disqualify
                </Button>
                <Button size="sm" variant="outline">
                  Add to Campaign
                </Button>
                <Button size="sm" variant="outline">
                  Pitch Candidates
                </Button>
                <Button size="sm" variant="outline">
                  Add to Job
                </Button>
                <Button size="sm" onClick={handleEdit} variant="outline">
                  Update fields
                </Button>
                <Button size="sm" onClick={handleDelete} variant="destructive">
                  Delete records
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-[600px] max-w-[95vw] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white/90 backdrop-blur-sm">
                  <TableRow>
                    {/* Select-all checkbox */}
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => setSelected(new Set(allIds))}
                        aria-label="Select all"
                        className="outline-none border-0 bg-gray-200"
                      />
                    </TableHead>
                    {ALL_COLUMNS.map((col) =>
                      visibleColumns.includes(col.key) ? (
                        <TableHead
                          className="whitespace-nowrap text-black"
                          key={col.key}
                        >
                          {col.label}
                        </TableHead>
                      ) : null
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10}>Loading...</TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((candidate) => (
                      <TableRow
                        key={candidate.id}
                        className="hover:bg-slate-50/50"
                      >
                        <TableCell className="w-12">
                          <Checkbox
                            checked={selected.has(candidate.id)}
                            onCheckedChange={() => toggleOne(candidate.id)}
                            aria-label={`Select ${candidate.first_name}`}
                            className="outline-none border-0 bg-gray-200"
                          />
                        </TableCell>
                        {visibleColumns.includes("name") && (
                          <TableCell className="py-2 min-w-[150px]">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                  {[
                                    candidate.first_name[0],
                                    candidate.last_name[0],
                                  ].filter(Boolean)}
                                  {}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-sm text-slate-600 whitespace-nowrap">
                                {candidate.first_name +
                                  " " +
                                  candidate.last_name}
                                {}
                              </div>
                            </div>
                          </TableCell>
                        )}

                        {visibleColumns.includes("headline") && (
                          <TableCell className="min-w-[150px]">
                            <div className="text-sm text-slate-600 flex items-center whitespace-nowrap">
                              {candidate.headline}
                            </div>
                          </TableCell>
                        )}

                        {visibleColumns.includes("phone") && (
                          <TableCell className="min-w-[150px]">
                            <div className="text-sm whitespace-nowrap text-slate-500">
                              {candidate.phone}
                            </div>
                          </TableCell>
                        )}

                        {visibleColumns.includes("email") && (
                          <TableCell className="min-w-[150px]">
                            <div className="text-sm whitespace-nowrap text-slate-500">
                              {candidate.email}
                            </div>
                          </TableCell>
                        )}

                        {visibleColumns.includes("current_company") && (
                          <TableCell className="min-w-[150px]">
                            <span className="inline-flex items-center gap-1 text-sm text-slate-500 whitespace-nowrap">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {candidate.current_company}
                            </span>
                          </TableCell>
                        )}

                        {visibleColumns.includes("current_ctc") && (
                          <TableCell className="py-2 min-w-[150px] whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                              <DollarSign className="w-3 h-3 text-green-600" />
                              {candidate.current_ctc}
                            </span>
                          </TableCell>
                        )}

                        {visibleColumns.includes("expected_ctc") && (
                          <TableCell className="py-2 min-w-[150px] whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                              <DollarSign className="w-3 h-3 text-green-600" />
                              {candidate.expected_ctc}
                            </span>
                          </TableCell>
                        )}

                        {visibleColumns.includes("skill") && (
                          <TableCell className="py-2 min-w-[150px] whitespace-nowrap">
                            <div className="flex flex-nowrap gap-1 overflow-x-auto">
                              {Array.isArray(candidate.skill) &&
                                candidate.skill
                                  .slice(0, 2)
                                  .map((skill, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="bg-slate-100 text-slate-700 text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}

                              {Array.isArray(candidate.skill) &&
                                candidate.skill.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-slate-100 text-slate-700 text-xs"
                                  >
                                    +{candidate.skill.length - 2}
                                  </Badge>
                                )}
                            </div>
                          </TableCell>
                        )}

                        {visibleColumns.includes("education") && (
                          <TableCell className="py-2 min-w-[150px] whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <span className="inline-flex items-center font-medium gap-1 text-sm text-slate-600">
                                <GraduationCap className="w-4 h-4 text-slate-600" />
                                {candidate.college}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">
                              {candidate.degree}
                            </span>
                          </TableCell>
                        )}

                        {visibleColumns.includes("rating") && (
                          <TableCell>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-slate-600">
                                {candidate.rating}
                              </span>
                            </div>
                          </TableCell>
                        )}

                        {visibleColumns.includes("status") && (
                          <TableCell className="p-2">
                            <Badge
                              className={`${getStatusColor(
                                candidate.status
                              )} text-xs w-full block text-center p-1`}
                            >
                              {candidate.status}
                            </Badge>
                          </TableCell>
                        )}

                        {visibleColumns.includes("recruiter_status") && (
                          <TableCell className="p-2">
                            <Badge
                              className={`${getRecruiterStatusColor(
                                candidate.recruiter_status
                              )} text-xs w-full block text-center p-1`}
                            >
                              {candidate.recruiter_status}
                            </Badge>
                          </TableCell>
                        )}

                        {visibleColumns.includes("hmapproval") && (
                          <TableCell className="p-2">
                            <Badge
                              className={`${getHMApprovalColor(
                                candidate.hmapproval
                              )} text-xs w-full block text-center`}
                            >
                              {candidate.hmapproval}
                            </Badge>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Pagination */}
        <CardContent className="flex justify-center space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <Button
                key={page}
                variant={page === currentPage ? "outline" : "default"}
                onClick={() => setCurrentPage(page)}
                className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm"
              >
                {page}
              </Button>
            );
          })}
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm"
          >
            Next
          </Button>
        </CardContent>

        {/* Agency Workflow Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">
                    Pending Recruiter Review
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      candidates.filter(
                        (c) => c.recruiter_status === "New Application"
                      ).length
                    }
                  </p>
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
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      candidates.filter((c) => c.hmapproval === "Pending")
                        .length
                    }
                  </p>
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
                  <p className="text-2xl font-bold text-green-600">
                    {candidates.filter((c) => c.status === "Interview").length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
