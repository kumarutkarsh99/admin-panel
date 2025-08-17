import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, User, Building, Mail, Shield, Save, FileText, ChevronDown, ChevronRight, X, Bold, Italic, Underline, Link, Image, AlignLeft, AlignCenter, AlignRight, Paperclip, Type } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  // Templates state management
  const [expandedSections, setExpandedSections] = useState({
    email: true,
    sms: true,
    notes: true,
    aira: true
  });

  const [dialogs, setDialogs] = useState({
    email: false,
    sms: false,
    notes: false,
    aira: false
  });

  const [formData, setFormData] = useState({
    templateName: '',
    templateType: '',
    subject: '',
    body: '',
    shareWithEveryone: false
  });

  // Email formatting state
  const [emailFormat, setEmailFormat] = useState({
    htmlTag: 'div',
    fontSize: '13px',
    fontFamily: 'Arial',
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left'
  });

  // Email formatting functions
  const toggleBold = () => {
    setEmailFormat(prev => ({ ...prev, bold: !prev.bold }));
  };

  const toggleItalic = () => {
    setEmailFormat(prev => ({ ...prev, italic: !prev.italic }));
  };

  const toggleUnderline = () => {
    setEmailFormat(prev => ({ ...prev, underline: !prev.underline }));
  };

  const setAlignment = (align: string) => {
    setEmailFormat(prev => ({ ...prev, alignment: align }));
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const linkText = `[Link](${url})`;
      setFormData(prev => ({ 
        ...prev, 
        body: prev.body + linkText 
      }));
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const imageText = `![Image](${url})`;
      setFormData(prev => ({ 
        ...prev, 
        body: prev.body + imageText 
      }));
    }
  };

  const attachFile = () => {
    // In a real implementation, this would open a file picker
    alert('File attachment functionality would be implemented here');
  };

  const resetFormatting = () => {
    setEmailFormat({
      htmlTag: 'div',
      fontSize: '13px',
      fontFamily: 'Arial',
      bold: false,
      italic: false,
      underline: false,
      alignment: 'left'
    });
  };

  // Templates functions
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

const openDialog = (type: string) => {
  setFormData({
    templateName: '',
    templateType: '',
    subject: '',
    body: '',
    shareWithEveryone: false
  });
  setDialogs(prev => ({ ...prev, [type]: true }));
};

  const closeDialog = (type: string) => {
    setDialogs(prev => ({ ...prev, [type]: false }));
  };

  const handleSave = (type: string) => {
    console.log(`Saving ${type} template:`, formData);
    closeDialog(type);
  };

  const handleCancel = (type: string) => {
    closeDialog(type);
  };

  const TemplateSection = ({ title, type, icon }: { title: string; type: string; icon: string }) => (
    <div className="border border-gray-200 rounded-lg mb-4">
      <div
        onClick={() => toggleSection(type)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            {expandedSections[type] ? (
              <ChevronDown className="w-4 h-4 text-white" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white" />
            )}
          </div>
          <span className="text-lg font-medium text-blue-600">{title}</span>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            openDialog(type);
          }}
          variant="outline"
          className="text-blue-600 border-blue-200 hover:border-blue-300"
        >
          Add template
        </Button>
      </div>
      {expandedSections[type] && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <div className="py-4 text-gray-500 text-center">
            No templates added yet
          </div>
        </div>
      )}
    </div>
  );

  const AddTemplateDialog = ({ type, title, isOpen, onClose }: { type: string; title: string; isOpen: boolean; onClose: (type: string) => void }) => (
    <Dialog open={isOpen} onOpenChange={() => onClose(type)}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild>
           
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE NAME <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter template name..."
                value={formData.templateName}
                onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE TYPE <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.templateType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, templateType: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a template type" />
                </SelectTrigger>
               <SelectContent>
  {type === "email" && (
    <>
      <SelectItem value="candidate-email">Candidate Email</SelectItem>
      <SelectItem value="post-interview-candidate">
        Post-interview email (Candidate)
      </SelectItem>
      <SelectItem value="contact-email">Contact Email</SelectItem>
      <SelectItem value="submission-email">Candidate Submission Email</SelectItem>
      <SelectItem value="post-interview-contact">
        Post-interview email (Contact)
      </SelectItem>
    </>
  )}

  {type === "sms" && (
    <>
      <SelectItem value="otp">Candidate SMS</SelectItem>
      <SelectItem value="reminder">Contact SMS</SelectItem>
      
    </>
  )}

  {type === "notes" && (
    <>
      
      <SelectItem value="candidate-feedback">Candidate Note</SelectItem>
      <SelectItem value="interview-notes">Contact Note</SelectItem>
      <SelectItem value="internal-comments">Job Note</SelectItem>
      <SelectItem value="task-notes">Company Note</SelectItem>
      <SelectItem value="interview-notes">Deal Note</SelectItem>
    </>
  )}

  {type === "aira" && (
    <>
      <SelectItem value="ai-intro">Candidate Prompt</SelectItem>
      <SelectItem value="ai-followup">Contact Prompt</SelectItem>
      <SelectItem value="ai-summary">Job Prompt</SelectItem>
    
    </>
  )}
</SelectContent>

              </Select>
            </div>
          </div>

          {type === 'email' && (
            <div>
              <Label className="text-sm font-medium text-gray-700">
                SUBJECT
              </Label>
              <Input
                placeholder="Enter a subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-gray-700">
              BODY
            </Label>
            <div className="border border-gray-300 rounded-lg mt-2">
              {type === 'email' && (
                <TooltipProvider>
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      {/* HTML Tag Selector */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={emailFormat.htmlTag}
                              onValueChange={(value) => setEmailFormat(prev => ({ ...prev, htmlTag: value }))}
                            >
                              <SelectTrigger className="w-20 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="div">Div</SelectItem>
                                <SelectItem value="p">P</SelectItem>
                                <SelectItem value="h1">H1</SelectItem>
                                <SelectItem value="h2">H2</SelectItem>
                                <SelectItem value="h3">H3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>HTML Tag</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Font Size Selector */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={emailFormat.fontSize}
                              onValueChange={(value) => setEmailFormat(prev => ({ ...prev, fontSize: value }))}
                            >
                              <SelectTrigger className="w-16 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10px">10px</SelectItem>
                                <SelectItem value="12px">12px</SelectItem>
                                <SelectItem value="13px">13px</SelectItem>
                                <SelectItem value="14px">14px</SelectItem>
                                <SelectItem value="16px">16px</SelectItem>
                                <SelectItem value="18px">18px</SelectItem>
                                <SelectItem value="24px">24px</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Font Size</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Font Family Selector */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={emailFormat.fontFamily}
                              onValueChange={(value) => setEmailFormat(prev => ({ ...prev, fontFamily: value }))}
                            >
                              <SelectTrigger className="w-24 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Helvetica">Helvetica</SelectItem>
                                <SelectItem value="Times New Roman">Times</SelectItem>
                                <SelectItem value="Georgia">Georgia</SelectItem>
                                <SelectItem value="Verdana">Verdana</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Font Family</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex items-center space-x-1">
                      {/* Text Formatting */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.bold ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={toggleBold}
                          >
                            <Bold className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bold</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.italic ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={toggleItalic}
                          >
                            <Italic className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Italic</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.underline ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={toggleUnderline}
                          >
                            <Underline className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Underline</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Alignment */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.alignment === 'left' ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setAlignment('left')}
                          >
                            <AlignLeft className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Left</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.alignment === 'center' ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setAlignment('center')}
                          >
                            <AlignCenter className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Center</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.alignment === 'right' ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setAlignment('right')}
                          >
                            <AlignRight className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Right</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Insert Options */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={insertLink}
                          >
                            <Link className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert Link</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={insertImage}
                          >
                            <Image className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert Image</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={attachFile}
                          >
                            <Paperclip className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach File</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Reset Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={resetFormatting}
                          >
                            <Type className="w-4 h-4 mr-1" />
                            Reset
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset Formatting</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </TooltipProvider>
              )}
          

<Textarea
  placeholder={type === 'email' ? 'Enter your email template content...' : 'Enter template content...'}
  value={formData.body}
  onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-y-auto"
  rows={type === 'email' ? 6 : 8}
  style={{ 
    maxHeight: type === 'email' ? '150px' : 'auto',
    minHeight: '120px',
    fontSize: type === 'email' ? emailFormat.fontSize : undefined,
    fontFamily: type === 'email' ? emailFormat.fontFamily : undefined,
    fontWeight: type === 'email' && emailFormat.bold ? 'bold' : 'normal',
    fontStyle: type === 'email' && emailFormat.italic ? 'italic' : 'normal',
    textDecoration: type === 'email' && emailFormat.underline ? 'underline' : 'none',
    textAlign: type === 'email' ? (emailFormat.alignment as 'left' | 'center' | 'right') : 'left'
  }}
/>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareWithEveryone"
              checked={formData.shareWithEveryone}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithEveryone: !!checked }))}
            />
            <Label htmlFor="shareWithEveryone" className="text-sm text-gray-700">
              Share template with everyone
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleCancel(type)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(type)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
            <p className="text-slate-600 mt-1">
              Manage your account and system preferences.
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="bg-white/80">
                      Upload Photo
                    </Button>
                    <p className="text-sm text-slate-600 mt-2">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      placeholder="HR Manager"
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    className="bg-white/80"
                    rows={3}
                  />
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Company Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="TalentFlow Inc."
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://talentflow.com"
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Select>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">
                          201-1000 employees
                        </SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Company address..."
                    className="bg-white/80"
                    rows={3}
                  />
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newApplications">New Applications</Label>
                      <p className="text-sm text-slate-600">
                        Get notified when new applications are received
                      </p>
                    </div>
                    <Switch id="newApplications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="interviewReminders">
                        Interview Reminders
                      </Label>
                      <p className="text-sm text-slate-600">
                        Receive reminders before scheduled interviews
                      </p>
                    </div>
                    <Switch id="interviewReminders" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="candidateUpdates">
                        Candidate Updates
                      </Label>
                      <p className="text-sm text-slate-600">
                        Get notified when candidates update their status
                      </p>
                    </div>
                    <Switch id="candidateUpdates" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-slate-600">
                        Receive weekly recruitment analytics reports
                      </p>
                    </div>
                    <Switch id="weeklyReports" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="systemUpdates">System Updates</Label>
                      <p className="text-sm text-slate-600">
                        Get notified about system maintenance and updates
                      </p>
                    </div>
                    <Switch id="systemUpdates" defaultChecked />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Email Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicationReceived">
                      Application Received
                    </Label>
                    <Textarea
                      id="applicationReceived"
                      placeholder="Email template for when applications are received..."
                      className="bg-white/80"
                      rows={4}
                      defaultValue="Dear {candidate_name}, Thank you for your application for the {job_title} position..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interviewInvite">
                      Interview Invitation
                    </Label>
                    <Textarea
                      id="interviewInvite"
                      placeholder="Email template for interview invitations..."
                      className="bg-white/80"
                      rows={4}
                      defaultValue="Dear {candidate_name}, We would like to invite you for an interview for the {job_title} position..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rejection">Rejection Email</Label>
                    <Textarea
                      id="rejection"
                      placeholder="Email template for rejection notifications..."
                      className="bg-white/80"
                      rows={4}
                      defaultValue="Dear {candidate_name}, Thank you for your interest in the {job_title} position..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offer">Job Offer</Label>
                    <Textarea
                      id="offer"
                      placeholder="Email template for job offers..."
                      className="bg-white/80"
                      rows={4}
                      defaultValue="Dear {candidate_name}, We are pleased to offer you the position of {job_title}..."
                    />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Templates
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

         <TabsContent value="templates">
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
      <p className="text-gray-600 mt-2">
        Manage your templates for email, SMS, notes, and AIRA communications.
      </p>
    </div>

    <div className="max-w-4xl">
      <TemplateSection
        title="Email Templates"
        type="email"
        icon="✉️"
      />
      <TemplateSection
        title="SMS Templates"
        type="sms"
        icon="💬"
      />
      <TemplateSection
        title="Notes Templates"
        type="notes"
        icon="📝"
      />
      <TemplateSection
        title="AIRA Prompt Templates"
        type="aira"
        icon="🤖"
      />
    </div>

    {/* Email Template Dialog */}
    <Dialog open={dialogs.email} onOpenChange={(open) => !open && closeDialog('email')}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Email Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE NAME <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter template name..."
                value={formData.templateName}
                onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE TYPE <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.templateType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, templateType: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a template type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate-email">Candidate Email</SelectItem>
                  <SelectItem value="post-interview-candidate">Post-interview email (Candidate)</SelectItem>
                  <SelectItem value="contact-email">Contact Email</SelectItem>
                  <SelectItem value="submission-email">Candidate Submission Email</SelectItem>
                  <SelectItem value="post-interview-contact">Post-interview email (Contact)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">SUBJECT</Label>
            <Input
              placeholder="Enter a subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">BODY</Label>
            <div className="border border-gray-300 rounded-lg mt-2">
              <TooltipProvider>
                <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Select
                            value={emailFormat.htmlTag}
                            onValueChange={(value) => setEmailFormat(prev => ({ ...prev, htmlTag: value }))}
                          >
                            <SelectTrigger className="w-20 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="div">Div</SelectItem>
                              <SelectItem value="p">P</SelectItem>
                              <SelectItem value="h1">H1</SelectItem>
                              <SelectItem value="h2">H2</SelectItem>
                              <SelectItem value="h3">H3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>HTML Tag</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Select
                            value={emailFormat.fontSize}
                            onValueChange={(value) => setEmailFormat(prev => ({ ...prev, fontSize: value }))}
                          >
                            <SelectTrigger className="w-16 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10px">10px</SelectItem>
                              <SelectItem value="12px">12px</SelectItem>
                              <SelectItem value="13px">13px</SelectItem>
                              <SelectItem value="14px">14px</SelectItem>
                              <SelectItem value="16px">16px</SelectItem>
                              <SelectItem value="18px">18px</SelectItem>
                              <SelectItem value="24px">24px</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Font Size</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Select
                            value={emailFormat.fontFamily}
                            onValueChange={(value) => setEmailFormat(prev => ({ ...prev, fontFamily: value }))}
                          >
                            <SelectTrigger className="w-24 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Arial">Arial</SelectItem>
                              <SelectItem value="Helvetica">Helvetica</SelectItem>
                              <SelectItem value="Times New Roman">Times</SelectItem>
                              <SelectItem value="Georgia">Georgia</SelectItem>
                              <SelectItem value="Verdana">Verdana</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Font Family</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={emailFormat.bold ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={toggleBold}
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Bold</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={emailFormat.italic ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={toggleItalic}
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Italic</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={emailFormat.underline ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={toggleUnderline}
                        >
                          <Underline className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Underline</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={emailFormat.alignment === 'left' ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setAlignment('left')}
                        >
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Align Left</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={emailFormat.alignment === 'center' ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setAlignment('center')}
                        >
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Align Center</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={emailFormat.alignment === 'right' ? "default" : "ghost"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setAlignment('right')}
                        >
                          <AlignRight className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Align Right</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={insertLink}
                        >
                          <Link className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Insert Link</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={insertImage}
                        >
                          <Image className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Insert Image</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={attachFile}
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Attach File</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={resetFormatting}
                        >
                          <Type className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset Formatting</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </TooltipProvider>
              <Textarea
                placeholder="Enter your email template content..."
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                className="border-0 focus:ring-0 resize-none"
                rows={6}
                style={{ 
                  maxHeight: '150px',
                  minHeight: '120px',
                  fontSize: emailFormat.fontSize,
                  fontFamily: emailFormat.fontFamily,
                  fontWeight: emailFormat.bold ? 'bold' : 'normal',
                  fontStyle: emailFormat.italic ? 'italic' : 'normal',
                  textDecoration: emailFormat.underline ? 'underline' : 'none',
                  textAlign: emailFormat.alignment as 'left' | 'center' | 'right'
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareWithEveryone-email"
              checked={formData.shareWithEveryone}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithEveryone: !!checked }))}
            />
            <Label htmlFor="shareWithEveryone-email" className="text-sm text-gray-700">
              Share template with everyone
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => handleCancel('email')}>
              Cancel
            </Button>
            <Button onClick={() => handleSave('email')} className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* SMS Template Dialog */}
    <Dialog open={dialogs.sms} onOpenChange={(open) => !open && closeDialog('sms')}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add SMS Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE NAME <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter template name..."
                value={formData.templateName}
                onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE TYPE <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.templateType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, templateType: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a template type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="otp">Candidate SMS</SelectItem>
                  <SelectItem value="reminder">Contact SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">BODY</Label>
            <Textarea
              placeholder="Enter template content..."
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              className="mt-2"
              rows={8}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareWithEveryone-sms"
              checked={formData.shareWithEveryone}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithEveryone: !!checked }))}
            />
            <Label htmlFor="shareWithEveryone-sms" className="text-sm text-gray-700">
              Share template with everyone
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => handleCancel('sms')}>
              Cancel
            </Button>
            <Button onClick={() => handleSave('sms')} className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Notes Template Dialog */}
    <Dialog open={dialogs.notes} onOpenChange={(open) => !open && closeDialog('notes')}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Notes Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE NAME <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter template name..."
                value={formData.templateName}
                onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE TYPE <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.templateType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, templateType: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a template type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate-feedback">Candidate Note</SelectItem>
                  <SelectItem value="interview-notes">Contact Note</SelectItem>
                  <SelectItem value="internal-comments">Job Note</SelectItem>
                  <SelectItem value="task-notes">Company Note</SelectItem>
                  <SelectItem value="deal-notes">Deal Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">BODY</Label>
            <Textarea
              placeholder="Enter template content..."
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              className="mt-2"
              rows={8}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareWithEveryone-notes"
              checked={formData.shareWithEveryone}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithEveryone: !!checked }))}
            />
            <Label htmlFor="shareWithEveryone-notes" className="text-sm text-gray-700">
              Share template with everyone
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => handleCancel('notes')}>
              Cancel
            </Button>
            <Button onClick={() => handleSave('notes')} className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* AIRA Template Dialog */}
    <Dialog open={dialogs.aira} onOpenChange={(open) => !open && closeDialog('aira')}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add AIRA Prompt Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE NAME <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter template name..."
                value={formData.templateName}
                onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE TYPE <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.templateType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, templateType: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a template type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-intro">Candidate Prompt</SelectItem>
                  <SelectItem value="ai-followup">Contact Prompt</SelectItem>
                  <SelectItem value="ai-summary">Job Prompt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">BODY</Label>
            <Textarea
              placeholder="Enter template content..."
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              className="mt-2"
              rows={8}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareWithEveryone-aira"
              checked={formData.shareWithEveryone}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithEveryone: !!checked }))}
            />
            <Label htmlFor="shareWithEveryone-aira" className="text-sm text-gray-700">
              Share template with everyone
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => handleCancel('aira')}>
              Cancel
            </Button>
            <Button onClick={() => handleSave('aira')} className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</TabsContent>

          <TabsContent value="security">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="bg-white/80"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-white/80"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-white/80"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactor">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-slate-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="twoFactor" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sessionTimeout">Auto-logout</Label>
                      <p className="text-sm text-slate-600">
                        Automatically log out after period of inactivity
                      </p>
                    </div>
                    <Switch id="sessionTimeout" defaultChecked />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Update Security
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
