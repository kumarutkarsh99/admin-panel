import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
}

interface ClientForm {
  name: string;
  website: string;
  careersPage: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  linkedin: string;
  phone: string;
  tags: string[];
  industry: string;
  size: string;
  currency: string;
  revenue: string;
}

const initialClientForm: ClientForm = {
  name: "",
  website: "",
  careersPage: "",
  street1: "",
  street2: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
  linkedin: "",
  phone: "",
  tags: [],
  industry: "",
  size: "",
  currency: "",
  revenue: "",
};

const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Hospitality",
  "Transportation",
  "Energy",
  "Other",
];

const AddClientModal: React.FC<AddClientModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<ClientForm>(initialClientForm);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setFormData(initialClientForm);
      setTagInput("");
      setErrors({});
      setLoading(false);
      setFile(null);
      setFileError("");
      setUploading(false);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileError("");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFileError("Please select a file to upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/clients/upload", {
        method: "POST",
        body: uploadData,
      });
      if (!res.ok) throw new Error("Upload failed");
      await res.json();
      toast.success("File uploaded successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.website.trim()) newErrors.website = "Website is required.";
    if (!formData.street1.trim())
      newErrors.street1 = "Street address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    if (!formData.zipcode.trim()) newErrors.zipcode = "Zipcode is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.industry.trim()) newErrors.industry = "Industry is required.";
    if (!formData.size.trim()) newErrors.size = "Company size is required.";
    if (!formData.currency.trim()) newErrors.currency = "Currency is required.";
    if (!formData.revenue.trim()) newErrors.revenue = "Revenue is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ClientForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/clients/createClient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Create client failed");
      await res.json();
      toast.success("Client added successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add client");
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
              Add Client
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Basic Info */}
                <div>
                  <label className="text-sm">Name</label>
                  <Input
                    placeholder="Company Name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm">Website</label>
                  <Input
                    placeholder="https://www.example.com"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                  {errors.website && (
                    <p className="text-red-500 text-xs">{errors.website}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm">Careers Page URL</label>
                  <Input
                    placeholder="https://www.example.com/careers"
                    value={formData.careersPage}
                    onChange={(e) =>
                      handleChange("careersPage", e.target.value)
                    }
                  />
                </div>

                {/* Contact & Location */}
                <div>
                  <label className="text-sm">LinkedIn</label>
                  <Input
                    placeholder="https://linkedin.com/company/..."
                    value={formData.linkedin}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm">Street Address</label>
                  <Input
                    placeholder="Street address"
                    value={formData.street1}
                    onChange={(e) => handleChange("street1", e.target.value)}
                  />
                  {errors.street1 && (
                    <p className="text-red-500 text-xs">{errors.street1}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm">City</label>
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm">State</label>
                  <Input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm">Country</label>
                  <Input
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs">{errors.country}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm">Zipcode</label>
                  <Input
                    placeholder="Zipcode"
                    value={formData.zipcode}
                    onChange={(e) => handleChange("zipcode", e.target.value)}
                  />
                  {errors.zipcode && (
                    <p className="text-red-500 text-xs">{errors.zipcode}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm">Phone Number</label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs">{errors.phone}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="text-sm">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
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
                    >
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-200 rounded text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <label className="text-sm">Industry</label>
                  <Select
                    value={formData.industry}
                    onValueChange={(val) => handleChange("industry", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectScrollUpButton />
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                      <SelectScrollDownButton />
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.industry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm">Company Size</label>
                  <Select
                    value={formData.size}
                    onValueChange={(val) => handleChange("size", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>

                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectScrollUpButton />
                      {[
                        "0–1",
                        "2–10",
                        "11–50",
                        "51–200",
                        "201–500",
                        "501–1,000",
                        "1,001–5,000",
                        "5,001–10,000",
                        "10,001+",
                      ].map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                      <SelectScrollDownButton />
                    </SelectContent>
                  </Select>

                  {errors.size && (
                    <p className="text-red-500 text-xs mt-1">{errors.size}</p>
                  )}
                </div>

                {/* Currency & Revenue */}
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
                        {[
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
                        ].map((curr) => (
                          <SelectItem key={curr} value={curr}>
                            {curr}
                          </SelectItem>
                        ))}
                        <SelectScrollDownButton />
                      </SelectContent>
                    </Select>

                    {errors.currency && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.currency}
                      </p>
                    )}
                  </div>

                  <div className="w-4/5">
                    <label className="text-sm">Revenue</label>
                    <Input
                      placeholder="e.g. 5000000"
                      value={formData.revenue}
                      onChange={(e) => handleChange("revenue", e.target.value)}
                    />
                    {errors.revenue && (
                      <p className="text-red-500 text-xs">{errors.revenue}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
                    {loading ? "Adding..." : "Add Client"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="upload">
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <label className="text-sm">Upload CSV or Excel File</label>
                <Input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileChange}
                />
                {fileError && (
                  <p className="text-red-500 text-sm">{fileError}</p>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <DialogClose asChild>
                    <Button variant="outline" disabled={uploading}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {uploading ? "Uploading..." : "Upload & Add Client(s)"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
