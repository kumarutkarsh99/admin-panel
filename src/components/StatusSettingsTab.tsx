import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

const API_BASE_URL = "http://13.51.235.31:3000";

interface Status {
  id: number;
  type: "candidate" | "recruiter";
  name: string;
  color: string;
  is_active: boolean;
}

export const StatusSettingsTab = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [statusName, setStatusName] = useState("");
  const [statusColor, setStatusColor] = useState("#000000");
  const [statusType, setStatusType] = useState<"candidate" | "recruiter">(
    "candidate"
  );

  const fetchStatuses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/candidate/createStatus`
      );
      if (Array.isArray(response.data.result)) {
        setStatuses(response.data.result);
      } else {
        setStatuses([]);
      }
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      toast.error("Failed to load statuses. Check backend connection.");
      setStatuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleOpenAddDialog = (type: "candidate" | "recruiter") => {
    setEditingStatus(null);
    setStatusName("");
    setStatusColor("#808080");
    setStatusType(type);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (status: Status) => {
    setEditingStatus(status);
    setStatusName(status.name);
    setStatusColor(status.color);
    setStatusType(status.type);
    setIsDialogOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!statusName.trim()) {
      toast.error("Status name cannot be empty.");
      return;
    }
    setIsSaving(true);
    const payload = {
      type: statusType,
      name: statusName,
      color: statusColor,
      is_active: editingStatus ? editingStatus.is_active : true,
    };

    try {
      if (editingStatus) {
        await axios.put(
          `${API_BASE_URL}/candidate/status/${editingStatus.id}`,
          payload
        );
        toast.success("Status updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/candidate/createStatus`, payload);
        toast.success("Status created successfully!");
      }
      setIsDialogOpen(false);
      fetchStatuses();
    } catch (error) {
      console.error("Failed to save status:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStatus = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/candidate/status/${id}`);
      toast.success("Status deleted successfully!");
      fetchStatuses();
    } catch (error) {
      console.error("Failed to delete status:", error);
      toast.error("Failed to delete status. Please try again.");
    }
  };

  const handleToggleActive = async (status: Status) => {
    const payload = { ...status, is_active: !status.is_active };
    try {
      await axios.put(`${API_BASE_URL}/candidate/status/${status.id}`, payload);
      toast.success(
        `Status successfully ${
          payload.is_active ? "activated" : "deactivated"
        }.`
      );
      fetchStatuses();
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Could not update status activation.");
    }
  };

  const renderStatusList = (type: "candidate" | "recruiter") => {
    const filteredStatuses = statuses.filter((s) => s.type === type);

    return (
      <div className="space-y-3">
        {filteredStatuses.map((status) => (
          <div
            key={status.id}
            className="flex items-center justify-between p-3 rounded-md border bg-slate-50/50"
          >
            <div className="flex items-center gap-4">
              <Switch
                checked={status.is_active}
                onCheckedChange={() => handleToggleActive(status)}
              />
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span
                  className={`font-medium ${
                    status.is_active
                      ? "text-slate-700"
                      : "text-slate-400 line-through"
                  }`}
                >
                  {status.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenEditDialog(status)}
              >
                <Edit className="w-4 h-4 text-slate-500" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the "{status.name}" status.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteStatus(status.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">
            Manage Custom Statuses
          </CardTitle>
        </CardHeader>
        <CardContent>Loading statuses...</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-800">Manage Custom Statuses</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-slate-700">
              Candidate Statuses
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAddDialog("candidate")}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Status
            </Button>
          </div>
          {renderStatusList("candidate")}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-slate-700">
              Recruiter Statuses
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAddDialog("recruiter")}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Status
            </Button>
          </div>
          {renderStatusList("recruiter")}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStatus ? "Edit" : "Add New"} {statusType} Status
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="statusName">Status Name</Label>
                <Input
                  id="statusName"
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                  placeholder="e.g., Screening"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusColor">Color</Label>
                <Input
                  id="statusColor"
                  type="color"
                  value={statusColor}
                  onChange={(e) => setStatusColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveStatus} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
