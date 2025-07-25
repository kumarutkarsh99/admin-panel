import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface TaskItem {
  id: number;
  candidate_id: number;
  author_id: number;
  note: string;
  created_at: string;
  updated_at: string;
}

interface TasksListPanelProps {
  candidateId: number;
  authorId: number;
}

const API_BASE = "http://51.20.181.155:3000";

export function TasksListPanel({ candidateId, authorId }: TasksListPanelProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingNote, setEditingNote] = useState<string>("");

  const fetchTasks = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/candidate/task/${candidateId}`);
      if (res.data.status) setTasks(res.data.result);
      else setErrorMessage(res.data.message || "Failed to load tasks.");
    } catch (err: any) {
      if (err.response?.status === 404) setTasks([]);
      else {
        console.error("Error fetching tasks", err);
        const msg = err.response?.data?.message || err.message;
        setErrorMessage(msg || "Server error while fetching tasks.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [candidateId]);

  const updateTask = async (taskId: number, note: string) => {
    try {
      console.log(note);
      await axios.post(`${API_BASE}/candidate/task/${taskId}`, { note });
      setEditingId(null);
      setEditingNote("");
      fetchTasks();
    } catch (err) {
      console.error(`Error updating task ${taskId}`, err);
    }
  };

  const addTask = async () => {
    if (!newNote.trim()) {
      setAddError("Please enter a task before adding.");
      return;
    }
    setAddError(null);
    setAddSuccess(null);
    setAdding(true);
    try {
      console.log(newNote);
      const res = await axios.post(`${API_BASE}/candidate/addCandidateTask`, {
        candidate_id: candidateId,
        author_id: authorId,
        task: newNote,
      });
      if (res.data.status) {
        setAddSuccess(res.data.message || "Task added successfully.");
        setNewNote("");
        fetchTasks();
      } else setAddError(res.data.message || "Failed to add task.");
    } catch (err: any) {
      console.error("Error adding task", err);
      const msg = err.response?.data?.message || err.message;
      setAddError(msg || "Server error while adding task.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      {/* Add new task */}
      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Enter new task note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button disabled={adding} onClick={addTask}>
          {adding ? "Adding…" : "Add Task"}
        </Button>
      </div>
      {addError && <div className="mb-2 text-red-600">{addError}</div>}
      {addSuccess && <div className="mb-2 text-green-600">{addSuccess}</div>}
      {errorMessage && (
        <div className="mb-4 text-red-600">Error: {errorMessage}</div>
      )}

      <ScrollArea className="h-[400px] p-2">
        {loading ? (
          <div>Loading tasks...</div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-4"
            >
              <div className="flex-1 flex items-center space-x-3">
                {task.updated_at !== task.created_at ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                {editingId === task.id ? (
                  <Input
                    className="flex-1"
                    value={editingNote}
                    onChange={(e) => setEditingNote(e.target.value)}
                  />
                ) : (
                  <span className="text-sm text-gray-800 flex-1">
                    {task.note}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {editingId === task.id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => updateTask(task.id, editingNote)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="outline">By {task.author_id}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(task.id);
                        setEditingNote(task.note);
                      }}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No tasks available.</div>
        )}
      </ScrollArea>
    </div>
  );
}
