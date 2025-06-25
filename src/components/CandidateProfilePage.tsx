import CandidateProfileCard from "./CandidateProfileCard";
import CandidateDetailsTabs from "./CandidateDetailsTabs";

export default function CandidateProfilePage({ candidate }) {
  return (
    <div className="flex h-screen">
      {/* Pass candidate into the left-hand card */}
      <CandidateProfileCard candidate={candidate} />

      {/* And into the right-hand tabs */}
      <div className="flex-1 overflow-auto">
        <CandidateDetailsTabs candidate={candidate} />
      </div>
    </div>
  );
}
