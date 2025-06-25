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
import StarRating from "./StarRating";

export default function CandidateProfileCard({ candidate }) {
  const {
    first_name,
    last_name,
    title,
    location,
    source,
    email,
    phone,
    linkedin_url,
    rating,
    owner,
    jobs = [],
    custom_fields = {},
  } = candidate;

  return (
    <Card className="w-72 p-4 flex flex-col space-y-4">
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
            {[first_name[0], last_name[0]].filter(Boolean).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold text-lg">
            {first_name} {last_name}
          </h2>
          {title && <p className="text-sm text-gray-500">{title}</p>}
          {location && <p className="text-sm text-gray-500">{location}</p>}
          {source && (
            <p className="text-sm text-gray-500">Sourced via {source}</p>
          )}
        </div>
      </div>

      {candidate.bio && <p className="italic text-sm">{candidate.bio}</p>}

      <div className="space-y-1 text-sm">
        {email && (
          <p className="flex items-center space-x-2">
            📧 <span>{email}</span>
          </p>
        )}
        {phone && (
          <p className="flex items-center space-x-2">
            📞 <span>{phone}</span>
          </p>
        )}
        {linkedin_url && (
          <p className="flex items-center space-x-2 text-blue-500 cursor-pointer">
            🔗{" "}
            <a href={linkedin_url} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </p>
        )}
      </div>

      <StarRating rating={rating || 0} />

      <Button variant="outline" size="sm">
        + Add tag
      </Button>

      <div className="text-sm space-y-1">
        <p className="font-semibold">Owner</p>
        <Select defaultValue={owner?.id}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={owner?.name || "Unassigned"} />
          </SelectTrigger>
          <SelectContent>
            {/* map your team members here */}
            <SelectItem value={owner?.id}>{owner?.name}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1 text-sm">
        <p className="font-semibold">Jobs</p>
        <Button variant="outline" size="sm">
          + Add job
        </Button>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <p key={job.id} className="text-sm text-slate-600">
              {job.title}
            </p>
          ))
        ) : (
          <p className="text-xs text-gray-400">No jobs found</p>
        )}
      </div>

      <div className="space-y-1 text-sm">
        <p className="font-semibold">Custom Fields</p>
        {Object.entries(custom_fields).map(([key, value]) => (
          <p key={key} className="text-sm">
            <span className="font-medium">
              {key}: {value as React.ReactNode}
            </span>
          </p>
        ))}

        {Object.keys(custom_fields).length === 0 && (
          <p className="text-xs text-gray-400">No custom fields</p>
        )}
      </div>
    </Card>
  );
}
