// CandidateDetailsTabs.tsx
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotesPanel } from "./panels/NotesPanel";
import { TasksPanel } from "./panels/TasksPanel";
import { SchedulePanel } from "./panels/SchedulePanel";
import { EmailPanel } from "./panels/EmailPanel";
import { CallsPanel } from "./panels/CallsPanel";
import { TextPanel } from "./panels/TextPanel";
import { ActivityPanel } from "./panels/ActivityPanel";
import { ActivitiesPanel } from "./panels/ActivitiesPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { ScorecardsPanel } from "./panels/ScorecardsPanel";
import { ConversationsPanel } from "./panels/ConversationsPanel";
import { CallsListPanel } from "./panels/CallsListPanel";
import { TasksListPanel } from "./panels/TasksListPanel";

export default function CandidateDetailsTabs({
  candidate,
}: {
  candidate: any;
}) {
  const [primaryTab, setPrimaryTab] = useState<string>("notes");
  const [secondaryTab, setSecondaryTab] = useState<string>("activities");

  return (
    <div className="p-3 w-full space-y-6">
      {/* Primary Tabs */}
      <Tabs
        value={primaryTab}
        onValueChange={setPrimaryTab}
        aria-label="Candidate primary sections"
      >
        <TabsList className="flex w-full overflow-x-auto">
          {[
            { value: "notes", label: "Notes" },
            { value: "tasks", label: "Tasks" },
            { value: "schedule", label: "Schedule" },
            { value: "email", label: "Email" },
            { value: "calls", label: "Calls" },
            { value: "text", label: "Text (SMS)" },
            { value: "activity", label: "Activity" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 text-center"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="notes">
          <NotesPanel candidate={candidate} />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksPanel candidate={candidate} />
        </TabsContent>
        <TabsContent value="schedule">
          <SchedulePanel candidate={candidate} />
        </TabsContent>
        <TabsContent value="email">
          <EmailPanel candidate={candidate} />
        </TabsContent>
        <TabsContent value="calls">
          <CallsPanel candidate={candidate} />
        </TabsContent>
        <TabsContent value="text">
          <TextPanel candidate={candidate} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityPanel candidate={candidate} />
        </TabsContent>
      </Tabs>

      {/* Secondary Tabs */}
      <Tabs
        value={secondaryTab}
        onValueChange={setSecondaryTab}
        aria-label="Candidate other details"
      >
        <TabsList className="flex w-full overflow-x-auto">
          {[
            { value: "activities", label: "Activities" },
            { value: "files", label: "Files" },
            { value: "scorecards", label: "Scorecards" },
            { value: "conversations", label: "Conversations" },
            { value: "calls_list", label: "Calls" },
            { value: "tasks_list", label: "Tasks" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 text-center"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="activities">
          <ActivitiesPanel activities={candidate.activities || []} />
        </TabsContent>
        <TabsContent value="files">
          <FilesPanel files={candidate.files} />
        </TabsContent>
        <TabsContent value="scorecards">
          <ScorecardsPanel scorecards={candidate.scorecards} />
        </TabsContent>
        <TabsContent value="conversations">
          <ConversationsPanel conversations={candidate.conversations} />
        </TabsContent>
        <TabsContent value="calls_list">
          <CallsListPanel calls={candidate.calls} />
        </TabsContent>
        <TabsContent value="tasks_list">
          <TasksListPanel candidateId={candidate.id} authorId={1} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
