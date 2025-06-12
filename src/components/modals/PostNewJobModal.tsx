// PostNewJobModal.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";

interface PostNewJobModalProps {
  open: boolean;
  onClose: () => void;
}

const initialForm = {
  jobTitle: "",
  jobCode: "",
  department: "",
  workplace: "On-site",
  officeLocation: {
    primary: "",
    onCareersPage: true,
    additional: [] as string[],
  },
  description: {
    about: "",
    requirements: "",
    benefits: "",
  },
  companyDetails: {
    industry: "",
    jobFunction: "",
  },
  employmentDetails: {
    employmentType: "",
    experience: "",
    education: "",
    keywords: [] as string[],
  },
  salary: {
    from: 0,
    to: 0,
    currency: "",
  },
};

const PostNewJobModal: React.FC<PostNewJobModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState(initialForm);
  const [additionalInput, setAdditionalInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.jobTitle.trim())
      newErrors.jobTitle = "Job title is required.";
    if (!formData.jobCode.trim()) newErrors.jobCode = "Job code is required.";
    if (!formData.department.trim())
      newErrors.department = "Department is required.";
    if (!formData.officeLocation.primary.trim())
      newErrors.officeLocation = "Primary office location is required.";
    if (!formData.workplace.trim())
      newErrors.workplace = "Workplace selection is required.";
    if (!formData.description.about.trim())
      newErrors.about = "Job summary is required.";
    if (!formData.companyDetails.industry.trim())
      newErrors.industry = "Industry is required.";
    if (!formData.companyDetails.jobFunction.trim())
      newErrors.jobFunction = "Job function is required.";
    if (formData.salary.from < 0)
      newErrors.salaryFrom = "Salary from must be >= 0.";
    if (formData.salary.to < 0) newErrors.salaryTo = "Salary to must be >= 0.";
    if (formData.salary.from > formData.salary.to)
      newErrors.salaryRange = "Salary from cannot exceed salary to.";
    if (!formData.salary.currency.trim())
      newErrors.currency = "Currency is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const addKeyword = () => {
    if (
      keywordInput.trim() &&
      !formData.employmentDetails.keywords.includes(keywordInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        employmentDetails: {
          ...prev.employmentDetails,
          keywords: [...prev.employmentDetails.keywords, keywordInput.trim()],
        },
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData((prev) => ({
      ...prev,
      employmentDetails: {
        ...prev.employmentDetails,
        keywords: prev.employmentDetails.keywords.filter((k) => k !== kw),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const payload = {
      ...formData,
      officeLocation: {
        ...formData.officeLocation,
        additional: additionalInput
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      },
    };

    try {
      const res = await fetch("/api/jobs/createJob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Job Created:", data);
      toast.success("Job Created Successfully");
      setFormData(initialForm);
      setAdditionalInput("");
      setKeywordInput("");
      onClose();
    } catch (err) {
      toast.error("Failed to create job");
      console.error("Failed to create job", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Post a New Job
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Work Details */}
            <div className="md:col-span-2 mb-2">
              <h3 className="text-xl font-semibold">Work Details</h3>
            </div>
            <div>
              <label className="text-sm">Job Title</label>
              <Input
                placeholder="Frontend Developer"
                value={formData.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-xs">{errors.jobTitle}</p>
              )}
            </div>
            <div>
              <label className="text-sm">Job Code</label>
              <Input
                placeholder="JOB-001"
                value={formData.jobCode}
                onChange={(e) => handleChange("jobCode", e.target.value)}
              />
              {errors.jobCode && (
                <p className="text-red-500 text-xs">{errors.jobCode}</p>
              )}
            </div>
            <div>
              <label className="text-sm">Department</label>
              <Input
                placeholder="Engineering"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
              />
              {errors.department && (
                <p className="text-red-500 text-xs">{errors.department}</p>
              )}
            </div>
            <div>
              <label className="text-sm">Office Location</label>
              <Input
                placeholder="New York, NY"
                value={formData.officeLocation.primary}
                onChange={(e) =>
                  handleNestedChange(
                    "officeLocation",
                    "primary",
                    e.target.value
                  )
                }
              />
              {errors.officeLocation && (
                <p className="text-red-500 text-xs">{errors.officeLocation}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm">Workplace</label>
              <ToggleGroup
                type="single"
                value={formData.workplace}
                onValueChange={(v) => handleChange("workplace", v)}
                className="flex gap-2"
              >
                <ToggleGroupItem value="On-site">On-site</ToggleGroupItem>
                <ToggleGroupItem value="Hybrid">Hybrid</ToggleGroupItem>
                <ToggleGroupItem value="Remote">Remote</ToggleGroupItem>
              </ToggleGroup>
              {errors.workplace && (
                <p className="text-red-500 text-xs">{errors.workplace}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm">Show on Careers Page</label>
              <ToggleGroup
                type="single"
                value={String(formData.officeLocation.onCareersPage)}
                onValueChange={(v) =>
                  handleNestedChange(
                    "officeLocation",
                    "onCareersPage",
                    v === "true"
                  )
                }
                className="flex gap-2"
              >
                <ToggleGroupItem value="true">Yes</ToggleGroupItem>
                <ToggleGroupItem value="false">No</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Additional Locations</label>
              <Input
                placeholder="San Francisco, London"
                value={additionalInput}
                onChange={(e) => setAdditionalInput(e.target.value)}
              />
            </div>

            {/* Job Description */}
            <div className="md:col-span-2 mt-4 mb-2">
              <h3 className="text-xl font-semibold">Job Description</h3>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">About</label>
              <Textarea
                placeholder="Describe the job"
                rows={4}
                value={formData.description.about}
                onChange={(e) =>
                  handleNestedChange("description", "about", e.target.value)
                }
              />
              {errors.about && (
                <p className="text-red-500 text-xs">{errors.about}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Requirements</label>
              <Textarea
                placeholder="List requirements"
                rows={3}
                value={formData.description.requirements}
                onChange={(e) =>
                  handleNestedChange(
                    "description",
                    "requirements",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Benefits</label>
              <Textarea
                placeholder="List benefits"
                rows={3}
                value={formData.description.benefits}
                onChange={(e) =>
                  handleNestedChange("description", "benefits", e.target.value)
                }
              />
            </div>

            {/* for file upload */}
            {/* <div className="md:col-span-2">
              <label className="text-sm">Upload Job Document</label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e)}
                className="bg-white mt-1"
              />
              {formData.description.file && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {formData.description.file.name}
                </p>
              )}
            </div> */}

            {/* Company Details */}
            <div className="md:col-span-2 mt-4 mb-2">
              <h3 className="text-xl font-semibold">Company Details</h3>
            </div>
            <div>
              <label className="text-sm">Industry</label>
              <Input
                placeholder="IT Services"
                value={formData.companyDetails.industry}
                onChange={(e) =>
                  handleNestedChange(
                    "companyDetails",
                    "industry",
                    e.target.value
                  )
                }
              />
              {errors.industry && (
                <p className="text-red-500 text-xs">{errors.industry}</p>
              )}
            </div>
            <div>
              <label className="text-sm">Job Function</label>
              <Input
                placeholder="Software Development"
                value={formData.companyDetails.jobFunction}
                onChange={(e) =>
                  handleNestedChange(
                    "companyDetails",
                    "jobFunction",
                    e.target.value
                  )
                }
              />
              {errors.jobFunction && (
                <p className="text-red-500 text-xs">{errors.jobFunction}</p>
              )}
            </div>

            {/* Employment Details */}
            <div className="md:col-span-2 mt-4 mb-2">
              <h3 className="text-xl font-semibold">Employment Details</h3>
            </div>
            <div>
              <label className="text-sm">Employment Type</label>
              <Input
                placeholder="Full-time"
                value={formData.employmentDetails.employmentType}
                onChange={(e) =>
                  handleNestedChange(
                    "employmentDetails",
                    "employmentType",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="text-sm">Experience</label>
              <Input
                placeholder="2 years"
                value={formData.employmentDetails.experience}
                onChange={(e) =>
                  handleNestedChange(
                    "employmentDetails",
                    "experience",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="text-sm">Education</label>
              <Input
                placeholder="Bachelor's Degree"
                value={formData.employmentDetails.education}
                onChange={(e) =>
                  handleNestedChange(
                    "employmentDetails",
                    "education",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Keywords */}
            <div className="md:col-span-2">
              <label className="text-sm">Keywords</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a keyword"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addKeyword())
                  }
                />
                <Button type="button" onClick={addKeyword} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Add
                </Button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {formData.employmentDetails.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-200 rounded text-sm"
                  >
                    {kw}{" "}
                    <button
                      onClick={() => removeKeyword(kw)}
                      className="ml-1 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="text-sm">Salary From</label>
              <Input
                type="number"
                value={formData.salary.from}
                onChange={(e) =>
                  handleNestedChange("salary", "from", Number(e.target.value))
                }
              />
              {errors.salaryFrom && (
                <p className="text-red-500 text-xs">{errors.salaryFrom}</p>
              )}
            </div>
            <div>
              <label className="text-sm">Salary To</label>
              <Input
                type="number"
                value={formData.salary.to}
                onChange={(e) =>
                  handleNestedChange("salary", "to", Number(e.target.value))
                }
              />
              {errors.salaryTo && (
                <p className="text-red-500 text-xs">{errors.salaryTo}</p>
              )}
              {errors.salaryRange && (
                <p className="text-red-500 text-xs">{errors.salaryRange}</p>
              )}
            </div>
            <div>
              <label className="text-sm">Currency</label>
              <Input
                placeholder="USD"
                value={formData.salary.currency}
                onChange={(e) =>
                  handleNestedChange("salary", "currency", e.target.value)
                }
              />
              {errors.currency && (
                <p className="text-red-500 text-xs">{errors.currency}</p>
              )}
            </div>

            {/* Actions */}
            <div className="md:col-span-2 mt-4 flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostNewJobModal;
