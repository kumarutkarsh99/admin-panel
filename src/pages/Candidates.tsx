import Layout from "@/components/Layout";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, FileText, Calendar, Download } from "lucide-react";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import CandidateViewList from "@/components/CandidateViewTable";

const API_BASE_URL = "http://51.20.181.155:3000";

interface CandidateForm {
  id: number;
  job_id: string;
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

export default function Candidates() {
  const [candidates, setCandidates] = useState<CandidateForm[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleExport = () => {
    if (!candidates.length) {
      alert("No candidates to export.");
      return;
    }

    const header = [
      "Name",
      "Job ID",
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

    const rows = candidates.map((c) => [
      `${c.first_name} ${c.last_name}`,
      c.job_id,
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
          </div>
        </div>
        <CandidateViewList
          loading={loading}
          candidates={candidates}
          fetchCandidates={fetchCandidates}
        />

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
