// PostNewJobModal.tsx

import React, { useState, useEffect } from "react";
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
import axios from "axios";

const API_BASE_URL = "http://51.20.181.155:3000";

interface PostNewJobModalProps {
  open: boolean;
  onClose: () => void;
}
const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary"
];
const experienceLevels = [
  "Entry level",
  "Mid level",
  "Senior level",
  "Director",
  "Executive"
];
const educationLevels = [
  "High School",
  "Associate",
  "Bachelor",
  "Master",
  "Doctorate"
];
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
  company: "",
  about_company:""
};

const PostNewJobModal: React.FC<PostNewJobModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState(initialForm);
  const [additionalInput, setAdditionalInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
   const [allSkills, setAllSkills] = useState<string[]>([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  
  const departments = [
    "Engineering",
    "Human Resources",
    "Sales",
    "Marketing",
    "Finance",
    "Customer Support",
    "Product",
    "Operations",
    "Design",
    "Legal",
  ];
  const officeLocations = [
  "Mumbai, Maharashtra",
  "Delhi, Delhi",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Surat, Gujarat",
  "Bhopal, Madhya Pradesh",
  "Nagpur, Maharashtra",
  "Indore, Madhya Pradesh",
  "Patna, Bihar",
  "Chandigarh, Chandigarh",
  "Noida, Uttar Pradesh",
  "Gurgaon, Haryana",
  "Coimbatore, Tamil Nadu",
  "Visakhapatnam, Andhra Pradesh"
];

const handleOfficeLocationChange = (value: string) => {
  handleNestedChange("officeLocation", "primary", value);

  if (value.length > 0) {
    const filtered = officeLocations.filter((loc) =>
      loc.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  } else {
    setShowSuggestions(false);
  }
};

  // Reset form whenever modal is opened
  useEffect(() => {
    if (open) {
      setFormData(initialForm);
      setAdditionalInput("");
      setKeywordInput("");
      setErrors({});
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch('/api/skills'); // backend proxy endpoint
        const skills = await res.json();
        setAllSkills(skills.map((s: any) => s.skill)); // assuming array of { skill: string }
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    }

    fetchSkills();
  }, []);

  // Add keyword
  const addKeyword = async () => {
    const trimmed = keywordInput.trim();
    if (
      trimmed &&
      !formData.employmentDetails.keywords.includes(trimmed)
    ) {
      // Update UI
      setFormData((prev) => ({
        ...prev,
        employmentDetails: {
          ...prev.employmentDetails,
          keywords: [...prev.employmentDetails.keywords, trimmed],
        },
      }));

      // Save locally
      setAllSkills((prev) =>
        prev.includes(trimmed) ? prev : [...prev, trimmed]
      );

      // Save to backend
      try {
        await fetch('/common/getSkills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skill: trimmed }),
        });
      } catch (err) {
        console.error('Error saving skill:', err);
      }

      setKeywordInput('');
      setShowSkillSuggestions(false);
    }
  };

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
      if (!formData.about_company.trim())
      newErrors.about_company = "Company About is required.";
    if (!formData.company.trim())
      newErrors.company = "Company  is required.";
      
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
     if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = departments.filter((dept) =>
        dept.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    }
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

   const handleSelectSuggestion = (value: string) => {
    setFormData({ ...formData, department: value });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  

  const removeKeyword = (kw: string) => {
    setFormData((prev) => ({
      ...prev,
      employmentDetails: {
        ...prev.employmentDetails,
        keywords: prev.employmentDetails.keywords.filter((k) => k !== kw),
      },
    }));

  const handleParseJD = async () => {
    if (!pastedJD.trim() && !uploadedFile) {
      toast.warning("Please paste a job description or upload a file.");
      return;
    }
    setIsParsing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const parsedData = {
        jobTitle: "Senior Software Engineer (React)",
        description: {
          about:
            "We are seeking an experienced Frontend Developer to join our dynamic team.",
          requirements:
            "5+ years of React experience.\nProficient in TypeScript.",
          benefits: "Health Insurance\nFlexible work hours",
        },
        companyDetails: { industry: "Technology", jobFunction: "Engineering" },
        employmentDetails: {
          experience: "Senior level",
          education: "Bachelor",
          keywords: ["React", "TypeScript", "JavaScript"],
        },
      };

      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        description: { ...prev.description, ...parsedData.description },
        companyDetails: {
          ...prev.companyDetails,
          ...parsedData.companyDetails,
        },
        employmentDetails: {
          ...prev.employmentDetails,
          ...parsedData.employmentDetails,
        },
      }));

      toast.success("Job Description parsed! Please review the details.");
      setActiveTab("manual");
    } catch (error) {
      toast.error("Failed to parse Job Description.");
      console.error("JD Parsing Error:", error);
    } finally {
      setIsParsing(false);
    }
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
      const res = await axios.post(`${API_BASE_URL}/jobs/createJob`, payload);
      console.log("Job Created:", res.data);
      toast.success("Job Created Successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to create job");
      console.error("Failed to create job", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
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
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => {
          if (formData.department) setShowSuggestions(true);
        }}
              />
              {errors.department && (
                <p className="text-red-500 text-xs">{errors.department}</p>
              )}

              {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto shadow-md rounded mt-1">
          {suggestions.map((dept, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(dept)}
            >
              {dept}
            </li>
          ))}
        </ul>
      )}
            </div>
 <div className="relative">
  <label className="text-sm">Office Location</label>
  <Input
    placeholder="New York, NY"
    value={formData.officeLocation.primary}
    onChange={(e) => {
      const value = e.target.value;
      handleNestedChange("officeLocation", "primary", value);
      if (value.trim()) {
        const filtered = officeLocations.filter((loc) =>
          loc.toLowerCase().includes(value.toLowerCase())
        );
        setLocationSuggestions(filtered);
        setShowLocationSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
      }
    }}
    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 100)} // allow click
    onFocus={() => {
      if (formData.officeLocation.primary)
        setShowLocationSuggestions(true);
    }}
  />
  {showLocationSuggestions && locationSuggestions.length > 0 && (
    <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto shadow-md rounded mt-1">
      {locationSuggestions.map((suggestion, index) => (
        <li
          key={index}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onMouseDown={() => {
            handleNestedChange("officeLocation", "primary", suggestion);
            setShowLocationSuggestions(false);
          }}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )}
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

                  {/* Keywords */}
            <div className="md:col-span-2">
              <label className="text-sm">Keywords</label>
               <div className="flex gap-2 relative">
        <Input
          placeholder="Add a skill"
          value={keywordInput}
          onChange={(e) => {
            setKeywordInput(e.target.value);
            setShowSkillSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addKeyword();
            }
          }}
          onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 100)}
          onFocus={() => {
            if (keywordInput) setShowSkillSuggestions(true);
          }}
        />
        <Button
          type="button"
          onClick={addKeyword}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Add
        </Button>

        {showSkillSuggestions && allSkills.length > 0 && (
          <ul className="absolute top-full left-0 w-full z-10 bg-white border mt-1 max-h-40 overflow-y-auto shadow-md">
            {allSkills
              .filter(
                (s) =>
                  s.toLowerCase().includes(keywordInput.toLowerCase()) &&
                  !formData.employmentDetails.keywords.includes(s)
              )
              .map((sugg, idx) => (
                <li
                  key={idx}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => {
                    setKeywordInput(sugg);
                    setShowSkillSuggestions(false);
                  }}
                >
                  {sugg}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Show selected skills */}
      <div className="mt-2 flex gap-2 flex-wrap">
        {formData.employmentDetails.keywords.map((kw, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
          >
            {kw}{' '}
            <button
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  employmentDetails: {
                    ...prev.employmentDetails,
                    keywords: prev.employmentDetails.keywords.filter(
                      (k) => k !== kw
                    ),
                  },
                }));
              }}
              className="ml-1 text-red-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
            </div>

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
            <div className="mb-4">
              <label className="text-sm">Company *</label>
              <Input
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) =>
                  handleChange("company", e.target.value)
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm">About Company</label>
              <Textarea
                placeholder="Describe the Company"
                rows={4}
                value={formData.about_company}
                onChange={(e) =>
                  handleChange("about_company", e.target.value)
                }
              />
              {errors.about_company && (
                <p className="text-red-500 text-xs">{errors.about_company}</p>
              )}
            </div>

            {/* Employment Details */}
            <div className="md:col-span-2 mt-4 mb-2">
              <h3 className="text-xl font-semibold">Employment Details</h3>
            </div>
            <div>
              <label className="text-sm">Employment Type</label>
              {/* <Input
                placeholder="Full-time"
                value={formData.employmentDetails.employmentType}
                onChange={(e) =>
                  handleNestedChange(
                    "employmentDetails",
                    "employmentType",
                    e.target.value
                  )
                }
              /> */}

              <select
                className="w-full border rounded-md p-2 mt-1 text-sm"
                value={formData.employmentDetails.employmentType}
                onChange={(e) =>
                  handleNestedChange("employmentDetails", "employmentType", e.target.value)
                }
              >
                <option value="">Select Employment Type</option>
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm">Experience</label>
              {/* <Input
                placeholder="2 years"
                value={formData.employmentDetails.experience}
                onChange={(e) =>
                  handleNestedChange(
                    "employmentDetails",
                    "experience",
                    e.target.value
                  )
                }
              /> */}
              <select
                className="w-full border rounded-md p-2 mt-1 text-sm"
                value={formData.employmentDetails.experience}
                onChange={(e) =>
                  handleNestedChange("employmentDetails", "experience", e.target.value)
                }
              >
                <option value="">Select Experience Level</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
  <label className="text-sm">Education</label>
  <select
    className="w-full border rounded-md p-2 mt-1 text-sm"
    value={formData.employmentDetails.education}
    onChange={(e) =>
      handleNestedChange("employmentDetails", "education", e.target.value)
    }
  >
    <option value="">Select Education Level</option>
    {educationLevels.map((level) => (
      <option key={level} value={level}>
        {level}
      </option>
    ))}
  </select>
</div>


      

            {/* Salary */}
            <div>
              <label className="text-sm">Salary From</label>
              <Input
                name="salary_from"
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
                name="salary_to"
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
