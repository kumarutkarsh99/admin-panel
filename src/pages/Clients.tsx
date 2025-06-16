import { useState, useEffect } from "react";
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
                      <h3 className="text-xl font-semibold text-slate-800">
                        {client.name}
                      </h3>
                      <p className="text-slate-600 font-medium mb-3">
                        {client.industry || "Industry not specified"}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="w-4 h-4" />
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
