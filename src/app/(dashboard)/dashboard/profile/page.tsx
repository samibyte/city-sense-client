"use client";

import { useState, useEffect } from "react";
import { useGetMe, useUpdateProfile } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Save,
  CheckCircle2,
  Camera,
} from "lucide-react";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: meData, isLoading } = useGetMe();
  const { mutate: update, isPending } = useUpdateProfile();

  const user = meData?.data;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    update(
      {
        name,
        phone,
        address: address || undefined,
        profileImage: profileImage || undefined,
      },
      {
        onSuccess: () => {
          setSuccessMessage("Profile updated successfully.");
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (err: any) => {
          setErrorMessage(err?.message || "Failed to update profile.");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <PageHeader
        title="Personal Profile"
        description="Manage your account information, contact preferences, and identity."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar & Identity Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md">
          <div className="relative group">
            <Avatar className="size-20 border-2 border-border/60 shadow-xs">
              <AvatarImage
                src={previewUrl || user?.profileUrl || undefined}
                alt={user?.name || "User"}
              />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera className="size-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl font-bold text-foreground">
                {user?.name}
              </h2>
              <StatusBadge status={user?.status || "ACTIVE"} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="size-3.5 text-primary" />
                {user?.role}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Joined{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Fields */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Email Address (Read-only)
              </label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted/40 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Phone Number
              </label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background/80"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Residential Address / Area
              </label>
              <Input
                placeholder="Neighborhood or Street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-background/80"
              />
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="gap-2 shadow-xs"
          >
            <Save className="size-4" />
            <span>{isPending ? "Saving Changes..." : "Save Changes"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
