import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function CandidateDetailsTabs({ candidate }) {
  const {
    activities = [],
    files = [],
    scorecards = [],
    notes = [],
    conversations = [],
    calls = [],
    tasks = [],
  } = candidate;

  return (
    <div className="flex-1 p-4">
      <Tabs defaultValue="conversations">
        <TabsList className="space-x-2">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="scorecards">Scorecards</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-4">
          {activities.length ? (
            activities.map((act) => (
              <div key={act.id} className="mb-2 text-sm">
                {act.description}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No activities yet.</p>
          )}
        </TabsContent>

        <TabsContent value="files" className="mt-4">
          {files.length ? (
            files.map((f) => (
              <a
                key={f.id}
                href={f.url}
                className="block text-blue-500 underline text-sm mb-1"
                target="_blank"
                rel="noreferrer"
              >
                {f.name}
              </a>
            ))
          ) : (
            <p className="text-gray-500">No files uploaded.</p>
          )}
        </TabsContent>

        <TabsContent value="scorecards" className="mt-4">
          {scorecards.length ? (
            scorecards.map((s) => (
              <div key={s.id} className="mb-2 text-sm">
                {s.title}: {s.score}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No scorecards yet.</p>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          {notes.length ? (
            notes.map((n) => (
              <div key={n.id} className="mb-2 text-sm">
                {n.text}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notes yet.</p>
          )}
        </TabsContent>

        <TabsContent value="conversations" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline">Sync Conversations</Button>
            <select className="border rounded px-2 py-1 text-sm">
              <option>All Channels</option>
              <option>Email</option>
              <option>LinkedIn</option>
            </select>
          </div>
          {conversations.length ? (
            conversations.map((c) => (
              <div key={c.id} className="mb-2 text-sm">
                <strong>{c.channel}</strong>: {c.preview}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No conversations yet.</p>
          )}
        </TabsContent>

        <TabsContent value="calls" className="mt-4">
          {calls.length ? (
            calls.map((c) => (
              <div key={c.id} className="mb-2 text-sm">
                {new Date(c.time).toLocaleString()}: {c.notes}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No calls logged.</p>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          {tasks.length ? (
            tasks.map((t) => (
              <div key={t.id} className="mb-2 text-sm">
                <input
                  type="checkbox"
                  checked={t.completed}
                  readOnly
                  className="mr-2"
                />
                {t.title}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tasks assigned.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
