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
import { CheckCircle } from "lucide-react";
import StarRating from "./StarRating";
import { Badge } from "@/components/ui/badge";

export default function CandidateProfileCard({ candidate }) {
  const {
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

  const initials = [first_name?.[0], last_name?.[0]].filter(Boolean).join("");

  return (
    <div className="w-full p-3">
      {/* Profile Card */}
      <Card className="p-4 space-y-4 outline-none border-none shadow-md">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-sans font-semibold text-2xl mb-1">
              {first_name} {last_name}
            </h2>
            {headline && current_company && (
              <p className="text-sm font-semibold font-sans text-gray-600 capitalize">
                {headline} at {current_company}
              </p>
            )}
          </div>
        </div>
        {college && (
          <div className="flex flex-col">
            <p className="text-md font-sans font-semibold text-gray-600">
              {degree}
            </p>
            <p className="text-sm font-sans font-semibold text-gray-500">
              {college}
            </p>
          </div>
        )}

        {skill && (
          <div className="flex flex-wrap gap-2 ">
            {skill.map((s) => (
              <Badge
                key={s}
                className="bg-gradient-to-br from-blue-500 to-purple-500 text-white px-3 py-1"
              >
                {s}
              </Badge>
            ))}
          </div>
        )}

        <div>
          {current_ctc && (
            <p className="italic text-sm text-gray-700">
              Current CTC: {current_ctc}
            </p>
          )}
          {expected_ctc && (
            <p className="italic text-sm text-gray-700">
              Expected CTC: {expected_ctc}
            </p>
          )}
        </div>

        <div className="space-y-0 text-sm">
          {email && (
            <div className="flex items-center space-x-2 ">
              {/* <span>📧</span> */}
              <span className="font-serif flex items-center space-x-1 text-gray-600">
                <span>{email}</span>
                {/* <CheckCircle className="h-4 w-4 text-green-500" /> */}
              </span>
            </div>
          )}
          {phone && (
            <p className="flex items-center space-x-2">
              {/* <span>📞</span> */}
              <span className="font-serif flex items-center space-x-1 text-gray-600">
                {phone}
              </span>
            </p>
          )}
          {linkedIn && (
            <p className="flex items-center space-x-2 text-blue-500">
              <span>🔗</span>
              <a href={linkedIn} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </p>
          )}
        </div>

        <StarRating rating={rating || 0} />

        <Button variant="outline" size="sm">
          + Add tag
        </Button>

        <div className="text-sm">
          <p className="font-semibold mb-1">Owner</p>
          <Select defaultValue={owner?.id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={owner?.name || "Unassigned"} />
            </SelectTrigger>
            <SelectContent>
              {/* Populate team members */}
              <SelectItem value={owner?.id}>{owner?.name}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Jobs Card */}
      <Card className=" p-4 mt-4 space-y-2">
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

      <Card className=" p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EDUCATION</p>
          <Button variant="outline" size="sm">
            + Add Education
          </Button>
        </div>
        {education ? (
          <p className="text-sm text-gray-600">{education}</p>
        ) : (
          <p className="text-xs text-gray-400">No education found</p>
        )}
      </Card>
      <Card className=" p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EXPERIENCE</p>
          <Button variant="outline" size="sm">
            + Add experience
          </Button>
        </div>
        {experience ? (
          <p className="text-sm text-gray-600">{experience}</p>
        ) : (
          <p className="text-xs text-gray-400">No experience found</p>
        )}
      </Card>
    </div>
  );
}
