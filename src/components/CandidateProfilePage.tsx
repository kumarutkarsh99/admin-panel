import CandidateProfileCard from "./CandidateProfileCard";
import CandidateDetailsTabs from "./CandidateDetailsTabs";

export default function CandidateProfilePage({ candidate }) {
  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-[30%] h-full overflow-y-auto">
        <CandidateProfileCard candidate={candidate} />
      </div>

      <div className="w-[70%] h-full overflow-y-auto border-l border-gray-200">
        <CandidateDetailsTabs candidate={candidate} />
      </div>
    </div>
  );
}
