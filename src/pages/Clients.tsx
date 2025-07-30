import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Briefcase,
  MoreHorizontal,
  Star,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditClientModal from "@/components/modals/EditClientModal";
import AddClientModal from "@/components/modals/AddClientModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const clients = [
  {
    id: 1,
    name: "TechCorp Solutions",
    industry: "Technology",
    location: "San Francisco, CA",
    contactPerson: "Sarah Mitchell",
    email: "sarah.mitchell@techcorp.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    activeJobs: 5,
    totalHires: 23,
    joinedDate: "Jan 2024",
    logo: "TC",
  },
  {
    id: 2,
    name: "Healthcare Plus",
    industry: "Healthcare",
    location: "New York, NY",
    contactPerson: "Dr. James Wilson",
    email: "j.wilson@healthcareplus.com",
    phone: "+1 (555) 987-6543",
    status: "Active",
    activeJobs: 3,
    totalHires: 12,
    joinedDate: "Mar 2024",
    logo: "HP",
  },
  {
    id: 3,
    name: "FinanceFlow Inc",
    industry: "Finance",
    location: "Chicago, IL",
    contactPerson: "Emma Rodriguez",
    email: "emma.r@financeflow.com",
    phone: "+1 (555) 456-7890",
    status: "Active",
    activeJobs: 2,
    totalHires: 8,
    joinedDate: "Feb 2024",
    logo: "FF",
  },
  {
    id: 4,
    name: "Creative Studios",
    industry: "Marketing",
    location: "Los Angeles, CA",
    contactPerson: "Alex Chen",
    email: "alex@creativestudios.com",
    phone: "+1 (555) 321-0987",
    status: "Inactive",
    activeJobs: 0,
    totalHires: 15,
    joinedDate: "Dec 2023",
    logo: "CS",
  },
  {
    id: 5,
    name: "RetailMax Group",
    industry: "Retail",
    location: "Seattle, WA",
    contactPerson: "Lisa Thompson",
    email: "lisa.t@retailmax.com",
    phone: "+1 (555) 654-3210",
    status: "Pending",
    activeJobs: 1,
    totalHires: 0,
    joinedDate: "May 2024",
    logo: "RM",
  },
];

const prospectClients = [
  {
    id: 1,
    name: "InnovateTech Solutions",
    industry: "Technology",
    location: "Austin, TX",
    contactPerson: "Michael Johnson",
    email: "m.johnson@innovatetech.com",
    phone: "+1 (555) 234-5678",
    status: "Hot",
    potentialValue: "$50,000",
    lastContact: "2 days ago",
    nextFollowUp: "Tomorrow",
    source: "LinkedIn",
    interestLevel: 4,
    logo: "IT",
  },
  {
    id: 2,
    name: "GreenEnergy Corp",
    industry: "Energy",
    location: "Denver, CO",
    contactPerson: "Sarah Davis",
    email: "sarah.d@greenenergy.com",
    phone: "+1 (555) 345-6789",
    status: "Warm",
    potentialValue: "$75,000",
    lastContact: "1 week ago",
    nextFollowUp: "Next Monday",
    source: "Referral",
    interestLevel: 3,
    logo: "GE",
  },
  {
    id: 3,
    name: "UrbanDesign Studio",
    industry: "Architecture",
    location: "Portland, OR",
    contactPerson: "Alex Kim",
    email: "alex@urbandesign.com",
    phone: "+1 (555) 456-7890",
    status: "Cold",
    potentialValue: "$30,000",
    lastContact: "2 weeks ago",
    nextFollowUp: "This Friday",
    source: "Website",
    interestLevel: 2,
    logo: "UD",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Hot":
      return "bg-red-100 text-red-800";
    case "Warm":
      return "bg-orange-100 text-orange-800";
    case "Cold":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getInterestStars = (level) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-3 h-3 ${
        i < level ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
      }`}
    />
  ));
};

const Clients = () => {
  const { toast } = useToast();
  const [editingClient, setEditingClient] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isProspectEdit, setIsProspectEdit] = useState(false);
  const [clientsList, setClientsList] = useState(clients);
  const [prospectsList, setProspectsList] = useState(prospectClients);

  const handleEditClient = (client, isProspect = false) => {
    setEditingClient(client);
    setIsProspectEdit(isProspect);
    setIsEditFormOpen(true);
  };

  const handleSaveClient = (updatedClient) => {
    if (isProspectEdit) {
      setProspectsList((prev) =>
        prev.map((p) => (p.id === updatedClient.id ? updatedClient : p))
      );
      toast({
        title: "Prospect Updated",
        description: `${updatedClient.name} has been updated.`,
      });
    } else {
      setClientsList((prev) =>
        prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
      );
      toast({
        title: "Client Updated",
        description: `${updatedClient.name} has been updated.`,
      });
    }
    setIsEditFormOpen(false);
    setEditingClient(null);
  };

  const handleWhatsAppConnect = (phone, name, isProspect = false) => {
    const message = isProspect
      ? `Hi ${name}, I hope this message finds you well. I wanted to follow up regarding our discussion about potential recruitment services. Would you like to schedule a call to explore how we can help with your hiring needs?`
      : `Hi ${name}, I hope you're doing well. I wanted to check in on our current recruitment projects and see if there's anything you need assistance with. Please let me know if you'd like to discuss any upcoming hiring requirements.`;

    const cleanPhone = phone.replace(/[^\d]/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "WhatsApp Opened",
      description: `Opening WhatsApp chat with ${name}`,
    });
  };

  const handleEmailConnect = (email, name, isProspect = false) => {
    const subject = isProspect
      ? `Follow-up: Partnership Opportunity with Your Company`
      : `Check-in: Current Recruitment Projects`;

    const body = isProspect
      ? `Dear ${name},\n\nI hope this email finds you well. I wanted to follow up on our recent conversation regarding potential recruitment services for your organization.\n\nWe specialize in connecting top talent with innovative companies, and I believe we could be a valuable partner in helping you build your team.\n\nWould you be available for a brief call this week to discuss your current and upcoming hiring needs?\n\nBest regards,\n[Your Name]`
      : `Dear ${name},\n\nI hope you're doing well. I wanted to check in on our current recruitment projects and see how everything is progressing.\n\nIf you have any upcoming hiring requirements or would like to discuss expanding our current search, please let me know. I'm here to support your talent acquisition needs.\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);

    toast({
      title: "Email Client Opened",
      description: `Opening email composer for ${name}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Client Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your active clients and prospect pipeline.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Prospect
            </Button>
            <Button
              onClick={() => setIsAddClientOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        <AddClientModal
          open={isAddClientOpen}
          onClose={() => setIsAddClientOpen(false)}
        />

        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="clients" className="text-lg">
              Active Clients
            </TabsTrigger>
            <TabsTrigger value="prospects" className="text-lg">
              Prospect Pipeline
            </TabsTrigger>
          </TabsList>

          {/* Active Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            {/* Search and Filters for Clients */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search clients..."
                      className="pl-10 bg-white/80"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-white/80">
                      Industry
                    </Button>
                    <Button variant="outline" className="bg-white/80">
                      Status
                    </Button>
                    <Button variant="outline" className="bg-white/80">
                      Location
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clients List */}
            <div className="space-y-4">
              {clientsList.map((client) => (
                <Card
                  key={client.id}
                  className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                            {client.logo}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-800">
                              {client.name}
                            </h3>
                            <Badge className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                          </div>

                          <p className="text-slate-600 font-medium mb-3">
                            {client.industry}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Building2 className="w-4 h-4" />
                              <span className="font-medium">
                                {client.contactPerson}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="w-4 h-4" />
                              {client.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="w-4 h-4" />
                              {client.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-4 h-4" />
                              {client.phone}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-slate-800">
                                {client.activeJobs}
                              </span>
                              <span className="text-slate-600">
                                Active Jobs
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-green-500" />
                              <span className="font-medium text-slate-800">
                                {client.totalHires}
                              </span>
                              <span className="text-slate-600">
                                Total Hires
                              </span>
                            </div>
                            <span className="text-slate-500">
                              Client since {client.joinedDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80"
                          onClick={() =>
                            handleWhatsAppConnect(
                              client.phone,
                              client.contactPerson,
                              false
                            )
                          }
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80"
                          onClick={() =>
                            handleEmailConnect(
                              client.email,
                              client.contactPerson,
                              false
                            )
                          }
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80"
                        >
                          View Jobs
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Contact
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white/95 backdrop-blur-sm"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                handleWhatsAppConnect(
                                  client.phone,
                                  client.contactPerson,
                                  false
                                )
                              }
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              WhatsApp Connect
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleEmailConnect(
                                  client.email,
                                  client.contactPerson,
                                  false
                                )
                              }
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Email Connect
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClient(client, false)}
                            >
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Contract</DropdownMenuItem>
                            <DropdownMenuItem>Send Report</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Archive Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Prospects Tab */}
          <TabsContent value="prospects" className="space-y-6">
            {/* Search and Filters for Prospects */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search prospects..."
                      className="pl-10 bg-white/80"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-white/80">
                      Status
                    </Button>
                    <Button variant="outline" className="bg-white/80">
                      Industry
                    </Button>
                    <Button variant="outline" className="bg-white/80">
                      Source
                    </Button>
                    <Button variant="outline" className="bg-white/80">
                      Interest Level
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prospects List */}
            <div className="space-y-4">
              {prospectsList.map((prospect) => (
                <Card
                  key={prospect.id}
                  className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white text-lg font-bold">
                            {prospect.logo}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-800">
                              {prospect.name}
                            </h3>
                            <Badge className={getStatusColor(prospect.status)}>
                              {prospect.status}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getInterestStars(prospect.interestLevel)}
                            </div>
                          </div>

                          <p className="text-slate-600 font-medium mb-3">
                            {prospect.industry}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Building2 className="w-4 h-4" />
                              <span className="font-medium">
                                {prospect.contactPerson}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="w-4 h-4" />
                              {prospect.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="w-4 h-4" />
                              {prospect.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-4 h-4" />
                              {prospect.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-medium">
                                {prospect.potentialValue}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <TrendingUp className="w-4 h-4" />
                              <span>Source: {prospect.source}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="text-slate-600">
                                Last Contact: {prospect.lastContact}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-orange-500" />
                              <span className="text-slate-600">
                                Next Follow-up: {prospect.nextFollowUp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80"
                          onClick={() =>
                            handleWhatsAppConnect(
                              prospect.phone,
                              prospect.contactPerson,
                              true
                            )
                          }
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80"
                          onClick={() =>
                            handleEmailConnect(
                              prospect.email,
                              prospect.contactPerson,
                              true
                            )
                          }
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80"
                        >
                          Schedule Call
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Convert to Client
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white/95 backdrop-blur-sm"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                handleWhatsAppConnect(
                                  prospect.phone,
                                  prospect.contactPerson,
                                  true
                                )
                              }
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              WhatsApp Connect
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleEmailConnect(
                                  prospect.email,
                                  prospect.contactPerson,
                                  true
                                )
                              }
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Email Connect
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClient(prospect, true)}
                            >
                              Edit Prospect
                            </DropdownMenuItem>
                            <DropdownMenuItem>Add Notes</DropdownMenuItem>
                            <DropdownMenuItem>Send Proposal</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Mark as Lost
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {isEditFormOpen && editingClient && (
          <EditClientModal
            clientId={editingClient.id}
            open={isEditFormOpen}
            onOpenChange={() => {
              setIsEditFormOpen(false);
              setEditingClient(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default Clients;
