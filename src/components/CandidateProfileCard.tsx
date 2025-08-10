import React, { useState } from "react";
import AssignToJobModal from "./modals/AssigntoJobModal";
import EditCandidateModal from "./modals/EditCandidateModal";

import CandidateHeaderCard from "@/components/panels/CandidateHeaderCard";
import JobsCard from "@/components/panels/JobsCard";
import EducationCard from "@/components/panels/EducationCard";
import ExperienceCard from "@/components/panels/ExperienceCard";
import SkillsCard from "@/components/panels/SkillsCard";

interface JobAssignment {
  job_id: number;
  status: string;
  job_title: string;
  hmapproval: string;
  recruiter_status: string;
}

interface CandidateProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string | null;
  address: string;
  experience: string;
  photo_url: string | null;
  education: string;
  summary: string | null;
  resume_url: string;
  cover_letter: string | null;
  rating: string | null;
  current_company: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  skill: string[];
  created_at: string;
  updated_at: string;
  linkedinprofile: string;
  notice_period: string;
  institutiontier: string;
  companytier: string;
  jobs_assigned: JobAssignment[];
}

interface ProfileCardProps {
  candidate: CandidateProfile;
  fetchCandidates: () => void;
}

export default function CandidateProfileCard({
  candidate,
  fetchCandidates,
}: ProfileCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);

  return (
    <div className="min-w-full h-full p-3 font-sans">
      <CandidateHeaderCard
        candidate={candidate}
        onEdit={() => setEditOpen(true)}
      />

      <JobsCard
        candidateId={candidate.id}
        jobs={candidate.jobs_assigned}
        fetchCandidates={fetchCandidates}
        onAddJob={() => setJobOpen(true)}
      />

      <EducationCard
        candidateId={candidate.id}
        educationString={candidate.education}
        fetchCandidates={fetchCandidates}
      />
      <ExperienceCard
        candidateId={candidate.id}
        experienceString={candidate.experience}
        fetchCandidates={fetchCandidates}
      />

      <SkillsCard
        candidateId={candidate.id}
        skills={candidate.skill}
        fetchCandidates={fetchCandidates}
      />

      {editOpen && (
        <EditCandidateModal
          isOpen={editOpen}
          onOpenChange={setEditOpen}
          candidate={candidate}
          onSaveSuccess={() => {
            fetchCandidates();
            setEditOpen(false);
          }}
        />
      )}

      {jobOpen && (
        <AssignToJobModal
          open={jobOpen}
          onOpenChange={setJobOpen}
          candidateIds={[candidate.id]}
          onSuccess={() => {
            fetchCandidates();
            setJobOpen(false);
          }}
        />
      )}
    </div>
  );
}
