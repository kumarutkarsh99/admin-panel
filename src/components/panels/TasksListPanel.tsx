// TasksListPanel.tsx
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  assignedTo: string;
}

interface TasksListPanelProps {
  tasks_list?: TaskItem[];
}

const sampleTasks: TaskItem[] = [
  {
    id: "t1",
    title: "Review candidate resume",
    completed: true,
    assignedTo: "Alice",
  },
  {
    id: "t2",
    title: "Schedule technical interview",
    completed: false,
    assignedTo: "Bob",
  },
  {
    id: "t3",
    title: "Prepare feedback form",
    completed: false,
    assignedTo: "Carol",
  },
  {
    id: "t4",
    title: "Send offer letter",
    completed: true,
    assignedTo: "Dave",
  },
  {
    id: "t5",
    title: "Verify references",
    completed: false,
    assignedTo: "Eve",
  },
];

export function TasksListPanel({ tasks_list }: TasksListPanelProps) {
  const list = tasks_list && tasks_list.length ? tasks_list : sampleTasks;

  return (
    <ScrollArea className="h-[400px] p-2">
      {list.map((task) => (
        <div
          key={task.id}
          className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4"
        >
          <div className="flex items-center space-x-3">
            {task.completed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            <span
              className={`text-sm ${
                task.completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {task.title}
            </span>
          </div>
          <Badge variant="outline">{task.assignedTo}</Badge>
        </div>
      ))}
    </ScrollArea>
  );
}
