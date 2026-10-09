"use client";

import { useState } from "react";
import {
  useGetAllCategories,
  useGetAllDepartments,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks";
import { PageHeader, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Tag, Building, X, Sparkles } from "lucide-react";

export default function AdminCategoriesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: catData, isLoading } = useGetAllCategories();
  const { data: deptData } = useGetAllDepartments();

  const { mutate: create, isPending: isCreating } = useCreateCategory();
  const { mutate: deleteCat, isPending: isDeleting } = useDeleteCategory();

  const categories = catData?.data || [];
  const departments = (deptData?.data as any) || [];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!departmentId) {
      setErrorMsg("Please select an associated department.");
      return;
    }

    create(
      {
        name,
        description,
        departmentId,
      },
      {
        onSuccess: () => {
          setShowAddForm(false);
          setName("");
          setDescription("");
        },
        onError: (err: any) => {
          setErrorMsg(err?.message || "Failed to create category.");
        },
      },
    );
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      deleteCat(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Category Classification"
        description="Organize issues and civic services by municipal operational categories."
      >
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="gap-1.5 shadow-xs"
        >
          {showAddForm ? <X className="size-4" /> : <Plus className="size-4" />}
          <span>{showAddForm ? "Cancel" : "Add Category"}</span>
        </Button>
      </PageHeader>

      {/* Add Category Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-primary/30 bg-card/60 p-6 backdrop-blur-md space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Sparkles className="size-4 text-primary" />
            <span>Create New Category</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Category Name *
              </label>
              <Input
                placeholder="e.g. Sanitation & Waste Management"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Responsible Department *
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

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Category Description *
              </label>
              <Textarea
                placeholder="Scope and standard issues covered under this department category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
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
              <span>{isCreating ? "Saving..." : "Create Category"}</span>
            </Button>
          </div>
        </form>
      )}

      {/* Categories List */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/40 p-12 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories defined"
          description="Click 'Add Category' above to create categories."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-md hover:border-border/80 hover:bg-card/60 transition-all shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Tag className="size-4" />
                  </span>
                  <Button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={isDeleting}
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <h4 className="font-semibold text-foreground text-sm">
                  {cat.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {cat.description}
                </p>
              </div>

              {departments.find((d: any) => d.id === cat.departmentId) && (
                <div className="pt-4 mt-3 border-t border-border/30 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building className="size-3 text-muted-foreground/70" />
                  <span>
                    {
                      departments.find((d: any) => d.id === cat.departmentId)
                        ?.name
                    }
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
