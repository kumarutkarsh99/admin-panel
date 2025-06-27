import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar, Clock, PhoneCall } from "lucide-react";

export function TasksPanel({ candidate }) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [associatedWith, setAssociatedWith] = useState("Zenith Accufore");
  const [assignedTo, setAssignedTo] = useState("anand gupta");
  const [type, setType] = useState("call");
  const [dueDate, setDueDate] = useState("2025-07-03");
  const [reminderDate, setReminderDate] = useState("2025-07-03");
  const [reminderTime, setReminderTime] = useState("09:00");

  return (
    <div className="flex flex-col border rounded-lg bg-white shadow-sm mb-4">
      {/* 1. Header */}
      <div className="flex items-center px-4 py-2 border-b">
        <span className="text-2xl mr-2">✨</span>
        <span className="font-semibold">AIRA</span>
      </div>

      {/* 2. Task Name */}
      <div className="px-4 py-2 border-b">
        <Input
          placeholder="Name your task..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="text-sm"
        />
      </div>

      {/* 3. Description */}
      <div className="px-4 py-2 border-b">
        <Textarea
          rows={4}
          placeholder="Enter details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-sm"
        />
      </div>

      {/* 4. Toolbar */}
      <div className="px-4 py-2 border-b overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
        <div className="inline-flex items-center space-x-4 whitespace-nowrap">
          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="Div" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="div">Div</SelectItem>
              <SelectItem value="p">Paragraph</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="13px" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="13px">13px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
            </SelectContent>
          </Select>

          <PhoneCall className="cursor-pointer" size={18} />
          {/* add more icons here */}
        </div>
      </div>

      {/* 5. Metadata grid */}
      <div className="px-4 py-4 flex flex-wrap gap-4 border-b">
        {/* Associated with */}
        <div className="flex flex-row gap-6 w-full">
          <div>
            <label className="block text-xs font-medium mb-1">
              Associated with
            </label>
            <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1 text-sm">
              <span>{associatedWith}</span>
              <button
                onClick={() => setAssociatedWith("")}
                className="text-gray-500"
              >
                ×
              </button>
            </div>
          </div>

          {/* Assigned to */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Assigned to
            </label>
            <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1 text-sm">
              <span>{assignedTo}</span>
              <button
                onClick={() => setAssignedTo("")}
                className="text-gray-500"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-row gap-6 w-full">
          <div>
            <label className="block text-xs font-medium mb-1">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full text-sm">
                <div className="flex items-center space-x-2">
                  {type === "call" && <PhoneCall size={16} />}
                  <SelectValue placeholder="Select type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-xs font-medium mb-1">Due date</label>
            <div className="flex items-center space-x-1">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Email reminder */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <label className="block text-xs font-medium mb-1">
              Email reminder
            </label>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-1">
                <Input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="flex items-center space-x-1">
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Save */}
      <div className="px-4 py-3 flex justify-end">
        <Button onClick={() => console.log("Save Task")} className="text-sm">
          Save
        </Button>
      </div>

      {/* 7. (Optional) Re-use second-row tabs */}
      {/* <CandidateDetailsTabs candidate={candidate} /> */}
    </div>
  );
}
