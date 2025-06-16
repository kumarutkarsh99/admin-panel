import {useEffect, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Building2,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddClientModal from "@/components/modals/AddClientModal";
import EditClientModal from "@/components/modals/EditClientModal";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "/api";

type Client = {
  id: number;
  name: string;
  industry: string;
  city: string;
  state: string;
  website: string;
  phone: string;
  tags: string[];
  created_dt: string;
  // any extra optional fields you added in Dev can stay here
  contact_person?: string;
  street1?: string;
  street2?: string;
  country?: string;
  status?: string;
  activeJobs?: number;
  totalHires?: number;
  joinedDate?: string;
  logo?: string;
import axios from "axios";
const API_BASE_URL ='http://51.20.181.155:3000';
console.log(API_BASE_URL)

interface Client {
  id: number;
  name: string;
  industry: string;
  location: string;
  contact_person: string;
  email: string;
  phone: string;
  status: string;
  activeJobs: number;
  totalHires: number;
  joinedDate: string;
  logo: string;
  street1: string;
  street2: string;
  city:string;
  state:string;
  country:string;
}

// const clients = [
//   {
//     id: 1,
//     name: "TechCorp Solutions",
//     industry: "Technology",
//     location: "San Francisco, CA",
//     contactPerson: "Sarah Mitchell",
//     email: "sarah.mitchell@techcorp.com",
//     phone: "+1 (555) 123-4567",
//     status: "Active",
//     activeJobs: 5,
//     totalHires: 23,
//     joinedDate: "Jan 2024",
//     logo: "TC"
//   },
//   {
//     id: 2,
//     name: "Healthcare Plus",
//     industry: "Healthcare",
//     location: "New York, NY", 
//     contactPerson: "Dr. James Wilson",
//     email: "j.wilson@healthcareplus.com",
//     phone: "+1 (555) 987-6543",
//     status: "Active",
//     activeJobs: 3,
//     totalHires: 12,
//     joinedDate: "Mar 2024",
//     logo: "HP"
//   },
//   {
//     id: 3,
//     name: "FinanceFlow Inc",
//     industry: "Finance",
//     location: "Chicago, IL",
//     contactPerson: "Emma Rodriguez",
//     email: "emma.r@financeflow.com",
//     phone: "+1 (555) 456-7890",
//     status: "Active",
//     activeJobs: 2,
//     totalHires: 8,
//     joinedDate: "Feb 2024",
//     logo: "FF"
//   },
//   {
//     id: 4,
//     name: "Creative Studios",
//     industry: "Marketing",
//     location: "Los Angeles, CA",
//     contactPerson: "Alex Chen",
//     email: "alex@creativestudios.com",
//     phone: "+1 (555) 321-0987",
//     status: "Inactive",
//     activeJobs: 0,
//     totalHires: 15,
//     joinedDate: "Dec 2023",
//     logo: "CS"
//   },
//   {
//     id: 5,
//     name: "RetailMax Group",
//     industry: "Retail",
//     location: "Seattle, WA",
//     contactPerson: "Lisa Thompson",
//     email: "lisa.t@retailmax.com",
//     phone: "+1 (555) 654-3210",
//     status: "Pending",
//     activeJobs: 1,
//     totalHires: 0,
//     joinedDate: "May 2024",
//     logo: "RM"
//   }
// ];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Inactive": return "bg-red-100 text-red-800";
    case "Pending": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const Clients = () => {
  // data + UI state
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // search + pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/client/getAllClient`)
      .then(({ data }) => {
        if (data.status) setClients(data.result);
        else throw new Error("API error");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/client/${id}`);
      toast.success("Client deleted");
      setClients((c) => c.filter((x) => x.id !== id));
      const maxPage = Math.ceil((clients.length - 1) / itemsPerPage);
      if (currentPage > maxPage) setCurrentPage(maxPage);
    } catch (err: any) {
      toast.error("Delete failed: " + err.message);
    }
  };

  // filter + page
  const filtered = clients.filter((c) =>
    [c.name, c.industry, c.city, c.state]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);
    useEffect(() => {
    fetchClients();
  }, []);
   const fetchClients = async () => {
    try {
      setIsLoading(true);
      
      const response = await   axios.get(`${API_BASE_URL}/client/getAllClient`);// Replace with your actual API URL
      setClients(response.data.result);
      console.log(response.data.result)
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Clients</h1>
            <p className="text-slate-600 mt-1">
              Manage your client relationships and track their hiring needs.
            </p>
          </div>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Client
          </Button>
        </div>

        <AddClientModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
        {selectedClient && (
          <EditClientModal
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            clientId={selectedClient.id}
          />
        )}

        {/* Search & Filters */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search clients..."
                  className="pl-10 bg-white/80"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
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

        {/* Loading / Error */}
        {loading && <p>Loading clients…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {/* Client List */}
        <div className="space-y-4">
          {pageItems.map((client) => (
            <Card
              key={client.id}
              className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                        {client.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-800">{client.name}</h3>
                        <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                      </div>
                      
                      <p className="text-slate-600 font-medium mb-3">{client.industry} </p>
                      
                      <h3 className="text-xl font-semibold text-slate-800">
                        {client.name}
                      </h3>
                      <p className="text-slate-600 font-medium mb-3">
                        {client.industry || "Industry not specified"}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{client.contact_person}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          {client.street1}{client.street2}{client.city}{client.state}{client.country}
                          {`${client.city}, ${client.state}`}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {client.website}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4 text-blue-500" />
                          <span className="text-slate-600">
                            Tags: {client.tags.join(", ")}
                          </span>
                        </div>
                        <span className="text-slate-500">
                          Joined on{" "}
                          {new Date(client.created_dt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white/80">
                      View Jobs
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
                          onClick={() => {
                            setSelectedClient(client);
                            setIsEditOpen(true);
                          }}
                        >
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Archive Client
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(client.id)}
                        >
                          Delete Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "outline" : "default"}
                  onClick={() => setCurrentPage(page)}
                  className={
                    page === currentPage
                      ? ""
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  }
                >
                  {page}
                </Button>
              );
            })}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Clients;
