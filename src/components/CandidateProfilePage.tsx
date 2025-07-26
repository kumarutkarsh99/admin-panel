import CandidateProfileCard from "./CandidateProfileCard";
import CandidateDetailsTabs from "./CandidateDetailsTabs";

export default function CandidateProfilePage({ candidate }) {
  return (
    <div className="flex h-screen">
      {/* Pass candidate into the left-hand card */}
      <div className="w-[30%]">
        <CandidateProfileCard candidate={candidate} />
      </div>

      {/* And into the right-hand tabs */}
      <div className="w-[70%]">
        <CandidateDetailsTabs candidate={candidate} />
      </div>
    </div>
  );
}
