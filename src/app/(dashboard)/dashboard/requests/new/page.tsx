"use client";

import { ArrowLeft, Building, MapPin, Sparkles, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRequest, useGetAllCategories } from "@/hooks";

export default function NewRequestPage() {
  const router = useRouter();
  const { data: catData } = useGetAllCategories();
  const { mutate: submitRequest, isPending } = useCreateRequest();

  const categories = catData?.data || [];

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Metropolis");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!categoryId) {
      setErrorMsg("Please select a service category.");
      return;
    }
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Please provide both a title and description.");
      return;
    }
    if (!address.trim() || !area.trim() || !city.trim()) {
      setErrorMsg(
        "Please provide complete location details (address, area, city).",
      );
      return;
    }

    submitRequest(
      {
        type: "COMPLAINT",
        title,
        description,
        categoryId,
        location: {
          address,
          area,
          city,
        },
        attachments,
      },
      {
        onSuccess: (res: any) => {
          const newId = res?.data?.id;
          if (newId) {
            router.push(`/dashboard/my-requests/${newId}`);
          } else {
            router.push("/dashboard/my-requests");
          }
        },
        onError: (err: any) => {
          setErrorMsg(
            err?.message || "Failed to create request. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Button
          render={<Link href="/dashboard/my-requests" />}
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Requests</span>
        </Button>
      </div>

      <PageHeader
        title="Submit New Request"
        description="Report a public issue to your municipal team."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Category */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building className="size-4 text-primary" />
            <span>Category</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-border/60 bg-background/80 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            >
              <option value="">Select a Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Details */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Issue Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Subject / Title *
              </label>
              <Input
                placeholder="e.g., Broken streetlight on Elm street"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Detailed Description *
              </label>
              <Textarea
                placeholder="Describe the problem, severity, landmarks or any specific details helpful for the field team..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-background/80"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 3: Location */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <span>Incident Location</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Street Address / Landmark *
              </label>
              <Input
                placeholder="e.g., Corner of 4th Ave and Oak St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Area / District *
              </label>
              <Input
                placeholder="e.g., Downtown / Sector 4"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                City *
              </label>
              <Input
                placeholder="e.g., Metropolis"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 4: Evidence / Attachments */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Upload className="size-4 text-primary" />
            <span>Photos or Documents (Optional)</span>
          </h3>

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center hover:bg-muted/30 transition-colors">
            <Upload className="size-8 text-muted-foreground/60 mb-2" />
            <p className="text-xs text-muted-foreground">
              Upload photos of damage or supporting documents
            </p>
            <label className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 cursor-pointer transition-colors">
              <span>Choose Files</span>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-foreground"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
            {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            render={<Link href="/dashboard/my-requests" />}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="gap-2 shadow-xs"
          >
            <Sparkles className="size-4" />
            <span>{isPending ? "Submitting..." : "Submit Request"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
