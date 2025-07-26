import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import axios from "axios";
import { Trash2 } from "lucide-react";

const API_BASE_URL = "http://51.20.181.155:3000";

interface BulkUpdateFieldsModalProps {
  open: boolean;
  onClose: () => void;
  selectedIds: number[];
  onSuccess?: () => void;
}

const fieldOptions = [
  { key: "status", label: "Status" },
  { key: "recruiter_status", label: "Recruiter Status" },
  { key: "hmapproval", label: "HM Approval" },
  { key: "rating", label: "Rating" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "headline", label: "Headline" },
  { key: "address", label: "Address" },
  { key: "experience", label: "Experience" },
  { key: "photo_url", label: "Photo URL" },
  { key: "education", label: "Education" },
  { key: "summary", label: "Summary" },
  { key: "resume_url", label: "Resume URL" },
  { key: "cover_letter", label: "Cover Letter" },
  { key: "current_company", label: "Current Company" },
  { key: "current_ctc", label: "Current CTC" },
  { key: "expected_ctc", label: "Expected CTC" },
  { key: "currency", label: "Currency" },
  { key: "skill", label: "Skills" },
  { key: "college", label: "College" },
  { key: "degree", label: "Degree" },
];

const dropdownOptions: Record<string, { value: string; label: string }[]> = {
  status: [
    { value: "Application", label: "Application" },
    { value: "Screening", label: "Screening" },
    { value: "Interview", label: "Interview" },
    { value: "Offer", label: "Offer" },
    { value: "Hired", label: "Hired" },
    { value: "Rejected", label: "Rejected" },
  ],
  recruiter_status: [
    { value: "New Application", label: "New Application" },
    { value: "Initial Review", label: "Initial Review" },
    { value: "Screening Complete", label: "Screening Complete" },
    { value: "Recommended", label: "Recommended" },
    { value: "Not Suitable", label: "Not Suitable" },
  ],
  hmapproval: [
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Pending", label: "Pending" },
  ],
  rating: [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ],
};

export function BulkUpdateFieldsModal({
  open,
  onClose,
  selectedIds,
  onSuccess,
}: BulkUpdateFieldsModalProps) {
  const initial = [{ field: "", action: "", value: "" }];
  const [updates, setUpdates] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setUpdates(initial);
    }
  }, [open]);

  const addRow = () =>
    setUpdates((u) => [...u, { field: "", action: "", value: "" }]);

  const deleteRow = (idremove: number) => {
    setUpdates((prev) => prev.filter((_, id) => id !== idremove));
  };

  const handleSave = async () => {
    for (let { field, action, value } of updates) {
      if (!field) {
        toast.error("Please select a field for every row.");
        return;
      }
      if (action === "change_to" && !value.trim()) {
        toast.error(`Please supply a value for "${field}".`);
        return;
      }
    }

    const normalizedUpdates = updates.map(({ field, action, value }) =>
      action === "clear"
        ? { field, action: "change_to", value: "" }
        : { field, action, value }
    );

    const payload = {
      ids: selectedIds,
      updates: normalizedUpdates,
    };

    setSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/candidate/bulk-update`, payload);
      toast.success("Fields updated successfully!");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => val || onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Update Fields</DialogTitle>
        </DialogHeader>

        <div className="mt-1 space-y-4">
          {updates.map((u, i) => (
            <div key={i} className="flex gap-2">
              {/* Field selector */}
              <Select
                value={u.field}
                onValueChange={(field) =>
                  setUpdates((cur) =>
                    cur.map((x, j) => (j === i ? { ...x, field } : x))
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="h-[250px]">
                  {fieldOptions.map(({ key, label }) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Action selector */}
              <Select
                value={u.action}
                onValueChange={(action) =>
                  setUpdates((cur) =>
                    cur.map((x, j) => (j === i ? { ...x, action } : x))
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="change_to">Change to</SelectItem>
                  <SelectItem value="clear">Clear</SelectItem>
                </SelectContent>
              </Select>

              {/* Value input or dropdown based on field */}
              {u.action === "change_to" && dropdownOptions[u.field] ? (
                <Select
                  value={u.value}
                  onValueChange={(value) =>
                    setUpdates((cur) =>
                      cur.map((x, j) => (j === i ? { ...x, value } : x))
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions[u.field].map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Value"
                  value={u.value}
                  onChange={(e) =>
                    setUpdates((cur) =>
                      cur.map((x, j) =>
                        j === i ? { ...x, value: e.target.value } : x
                      )
                    )
                  }
                  disabled={u.action !== "change_to"}
                />
              )}

              {/* Delete row */}
              <Button
                onClick={() => deleteRow(i)}
                disabled={updates.length === 1}
                aria-label="Delete this row"
                className="p-1 text-xl justify-center items-center bg-transparent text-red-200 hover:bg-transparent hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button variant="ghost" size="sm" onClick={addRow}>
            + Add more
          </Button>
        </div>

        <div className="mt-1 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setUpdates(initial);
              onClose();
            }}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Updating…" : "Update fields"}
          </Button>
        </div>

        <DialogClose className="absolute top-4 right-4" aria-label="Close" />
      </DialogContent>
    </Dialog>
  );
}
