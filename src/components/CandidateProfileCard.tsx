import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { BulkUpdateFieldsModal } from "./modals/BulkUpdateFieldsModal";
import AssignToJobModal from "./modals/AssigntoJobModal";

interface Job {
  id: number;
  title: string;
}

interface Education {
  degree: string;
  institution: string;
  duration?: string;
}

interface Experience {
  company: string;
  role: string;
  duration?: string;
  responsibilities?: string[];
}

interface CandidateProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string | null;
  photo_url: string | null;
  education: string;
  experience: string;
  current_ctc: string | null;
  expected_ctc: string | null;
  skill: string[];
  current_company: string | null;
  linkedinprofile: string;
  rating: number | string | null;
  jobs: Job[];
  status: string;
  recruiter_status: string;
  hmapproval: string;
  notice_period: string;
  institutiontier: string;
  companytier: string;
  resume_url: string;
  job_titles:Job[]
}

interface ProfileCardProps {
  candidate: CandidateProfile;
}

const parseJSON = (data) => {
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(data) ? data : [];
};

export default function CandidateProfileCard({ candidate }: ProfileCardProps) {
  const {
    id,
    first_name,
    last_name,
    email,
    phone,
    headline,
    photo_url,
    education,
    experience,
    current_ctc,
    expected_ctc,
    skill = [],
    current_company,
    linkedinprofile: linkedIn,
    rating,
    jobs = [],
    status,
    notice_period,
    institutiontier,
    companytier,
    resume_url,
    job_titles
  } = candidate;

  const [editOpen, setEditOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);
  const initials = [first_name?.[0], last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const parsedEducation: Education[] = parseJSON(education);
  const parsedExperience: Experience[] = parseJSON(experience);

  const linkedInUrl =
    linkedIn && !linkedIn.startsWith("http") ? `https://${linkedIn}` : linkedIn;

  return (
    <div className="w-full p-3 font-sans">
      <Card className="p-6 space-y-4 shadow-lg rounded-xl">
        <div className="flex items-start space-x-6">
          <Avatar className="h-16 w-16 text-xl">
            {photo_url ? (
              <img
                src={photo_url}
                alt={`${first_name} ${last_name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl text-slate-800">
                  {first_name} {last_name}
                </h2>
                {headline && (
                  <p className="text-md text-slate-800">{headline}</p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-5 w-5 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    Edit Candidate
                  </DropdownMenuItem>
                  {resume_url && (
                    <DropdownMenuItem asChild>
                      <a
                        href={resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Resume
                      </a>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {rating && (
          <div className="mt-2">
            <StarRating rating={Number(rating) || 0} />
          </div>
        )}

        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-2 text-sm text-slate-700">
            {email && (
              <p>
                <strong className="font-medium text-slate-500">Email:</strong>{" "}
                <a
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:underline"
                >
                  {email}
                </a>
              </p>
            )}
            {phone && (
              <p>
                <strong className="font-medium text-slate-500">Phone:</strong>{" "}
                {phone}
              </p>
            )}
            {linkedInUrl && (
              <p>
                <strong className="font-medium text-slate-500">
                  LinkedIn:
                </strong>{" "}
                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              </p>
            )}
            {current_ctc && (
              <p>
                <strong className="font-medium text-slate-500">
                  Current CTC:
                </strong>{" "}
                {`₹${parseFloat(current_ctc).toLocaleString("en-IN")}`}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="secondary">Status: {status}</Badge>
            {notice_period && (
              <Badge variant="secondary">Notice: {notice_period}</Badge>
            )}
            {institutiontier && institutiontier !== "{}" && (
              <Badge variant="secondary">
                Institution Tier: {institutiontier}
              </Badge>
            )}
            {companytier && companytier !== "{}" && (
              <Badge variant="secondary">Company Tier: {companytier}</Badge>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">JOBS</p>
          <Button
            variant="outline"
            size="sm"
            className="px-2 text-xs"
            onClick={() => setJobOpen(true)}
          >
            + Add job
          </Button>
        </div>
       {(() => {
  console.log(job_titles);
  return null;
})()}
{Array.isArray(job_titles) && job_titles.length > 0 ? (
  job_titles.map((title, index) => (
    <p key={index} className="text-sm text-slate-600">
      {title}
    </p>
  ))
)  : (
          <p className="text-xs text-gray-400">No jobs found</p>
        )}
      </Card>

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EDUCATION</p>
          <Button variant="outline" size="sm" className="px-2 text-xs">
            + Add Education
          </Button>
        </div>
        {parsedEducation.length > 0 ? (
          parsedEducation.map((edu, idx) => (
            <div key={idx} className="py-1">
              <p className="text-xs text-gray-800 capitalize">
                {edu.degree || "Education details"} - {edu.institution}
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

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EXPERIENCE</p>
          <Button variant="outline" size="sm" className="px-2 text-xs">
            + Add experience
          </Button>
        </div>
        {parsedExperience.length > 0 ? (
          parsedExperience.map((exp, idx) => (
            <div key={idx} className="py-2">
              <p className="text-sm font-medium text-gray-800">
                {exp.role} at {exp.company}
              </p>
              {exp.duration && (
                <p className="text-xs text-gray-600">{exp.duration}</p>
              )}
              {exp.responsibilities?.length > 0 && (
                <ul className="list-disc pl-5 text-xs text-gray-700 mt-1 space-y-1">
                  {exp.responsibilities.map((d, i) => (
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

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">SKILLS</p>
          <Button variant="outline" size="sm" className="px-2 text-xs">
            + Add skill
          </Button>
        </div>
        {skill?.length > 0 ? (
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

      {editOpen && (
        <BulkUpdateFieldsModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          selectedIds={[id]}
          onSuccess={() => {
            setEditOpen(false);
          }}
        />
      )}

      {jobOpen && (
        <AssignToJobModal
          open={jobOpen}
          onOpenChange={() => setJobOpen(false)}
          candidateIds={[id]}
          onSuccess={() => setJobOpen(false)}
        />
      )}
    </div>
  );
}
