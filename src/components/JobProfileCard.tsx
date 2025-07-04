import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  MapPin,
  Clock,
  Building2,
  Globe,
  CheckCircle,
  Users,
  Tag,
  Edit2,
} from "lucide-react";
import EditJobModal from "./modals/EditJobModal";
import { useState } from "react";

export default function JobProfileCard({ job }) {
  const [openJobModal, setOpenJobModal] = useState<boolean>(false);

  if (!job) {
    return (
      <div className="w-full p-6 bg-gray-50 text-center text-gray-500">
        Loading job details...
      </div>
    );
  }

  const {
    job_code,
    job_title,
    company_industry,
    company_job_function,
    department,
    workplace,
    office_primary_location,
    office_location_additional = [],
    description_about,
    description_requirements,
    description_benefits,
    employment_type,
    experience,
    education,
    keywords = [],
    salary_from,
    salary_to,
    salary_currency,
    status,
    priority,
    applicants,
    posted,
    office_on_careers_page,
  } = job;

  return (
    <div className="w-full p-4 bg-transparent">
      <Card className="shadow-md rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {job_title}
              </h1>
              <p className="text-sm text-blue-200 mt-1">
                {company_industry} &ndash; {workplace}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="text-blue-800 hover:bg-blue-800 hover:text-white rounded-full"
              onClick={() => {
                setOpenJobModal(true);
              }}
            >
              <Edit2 className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge className="bg-blue-800 text-blue-200 text-xs py-1 px-2">
              {status}
            </Badge>
            <Badge className="bg-blue-800 text-blue-200 text-xs py-1 px-2">
              {priority}
            </Badge>
            <Badge className="bg-blue-800 text-blue-200 text-xs py-1 px-2">
              {employment_type}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 text-sm text-gray-700">
            {[
              { icon: Tag, label: "Code", value: job_code },
              { icon: Building2, label: "Department", value: department },
              { icon: Globe, label: "Workplace", value: workplace },
              {
                icon: MapPin,
                label: "Location",
                value: office_primary_location,
              },
              { icon: Clock, label: "Experience", value: experience },
              { icon: Users, label: "Applicants", value: applicants },
              {
                icon: CheckCircle,
                label: "On Careers",
                value: office_on_careers_page ? "Yes" : "No",
              },
              { icon: Tag, label: "Education", value: education },
              {
                icon: Tag,
                label: "Salary",
                value: `${salary_from} - ${salary_to} ${salary_currency}`,
              },
              { icon: Tag, label: "Posted", value: posted },
            ].map((item) => (
              <div key={item.label} className="flex items-center">
                <item.icon className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-gray-800">{item.label}</p>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description Sections */}
          <div className="space-y-2">
            <Accordion type="multiple" className=" pt-4">
              <AccordionItem value="about">
                <AccordionTrigger className="text-base font-semibold text-gray-800 hover:no-underline">
                  About
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line mt-2">
                    {description_about}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="multiple" className=" pt-4">
              <AccordionItem value="requirements">
                <AccordionTrigger className="text-base font-semibold text-gray-800 hover:no-underline">
                  Requirements
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                    {description_requirements.split("\n").map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="multiple" className="pt-4">
              <AccordionItem value="benefits">
                <AccordionTrigger className="text-base font-semibold text-gray-800 hover:no-underline">
                  Benefits
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                    {description_benefits.split("\n").map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <Badge
                    key={kw}
                    className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-50 hover:text-blue-500 text-sm py-1 px-2 rounded"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex space-x-4">
            <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
              Apply Now
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
      {job && (
        <EditJobModal
          open={openJobModal}
          onOpenChange={setOpenJobModal}
          jobId={job.id}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
