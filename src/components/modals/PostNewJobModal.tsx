import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PostNewJobModalProps {
  open: boolean;
  onClose: () => void;
}

const PostNewJobModal: React.FC<PostNewJobModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-800 font-bold mb-4">
              Post a New Job
            </DialogTitle>
          </DialogHeader>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 mt-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Application Form Details
              </h3>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Job Title
              </label>
              <Input placeholder="e.g., Frontend Developer" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Department
              </label>
              <Input placeholder="e.g., Engineering" />
            </div>

            <div className="md:col-span-1 flex items-center gap-6">
              <label className="text-sm font-medium text-slate-700">
                Workplace
              </label>
              <ToggleGroup type="single" className="flex gap-2">
                <ToggleGroupItem
                  value="onsite"
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  On-site
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="hybrid"
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  Hybrid
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="remote"
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  Remote
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="md:col-span-1 flex items-center gap-6">
              <label className="text-sm font-medium text-slate-700">
                Priority
              </label>
              <ToggleGroup type="single" className="flex gap-2">
                <ToggleGroupItem
                  value="high"
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  High
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="medium"
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  Medium
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="low"
                  className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                  Low
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Office Location
              </label>
              <Input placeholder="e.g., New York, NY" />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Summary
                </label>
                <button
                  type="button"
                  className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text hover:from-blue-700 hover:to-purple-700 focus:outline-none flex items-center gap-1"
                >
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ✨
                  </span>
                  Generate with AI
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="Brief job summary..."
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-base text-slate-700 shadow-sm focus:outline-none"
              ></textarea>
            </div>

            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Company & Role Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Company Industry
                  </label>
                  <Input placeholder="e.g., Information Technology" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Job Function
                  </label>
                  <Input placeholder="e.g., Software Development" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Employment Type
                  </label>
                  <Input placeholder="e.g., Full-time, Contract" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Experience
                  </label>
                  <Input placeholder="e.g., 3+ years" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Education
                  </label>
                  <Input placeholder="e.g., Bachelor's in Computer Science" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Keywords
                  </label>
                  <Input placeholder="e.g., React, Node.js, REST APIs" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Annual Salary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Lower Bound
                  </label>
                  <Input placeholder="e.g., 60000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Upper Bound
                  </label>
                  <Input placeholder="e.g., 90000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Currency
                  </label>
                  <Input placeholder="e.g., USD" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 mt-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Application Form Configuration
              </h3>

              {/* Section: Personal Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-700 mb-2">
                  Personal Information
                </h4>
                {["Name", "Email", "Headline", "Phone", "Address", "Photo"].map(
                  (field) => (
                    <div
                      key={field}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <span className="text-sm text-slate-800 w-1/4">
                        {field}
                      </span>
                      <ToggleGroup
                        type="single"
                        defaultValue="mandatory"
                        className="gap-2"
                      >
                        <ToggleGroupItem
                          value="mandatory"
                          className="text-green-700 border-green-300 hover:bg-green-50"
                        >
                          Mandatory
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="optional"
                          className="text-blue-700 border-blue-300 hover:bg-blue-50"
                        >
                          Optional
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="off"
                          className="text-slate-500 border-slate-300 hover:bg-slate-100"
                        >
                          Off
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  )
                )}
              </div>

              {/* Section: Profile */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-700 mb-2">
                  Profile
                </h4>
                {["Education", "Experience", "Summary", "Resume"].map(
                  (field) => (
                    <div
                      key={field}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <span className="text-sm text-slate-800 w-1/4">
                        {field}
                      </span>
                      <ToggleGroup
                        type="single"
                        defaultValue="optional"
                        className="gap-2"
                      >
                        <ToggleGroupItem
                          value="mandatory"
                          className="text-green-700 border-green-300 hover:bg-green-50"
                        >
                          Mandatory
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="optional"
                          className="text-blue-700 border-blue-300 hover:bg-blue-50"
                        >
                          Optional
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="off"
                          className="text-slate-500 border-slate-300 hover:bg-slate-100"
                        >
                          Off
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  )
                )}
              </div>

              {/* Section: Details */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-700 mb-2">
                  Details
                </h4>
                {["Cover Letter", "Questions"].map((field) => (
                  <div
                    key={field}
                    className="flex items-center justify-between border-b py-2"
                  >
                    <span className="text-sm text-slate-800 w-1/4">
                      {field}
                    </span>
                    <ToggleGroup
                      type="single"
                      defaultValue="optional"
                      className="gap-2"
                    >
                      <ToggleGroupItem
                        value="mandatory"
                        className="text-green-700 border-green-300 hover:bg-green-50"
                      >
                        Mandatory
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="optional"
                        className="text-blue-700 border-blue-300 hover:bg-blue-50"
                      >
                        Optional
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="off"
                        className="text-slate-500 border-slate-300 hover:bg-slate-100"
                      >
                        Off
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                ))}
              </div>

              {/* Final Publish Button */}
              <div className="md:col-span-2 mt-4 flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Publish
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostNewJobModal;
