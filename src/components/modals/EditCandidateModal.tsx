import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const API_BASE_URL = "http://13.51.235.31:3000";

interface CandidateProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string | null;
  photo_url: string | null;
  education: string;
  experience: string;
  current_ctc: string | null;
  expected_ctc: string | null;
  skill: string[];
  current_company: string | null;
  linkedinprofile: string;
  rating: number | string | null;
  status: string;
  recruiter_status: string;
  hmapproval: string;
  notice_period: string;
  institutiontier: string;
  companytier: string;
  resume_url: string;
  job_titles: string[];
}

interface EditCandidateModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  candidate: CandidateProfile | null;
  onSaveSuccess?: () => void;
}

const parseJsonString = <T,>(value: string | T, defaultValue: T): T => {
  if (!value || typeof value !== "string") {
    return (value as T) || defaultValue;
  }
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed as T;
    }
    return [parsed] as T;
  } catch {
    return defaultValue;
  }
};

const EditCandidateModal: React.FC<EditCandidateModalProps> = ({
  isOpen,
  onOpenChange,
  candidate,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<CandidateProfile> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && candidate) {
      setFormData({
        ...candidate,
        skill: Array.isArray(candidate.skill)
          ? candidate.skill
          : parseJsonString<string[]>(candidate.skill as any, []),
      });
      setError(null);
    }
  }, [isOpen, candidate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skills = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev) => (prev ? { ...prev, skill: skills } : null));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !candidate) return;

    setIsLoading(true);
    setError(null);

    try {
      const updates = [
        {
          field: "first_name",
          action: "change_to",
          value: formData.first_name,
        },
        { field: "last_name", action: "change_to", value: formData.last_name },
        { field: "email", action: "change_to", value: formData.email },
        { field: "phone", action: "change_to", value: formData.phone },
        { field: "headline", action: "change_to", value: formData.headline },
        {
          field: "current_company",
          action: "change_to",
          value: formData.current_company,
        },
        {
          field: "linkedinprofile",
          action: "change_to",
          value: formData.linkedinprofile,
        },
        {
          field: "current_ctc",
          action: "change_to",
          value: formData.current_ctc,
        },
        {
          field: "expected_ctc",
          action: "change_to",
          value: formData.expected_ctc,
        },
        {
          field: "notice_period",
          action: "change_to",
          value: formData.notice_period,
        },
        { field: "status", action: "change_to", value: formData.status },
        {
          field: "recruiter_status",
          action: "change_to",
          value: formData.recruiter_status,
        },
        {
          field: "hmapproval",
          action: "change_to",
          value: formData.hmapproval,
        },
        {
          field: "skill",
          action: "change_to",
          value: JSON.stringify(formData.skill),
        },
      ];

      const payload = {
        ids: [candidate.id],
        updates: updates,
      };
      console.log(payload);
      const res = await axios.post(
        `${API_BASE_URL}/candidate/bulk-update`,
        payload
      );
      console.log(res);
      toast.success("Fields updated successfully!");
      onSaveSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred.";
      setError(errorMessage);
      console.error("Failed to save candidate:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSkills = Array.isArray(formData?.skill)
    ? formData.skill.join(", ")
    : "";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-1/2 lg:w-2/5 sm:max-w-none flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Edit Candidate Details</SheetTitle>
          <SheetDescription>
            Update the candidate's profile and save your changes.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto">
          {formData ? (
            <form onSubmit={handleSave} className="space-y-6 p-6">
              <fieldset className="border p-4 rounded-md">
                <legend className="text-sm font-medium px-1">
                  Personal Information
                </legend>
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border p-4 rounded-md">
                <legend className="text-sm font-medium px-1">
                  Professional Details
                </legend>
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      name="headline"
                      value={formData.headline || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_company">Current Company</Label>
                    <Input
                      id="current_company"
                      name="current_company"
                      value={formData.current_company || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinprofile">
                      LinkedIn Profile URL
                    </Label>
                    <Input
                      id="linkedinprofile"
                      name="linkedinprofile"
                      value={formData.linkedinprofile || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skill">Skills (comma-separated)</Label>
                    <Textarea
                      id="skill"
                      name="skill"
                      value={currentSkills}
                      onChange={handleSkillChange}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border p-4 rounded-md">
                <legend className="text-sm font-medium px-1">
                  Compensation & Availability
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="current_ctc">Current CTC</Label>
                    <Input
                      id="current_ctc"
                      name="current_ctc"
                      value={formData.current_ctc || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expected_ctc">Expected CTC</Label>
                    <Input
                      id="expected_ctc"
                      name="expected_ctc"
                      value={formData.expected_ctc || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notice_period">Notice Period</Label>
                    <Input
                      id="notice_period"
                      name="notice_period"
                      value={formData.notice_period || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border p-4 rounded-md">
                <legend className="text-sm font-medium px-1">
                  Application Status
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      name="status"
                      value={formData.status || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recruiter_status">Recruiter Status</Label>
                    <Input
                      id="recruiter_status"
                      name="recruiter_status"
                      value={formData.recruiter_status || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hmapproval">Hiring Manager Approval</Label>
                    <Input
                      id="hmapproval"
                      name="hmapproval"
                      value={formData.hmapproval || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>
            </form>
          ) : (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          )}
        </div>

        <SheetFooter className="p-6 border-t bg-background sticky bottom-0">
          {error && (
            <Alert variant="destructive" className="text-left mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end w-full space-x-2">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button
              type="submit"
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-500"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditCandidateModal;
