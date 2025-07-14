import JobProfileCard from "./JobProfileCard";
import JobDetailsTabs from "./JobDetailsTabs";

export default function JobProfilePage({ job }) {
  return (
    <div className="flex h-screen">
      {/* Pass candidate into the left-hand card */}
      <div className="w-[30%]">
        <JobProfileCard job={job} />
      </div>

      {/* And into the right-hand tabs */}
      <div className="w-[70%]">
        <JobDetailsTabs job={job} />
      </div>
    </div>
  );
}
