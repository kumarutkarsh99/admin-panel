import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, FileText, Calendar, Download } from "lucide-react";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import CandidateViewList from "@/components/CandidateViewTable";

const API_BASE_URL = "http://51.20.181.155:3000";

// --- CORRECTED INTERFACE ---
// This now accurately reflects the data from your API response.
interface CandidateForm {
  id: number;
  job_id: number; // Corrected: Was string, API sends number
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string | null;
  status: string;
  address: string; // This is a JSON string from the API
  experience: string; // This is a JSON string
  photo_url: string | null;
  education: string; // This is a JSON string
  summary: string | null;
  resume_url: string;
  cover_letter: string | null;
  rating: string | null;
  hmapproval: string;
  recruiter_status: string;
  current_company: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  skill: string[];
  college: string | null;
  degree: string | null;
  created_at: string; // Added: Was missing
  updated_at: string; // Added: Was missing
  linkedinprofile: string; // Corrected: Was 'linkedin'
  institutiontier: string; // Added: Was missing
  companytier: string; // Added: Was missing
}

// Helper interface for the parsed address
interface ParsedAddress {
  firstline: string;
  city: string | null;
  pincode: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
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
      toast.error("Failed to fetch candidates.");
    } finally {
      setLoading(false);
    }
  };

  // --- CORRECTED EXPORT LOGIC ---
  const handleExport = () => {
    if (!candidates.length) {
      toast.warning("No candidates to export.");
      return;
    }

    // Header updated to match available data
    const header = [
      "Name",
      "Job ID",
      "Email",
      "Phone",
      "LinkedIn",
      "Status",
      "Current Company",
      "Location",
      "Skills",
    ];

    const rows = candidates.map((c) => {
      // Safely parse the address JSON string
      let location = "N/A";
      try {
        const addresses: ParsedAddress[] = JSON.parse(c.address);
        if (addresses && addresses.length > 0) {
          // Use the first available address for the location
          const firstAddress = addresses[0];
          location = [
            firstAddress.firstline,
            firstAddress.city,
            firstAddress.country,
          ]
            .filter(Boolean) // Remove null or empty parts
            .join(", ");
        }
      } catch (e) {
        console.error("Failed to parse address for candidate ID:", c.id);
      }

      return [
        `${c.first_name} ${c.last_name}`,
        c.job_id,
        c.email,
        c.phone,
        c.linkedinprofile, // Corrected: Use 'linkedinprofile'
        c.status,
        c.current_company || "N/A", // Provide fallback for null values
        location,
        c.skill?.join(";") || "N/A",
      ];
    });

    // Enclose each field in quotes to handle commas within fields
    const csvContent = [header, ...rows]
      .map((r) =>
        r.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, "candidates.csv");
    toast.success("Exported CSV file successfully!");
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Candidates Pipeline
            </h1>
            <p className="text-sm text-slate-600">
              Manage candidate workflow and approvals
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="bg-white/80"
              disabled={loading} // Disable button while loading
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <CandidateViewList
          loading={loading}
          candidates={candidates}
          fetchCandidates={fetchCandidates}
        />

        {/* The stats cards section remains the same and will work correctly now */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
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
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
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
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Ready for Interview</p>
                  <p className="text-2xl font-bold text-green-600">
                    {candidates.filter((c) => c.status === "Interview").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
