import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import StarRating from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { EditCandidateModal } from "./modals/EditCandidateModal";

export default function CandidateProfileCard({
  candidate,
  owners = [],
  onCandidateUpdated,
}) {
  const {
    id,
    first_name,
    last_name,
    email,
    phone,
    headline,
    address,
    photo_url,
    education,
    experience,
    summary,
    resume_url,
    cover_letter,
    status,
    recruiter_status,
    hmapproval,
    current_ctc,
    expected_ctc,
    skill = [],
    college,
    degree,
    current_company,
    linkedIn,
    rating,
    owner,
    jobs = [],
  } = candidate;

  const [editOpen, setEditOpen] = useState(false);
  const initials = [first_name?.[0], last_name?.[0]].filter(Boolean).join("");

  const parseJSON = (data) => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  };

  const parsedEducation = parseJSON(education) || [];
  const parsedExperience = parseJSON(experience) || [];

  return (
    <div className="w-full p-3">
      <Card className="p-4 space-y-4 shadow-md">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            {photo_url ? (
              <img src={photo_url} alt={`${first_name} ${last_name}`} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h2 className="font-semibold text-2xl">
              {first_name} {last_name}
            </h2>
            {headline && (
              <p className="text-sm text-gray-600 capitalize">
                {headline}
                {current_company && ` at ${current_company}`}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit Candidate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contact & CTC */}
        <div className="space-y-1 text-sm text-gray-700">
          {email && <p>Email: {email}</p>}
          {phone && <p>Phone: {phone}</p>}
          {linkedIn && (
            <p>
              LinkedIn:{" "}
              <a
                href={linkedIn}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Profile
              </a>
            </p>
          )}
          {current_ctc && <p>Current CTC: {current_ctc}</p>}
          {expected_ctc && <p>Expected CTC: {expected_ctc}</p>}
        </div>

        {/* Rating & Tags */}
        <StarRating rating={rating || 0} />
        <Button variant="outline" size="sm">
          + Add tag
        </Button>

        {/* Owner Assignment */}
        <div className="text-sm">
          <p className="font-semibold mb-1">Owner</p>
          <Select
            value={owner?.id || ""}
            onValueChange={(val) =>
              onCandidateUpdated({
                ...candidate,
                owner: {
                  id: val,
                  name: owners.find((o) => o.id === val)?.name,
                },
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              {owners.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Jobs */}
      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">JOBS</p>
          <Button variant="outline" size="sm">
            + Add job
          </Button>
        </div>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <p key={job.id} className="text-sm text-slate-600">
              {job.title}
            </p>
          ))
        ) : (
          <p className="text-xs text-gray-400">No jobs found</p>
        )}
      </Card>

      {/* Education */}
      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EDUCATION</p>
          <Button variant="outline" size="sm">
            + Add Education
          </Button>
        </div>
        {parsedEducation.length > 0 ? (
          parsedEducation.map((edu, idx) => (
            <div key={idx}>
              <p className="text-sm font-medium text-gray-800">
                {edu.degree} - {edu.institution}
              </p>
              {edu.duration && (
                <p className="text-xs text-gray-600">{edu.duration}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">No education found</p>
        )}
      </Card>

      {/* Experience */}
      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EXPERIENCE</p>
          <Button variant="outline" size="sm">
            + Add experience
          </Button>
        </div>
        {parsedExperience.length > 0 ? (
          parsedExperience.map((exp, idx) => (
            <div key={idx}>
              <p className="text-sm font-medium text-gray-800">
                {exp.title} - {exp.company} - {exp.role}
              </p>
              {exp.duration && (
                <p className="text-xs text-gray-600">{exp.duration}</p>
              )}
              {exp.details?.length > 0 && (
                <ul className="list-disc pl-5 text-xs text-gray-700 mt-1 space-y-1">
                  {exp.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">No experience found</p>
        )}
      </Card>

      {/* Skills */}
      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">SKILLS</p>
          <Button variant="outline" size="sm">
            + Add skill
          </Button>
        </div>
        {skill.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {skill.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No skills found</p>
        )}
      </Card>

      {/* Edit Modal */}
      {editOpen && (
        <EditCandidateModal
          candidateId={id}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSaved={(updated) => {
            setEditOpen(false);
            onCandidateUpdated(updated);
          }}
        />
      )}
    </div>
  );
}
