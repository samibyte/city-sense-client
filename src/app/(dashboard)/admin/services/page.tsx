"use client";

import { useState } from "react";
import {
  useGetAllServices,
  useGetAllCategories,
  useGetAllDepartments,
  useCreateService,
  useDeleteService,
} from "@/hooks";
import { PageHeader, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Tag,
  Clock,
  Search,
  Building,
  DollarSign,
  X,
  Sparkles,
} from "lucide-react";

export default function AdminServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: servData, isLoading } = useGetAllServices({ limit: 100 });
  const { data: catData } = useGetAllCategories();
  const { data: deptData } = useGetAllDepartments();

  const { mutate: create, isPending: isCreating } = useCreateService();
  const { mutate: deleteServ, isPending: isDeleting } = useDeleteService();

  const services = servData?.data || [];
  const categories = catData?.data || [];
  const departments = (deptData?.data as any) || [];

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [estimatedDuration, setEstimatedDuration] = useState("24");
  const [isPaid, setIsPaid] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!departmentId || !categoryId) {
      setErrorMsg("Please select both a Department and a Category.");
      return;
    }

    create(
      {
        name,
        description,
        price: isPaid ? Number(price) : 0,
        estimatedDuration: Number(estimatedDuration) || undefined,
        isPaid,
        departmentId,
        categoryId,
      },
      {
        onSuccess: () => {
          setShowAddForm(false);
          setName("");
          setDescription("");
          setPrice("0");
          setIsPaid(false);
        },
        onError: (err: any) => {
          setErrorMsg(err?.message || "Failed to create service.");
        },
      },
    );
  };

  const handleDelete = (id: string, servName: string) => {
    if (confirm(`Are you sure you want to delete service "${servName}"?`)) {
      deleteServ(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Services Management"
        description="Configure public catalog offerings, fee structures, and turnaround SLAs."
      >
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="gap-1.5 shadow-xs"
        >
          {showAddForm ? <X className="size-4" /> : <Plus className="size-4" />}
          <span>{showAddForm ? "Cancel" : "Add Service"}</span>
        </Button>
      </PageHeader>

      {/* Add Service Collapsible Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-primary/30 bg-card/60 p-6 backdrop-blur-md space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Sparkles className="size-4 text-primary" />
            <span>Create New Catalog Service</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Service Name *
              </label>
              <Input
                placeholder="e.g. Hazardous Tree Trimming"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Estimated Duration (Hours)
              </label>
              <Input
                type="number"
                placeholder="24"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Department *
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-background/80 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">Select Department...</option>
                {departments.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-background/80 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">Select Category...</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Detailed Description *
              </label>
              <Textarea
                placeholder="Scope of work, standard requirements, and citizen instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPaidToggle"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="size-4 rounded accent-primary"
              />
              <label
                htmlFor="isPaidToggle"
                className="text-xs font-medium text-foreground cursor-pointer"
              >
                Requires Service Fee (Paid)
              </label>
            </div>

            {isPaid && (
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Fee Amount ($ USD)
                </label>
                <Input
                  type="number"
                  placeholder="25"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="1"
                  required={isPaid}
                />
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} className="gap-1.5">
              <span>{isCreating ? "Saving..." : "Create Service"}</span>
            </Button>
          </div>
        </form>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-card/40 backdrop-blur-xs border-border/40"
        />
      </div>

      {/* Services List */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/40 p-12 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
          Loading services...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No services in catalog"
          description="Click 'Add Service' above to configure new municipal services."
        />
      ) : (
        <div className="divide-y divide-border/30 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
          {filtered.map((serv) => (
            <div
              key={serv.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-muted/40 transition-colors"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground text-sm">
                    {serv.name}
                  </h4>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      serv.isPaid
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    {serv.isPaid ? `$${serv.price}` : "Free"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 max-w-xl">
                  {serv.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  {serv.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="size-3 text-primary" />
                      {serv.category.name}
                    </span>
                  )}
                  {serv.department && (
                    <span className="flex items-center gap-1">
                      <Building className="size-3 text-muted-foreground/70" />
                      {serv.department.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="size-3 text-muted-foreground/70" />
                    {serv.estimatedDuration
                      ? `${serv.estimatedDuration} hrs`
                      : "Standard SLA"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Button
                  onClick={() => handleDelete(serv.id, serv.name)}
                  disabled={isDeleting}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
