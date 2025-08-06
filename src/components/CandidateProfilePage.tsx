import CandidateProfileCard from "./CandidateProfileCard";
import CandidateDetailsTabs from "./CandidateDetailsTabs";

export default function CandidateProfilePage({ candidate, fetchCandidates }) {
  return (
    <div className="flex w-full h-full bg-gray-50">
      <div className="w-[30%] h-full overflow-y-auto">
        <CandidateProfileCard
          candidate={candidate}
          fetchCandidates={fetchCandidates}
        />
      </div>

      <div className="w-[70%] h-full overflow-y-auto border-l border-gray-200">
        <CandidateDetailsTabs
          candidate={candidate}
          fetchCandidates={fetchCandidates}
        />
      </div>
    </div>
  );
}
