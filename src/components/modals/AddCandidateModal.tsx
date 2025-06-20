import { useState, useEffect, useMemo, FormEvent, ChangeEvent } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

interface CandidateForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin: string;
  headline: string;
  status: string;
  address: string;
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
  skill: string[];
  college: string;
  degree: string;
  currency: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

interface AddCandidateModalProps {
  open: boolean;
  handleClose: () => void;
}

type CandidateFormKey = keyof CandidateForm;

const initialCandidateForm: CandidateForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  headline: "",
  linkedin: "",
  status: "",
  address: "",
  experience: "",
  photo_url: "",
  education: "",
  summary: "",
  resume_url: "",
  cover_letter: "",
  rating: "",
  hmapproval: "",
  recruiter_status: "",
  current_company: "",
  current_ctc: "",
  expected_ctc: "",
  skill: [],
  college: "",
  degree: "",
  currency: "",
  street1: "",
  street2: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
};

const AddCandidateModal = ({ open, handleClose }: AddCandidateModalProps) => {
  const [formData, setFormData] = useState<CandidateForm>(initialCandidateForm);
  const [tagInput, setTagInput] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<CandidateFormKey, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [importing, setImporting] = useState(false);

  const currencyOptions = useMemo(
    () => [
      "USD",
      "EUR",
      "INR",
      "GBP",
      "AUD",
      "CAD",
      "JPY",
      "CNY",
      "SGD",
      "CHF",
    ],
    []
  );

  const candidateStatus = useMemo(
    () => ["Application", "Screening", "Interview", "Hired", "Rejected"],
    []
  );

  const hmApproval = useMemo(
    () => ["Pending", "Approved", "Rejected", "Not Required"],
    []
  );

  const recruiterStatus = useMemo(
    () => [
      "New Application",
      "Initial Review",
      "Screening Complete",
      "Recommended",
      "Not Suitable",
    ],
    []
  );

  const ratingStyles: Record<number, { selectedBg: string; hoverBg: string }> =
    {
      1: { selectedBg: "bg-red-600 text-white", hoverBg: "hover:bg-red-200" },
      2: {
        selectedBg: "bg-orange-500 text-white",
        hoverBg: "hover:bg-orange-200",
      },
      3: {
        selectedBg: "bg-yellow-500 text-white",
        hoverBg: "hover:bg-yellow-200",
      },
      4: {
        selectedBg: "bg-green-500 text-white",
        hoverBg: "hover:bg-green-200",
      },
      5: {
        selectedBg: "bg-blue-600  text-white",
        hoverBg: "hover:bg-blue-200",
      },
    };

  const resetForm = () => {
    setFormData(initialCandidateForm);
    setTagInput("");
    setErrors({});
    setSelectedFiles([]);
    setParsedRows([]);
    setFileError("");
    setProgress(0);
    setLinkedinUrl("");
    setImporting(false);
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleChange = (field: CandidateFormKey, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput && !formData.skill.includes(tagInput)) {
      setFormData((prev) => ({
        ...prev,
        skill: [...prev.skill, tagInput],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      skill: prev.skill.filter((t) => t !== tag),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = "First Name is Required";
    if (!formData.email) newErrors.email = "Email is Required";
    if (!formData.phone) newErrors.phone = "Phone Number is Required";
    if (!formData.resume_url) newErrors.resume_url = "Resume is Required";
    if (!formData.education)
      newErrors.education = "Education details are Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please enter required fields.");
      return;
    }
    setLoading(true);

    const fullAddress = [
      formData.street1,
      formData.street2,
      formData.city,
      formData.state,
      formData.country,
      formData.zipcode,
    ]
      .filter(Boolean)
      .join(", ");

    const { street1, street2, city, state, country, zipcode, ...rest } =
      formData;

    const payload = {
      ...rest,
      address: fullAddress,
    };

    try {
      console.log(payload);
      await axios.post("/api/candidate/createCandidate", payload);
      toast.success("Candidate added successfully");
      resetForm();
      handleClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Error adding candidate");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    let allRows: any[] = [];
    let filesProcessed = 0;

    files.forEach((file) => {
      const valid = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!valid.includes(file.type)) {
        return setFileError(`Unsupported type: ${file.name}`);
      }

      if (file.type === "text/csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            allRows = allRows.concat(res.data);
            filesProcessed++;
            if (filesProcessed === files.length) {
              setParsedRows(allRows);
            }
          },
        });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          allRows = allRows.concat(XLSX.utils.sheet_to_json(ws));
          filesProcessed++;
          if (filesProcessed === files.length) {
            setParsedRows(allRows);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const headers = useMemo(() => {
    const allKeys = new Set<string>();
    parsedRows.forEach((row) => {
      Object.keys(row).forEach((key) => allKeys.add(key));
    });
    return Array.from(allKeys);
  }, [parsedRows]);

  const removeRow = (index: number) => {
    setParsedRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!parsedRows.length) {
      setFileError("No data to upload");
      return;
    }
    setUploading(true);
    try {
      console.log(parsedRows);
      await axios.post("/api/candidate/createCandidatesBulk", parsedRows, {
        headers: { "Content-Type": "application/json" },
        onUploadProgress: (evt) => {
          setProgress(Math.round((evt.loaded / evt.total!) * 100));
        },
      });
      toast.success("Upload successful");
      resetForm();
      handleClose();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleLinkedInImport = async (
    linkedinUrlsText: string,
    setImporting: React.Dispatch<React.SetStateAction<boolean>>,
    handleClose: () => void
  ) => {
    const urls = Array.from(
      new Set(
        linkedinUrlsText
          .split("\n")
          .map((u) => u.trim())
          .filter((u) => u)
      )
    );
    const invalid = urls.filter(
      (u) =>
        !/^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_.]+\/?$/.test(u)
    );

    if (invalid.length) {
      return toast.error(`Invalid URL(s): ${invalid.join(", ")}`);
    }

    if (!urls.length) {
      toast.error("Please enter at least one LinkedIn URL.");
      return;
    }

    setImporting(true);
    try {
      await axios.post("/api/candidate/linkedinImportBulk", {
        urls,
      });

      toast.success("LinkedIn profiles imported successfully.");
      resetForm();
      handleClose();
    } catch (err) {
      toast.error("Bulk import failed.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Add Candidate
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="mb-6 w-full flex justify-around">
              <TabsTrigger className="w-full" value="manual">
                Manual Entry
              </TabsTrigger>
              <TabsTrigger className="w-full" value="upload">
                Bulk Upload
              </TabsTrigger>
              <TabsTrigger className="w-full" value="linkedin">
                LinkedIn Import
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[
                  {
                    key: "first_name",
                    label: "First Name",
                    placeholder: "e.g. John",
                  },
                  {
                    key: "last_name",
                    label: "Last Name",
                    placeholder: "e.g. Doe",
                  },
                  {
                    key: "email",
                    label: "Email",
                    placeholder: "you@example.com",
                  },
                  {
                    key: "phone",
                    label: "Phone Number",
                    placeholder: "+1 (555) 555‑5555",
                  },
                  {
                    key: "headline",
                    label: "Headline",
                    placeholder: "Paste text or link",
                  },
                  {
                    key: "linkedin",
                    label: "LinkedIn",
                    placeholder: "linkedin.com/in/your‑name",
                  },
                  {
                    key: "photo_url",
                    label: "Profile Photo",
                    placeholder: "Image URL (jpg/png/etc.)",
                  },
                  {
                    key: "resume_url",
                    label: "Resume",
                    placeholder: "PDF or DOC link",
                  },
                  {
                    key: "street1",
                    label: "Street Address 1",
                    placeholder: "123 Main St",
                  },
                  {
                    key: "street2",
                    label: "Street Address 2",
                    placeholder: "Suite, Apt, etc. (opt.)",
                  },
                  { key: "city", label: "City", placeholder: "City name" },
                  {
                    key: "state",
                    label: "State",
                    placeholder: "State/Province",
                  },
                  {
                    key: "country",
                    label: "Country",
                    placeholder: "Country name",
                  },
                  {
                    key: "zipcode",
                    label: "Zipcode",
                    placeholder: "Postal code",
                  },
                  {
                    key: "current_company",
                    label: "Current Company",
                    placeholder: "Your current company",
                  },
                  {
                    key: "college",
                    label: "College",
                    placeholder: "Your last attended college",
                  },
                  {
                    key: "degree",
                    label: "Highest Degree",
                    placeholder: "Btech/BA/...",
                  },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-sm" htmlFor={key}>
                      {label}
                    </label>
                    <Input
                      id={key}
                      value={formData[key] as string}
                      placeholder={placeholder}
                      aria-invalid={!!errors[key]}
                      onChange={(e) =>
                        handleChange(key as keyof CandidateForm, e.target.value)
                      }
                    />
                    {errors[key as keyof CandidateForm] && (
                      <p className="text-sm text-red-500">
                        {errors[key as keyof CandidateForm]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="text-sm">Skills</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {formData.skill.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-200 rounded text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-red-500"
                          aria-label={`Remove skill ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                {[
                  {
                    key: "experience",
                    label: "Experience",
                    placeholder: "Enter Company name, title, date...",
                  },
                  {
                    key: "education",
                    label: "Education",
                    placeholder:
                      "Enter school name, degree, specialization, date...",
                  },
                  {
                    key: "cover_letter",
                    label: "Cover Letter",
                    placeholder: "Your cover letter text/url",
                  },
                  {
                    key: "summary",
                    label: "Summary",
                    placeholder: "More about yourself...",
                  },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="md:col-span-2">
                    <label className="text-sm mb-1 capitalize">{label}</label>
                    <Textarea
                      value={formData[key]}
                      placeholder={placeholder}
                      onChange={(e) =>
                        handleChange(key as keyof CandidateForm, e.target.value)
                      }
                      className="resize-y"
                      aria-invalid={!!errors[key]}
                    />
                  </div>
                ))}
                <div className="md:col-span-1 flex-wrap gap-4">
                  <label className="text-sm">Recruiter Status</label>
                  <Select
                    value={formData.recruiter_status}
                    onValueChange={(val) =>
                      handleChange("recruiter_status", val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectScrollUpButton />
                      {recruiterStatus.map((curr) => (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      ))}
                      <SelectScrollDownButton />
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1 flex-wrap gap-4">
                  <label className="text-sm">Candidate Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => handleChange("status", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectScrollUpButton />
                      {candidateStatus.map((curr) => (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      ))}
                      <SelectScrollDownButton />
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-1 flex-wrap gap-4">
                  <label className="text-sm">HM Approval</label>
                  <Select
                    value={formData.hmapproval}
                    onValueChange={(val) => handleChange("hmapproval", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectScrollUpButton />
                      {hmApproval.map((curr) => (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      ))}
                      <SelectScrollDownButton />
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center border rounded-lg w-full h-10 mt-6 overflow-hidden">
                  <label className="text-sm whitespace-nowrap w-[30%] flex justify-center items-center">
                    Rating
                  </label>
                  <div className="grid grid-cols-5 flex-1 h-full">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const { selectedBg, hoverBg } = ratingStyles[n];
                      const isSelected = formData.rating === n.toString();

                      return (
                        <button
                          key={n}
                          onClick={(e) => {
                            e.preventDefault();
                            handleChange("rating", n.toString());
                          }}
                          className={`w-full h-full flex items-center justify-center text-sm font-medium transition-colors duration-150 ${
                            isSelected ? selectedBg : `bg-gray-100 ${hoverBg}`
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <div className="w-1/5">
                    <label className="text-sm">Currency</label>
                    <Select
                      value={formData.currency}
                      onValueChange={(val) => handleChange("currency", val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        <SelectScrollUpButton />
                        {currencyOptions.map((curr) => (
                          <SelectItem key={curr} value={curr}>
                            {curr}
                          </SelectItem>
                        ))}
                        <SelectScrollDownButton />
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-2/5">
                    <label className="text-sm">Current CTC</label>
                    <Input
                      value={formData.current_ctc}
                      placeholder="Current CTC"
                      onChange={(e) =>
                        handleChange("current_ctc", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="w-2/5">
                    <label className="text-sm">Expected CTC</label>
                    <Input
                      value={formData.expected_ctc}
                      placeholder="Expected CTC"
                      onChange={(e) =>
                        handleChange("expected_ctc", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      disabled={uploading}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? "Adding..." : "Add Candidate"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="upload">
              <form onSubmit={handleUploadSubmit}>
                <Input
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  aria-label="Upload CSV or Excel file"
                />
                {fileError && <p className="text-red-500 mt-2">{fileError}</p>}

                {/* Preview warning */}
                {parsedRows.length > 0 && (
                  <p className="text-sm italic text-gray-600 mt-4">
                    ⚠️ These rows are only in preview. Click “Upload” to save.
                  </p>
                )}

                {/* Data preview table */}
                {parsedRows.length > 0 && (
                  <div className="max-h-96 overflow-auto mt-2">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-xs font-semibold uppercase">
                            Remove
                          </th>
                          {headers.map((h) => (
                            <th
                              key={h}
                              className="px-4 py-2 text-xs font-semibold uppercase"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {parsedRows.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRow(i);
                                }}
                              >
                                ×
                              </Button>
                            </td>
                            {headers.map((key, j) => (
                              <td
                                key={`${i}-${j}`}
                                className="px-4 py-2 whitespace-nowrap text-sm"
                              >
                                {row[key] ?? ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Progress bar */}
                {uploading && (
                  <progress
                    value={progress}
                    max={100}
                    className="w-full mt-4"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                )}

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={uploading || !parsedRows.length}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {uploading ? `Uploading ${progress}%` : "Upload"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="linkedin">
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLinkedInImport(
                      linkedinUrl,
                      setImporting,
                      handleClose
                    );
                  }}
                  className="space-y-4"
                >
                  <label className="text-sm">LinkedIn Profile URLs</label>
                  <Textarea
                    placeholder="Enter one URL per line"
                    rows={5}
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                  <div className="mt-4 flex justify-end">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={uploading}
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={importing}
                      className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {importing ? "Importing..." : "Import All"}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateModal;
