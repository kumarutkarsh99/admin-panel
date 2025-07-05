import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, GraduationCap, BookOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";

const API_BASE_URL = "http://51.20.181.155:3000";

export default function ViewApplicationsModal({ open, onOpenChange, jobId }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !jobId) return;
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/jobs/${jobId}/applicants`)
      .then(({ data }) => {
        if (data.status) {
          setApplicants(data.result);
        } else {
          throw new Error(data.message || "Failed to fetch applicants");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [open, jobId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-custom max-w-6xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>View Applications</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : applicants.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">
            No applications found.
          </p>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <Card
                key={app.id}
                className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                {/* Left: Avatar & Name */}
                <div className="flex-shrink-0 flex items-center p-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-semibold text-gray-500">
                    {app.first_name?.[0] || "-"}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-semibold text-gray-800 leading-tight">
                      {app.first_name || "-"} {app.last_name || ""}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {app.headline}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block h-12 border-l border-gray-200" />

                {/* Middle: Details */}
                <div className="flex-1 px-4 py-3 grid grid-cols-2 gap-x-6 text-sm text-gray-700">
                  {[
                    [
                      <Mail className="w-4 h-4 text-gray-400" />,
                      app.email || "N/A",
                    ],
                    [
                      <Phone className="w-4 h-4 text-gray-400" />,
                      app.phone || "N/A",
                    ],
                    [
                      <GraduationCap className="w-4 h-4 text-gray-400" />,
                      app.college || "N/A",
                    ],
                    [
                      <BookOpen className="w-4 h-4 text-gray-400" />,
                      app.degree || "N/A",
                    ],
                    [
                      <Star className="w-4 h-4 text-gray-400" />,
                      app.rating || "-",
                    ],
                  ].map(([icon, value], i) => (
                    <div key={i} className="flex items-center space-x-2">
                      {icon}
                      <span className="text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="hidden sm:block h-12 border-l border-gray-200" />

                {/* Right: Actions & Status */}
                <div className="flex flex-col items-center p-4 space-y-2">
                  <Badge className="bg-gray-100 text-gray-800 px-3 py-1 text-xs font-medium rounded-full">
                    {app.recruiter_status}
                  </Badge>
                  <div className="flex space-x-2">
                    {app.resume_url && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="py-1 px-3 text-sm flex items-center gap-1"
                      >
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <BookOpen className="w-4 h-4" /> Resume
                        </a>
                      </Button>
                    )}
                    {app.cover_letter && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="py-1 px-3 text-sm flex items-center gap-1"
                      >
                        <a
                          href={app.cover_letter}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <BookOpen className="w-4 h-4" /> Cover Letter
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
