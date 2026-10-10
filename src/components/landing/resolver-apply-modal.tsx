"use client";

import {
  CheckCircle2,
  Loader2,
  UploadCloud,
  UserCheck,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApplyAsResolver, useGetAllDepartments } from "@/hooks";

interface ResolverApplyModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResolverApplyModal({
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: ResolverApplyModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const { data: departmentsResponse } = useGetAllDepartments();
  const departments = departmentsResponse?.data ?? [];

  const {
    mutate: applyMutation,
    isPending,
    isSuccess,
    reset,
  } = useApplyAsResolver();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    departmentId: "",
    city: "",
    area: "",
    bio: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.departmentId ||
      !form.city
    ) {
      setErrorMessage(
        "Please complete all required fields (Name, Email, Phone, Department, City).",
      );
      return;
    }

    if (!resumeFile) {
      setErrorMessage("Please upload your resume (PDF or DOC).");
      return;
    }

    applyMutation(
      {
        payload: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          departmentId: form.departmentId,
          city: form.city.trim(),
          area: form.area.trim() || undefined,
          bio: form.bio.trim() || undefined,
        },
        resume: resumeFile,
        additionalFiles:
          additionalFiles.length > 0 ? additionalFiles : undefined,
      },
      {
        onError: (err: any) => {
          setErrorMessage(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to submit application. Please try again.",
          );
        },
      },
    );
  };

  const handleClose = () => {
    setOpen(false);
    if (isSuccess) {
      reset();
      setForm({
        name: "",
        email: "",
        phone: "",
        departmentId: "",
        city: "",
        area: "",
        bio: "",
      });
      setResumeFile(null);
      setAdditionalFiles([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger as any} />}
      <DialogContent className="max-h-[90vh] overflow-y-auto border-landing-line bg-landing-bg-deep text-landing-ink sm:max-w-xl">
        <DialogHeader className="border-b border-landing-line pb-4">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Wrench className="size-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Field crew application
            </span>
          </div>
          <DialogTitle className="mt-2 text-xl font-bold tracking-tight text-landing-ink">
            Apply to work with your city
          </DialogTitle>
          <DialogDescription className="text-xs text-landing-muted">
            City Sense pairs approved field technicians and municipal
            contractors with auto-assigned work orders based on domain and city.
            Applications are reviewed by city staff.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
              <CheckCircle2 className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold text-landing-ink">
                Application Submitted
              </h3>
              <p className="mx-auto max-w-md text-xs leading-relaxed text-landing-muted">
                Your resume and credentials have been received and uploaded to
                our municipal vetting queue. Once an administrator approves your
                profile, your initial login credentials will be generated and
                emailed to{" "}
                <span className="text-emerald-300 font-mono">{form.email}</span>
                .
              </p>
            </div>
            <div className="pt-2">
              <Button
                onClick={handleClose}
                className="font-medium text-xs px-6"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 space-y-4 text-xs">
            {errorMessage && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="res-name"
                  className="text-landing-muted text-xs"
                >
                  Full Name *
                </Label>
                <Input
                  id="res-name"
                  required
                  placeholder="e.g. Karim Hossain"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-black/30 border-landing-line text-landing-ink placeholder:text-landing-faint text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="res-email"
                  className="text-landing-muted text-xs"
                >
                  Email Address *
                </Label>
                <Input
                  id="res-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-black/30 border-landing-line text-landing-ink placeholder:text-landing-faint text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="res-phone"
                  className="text-landing-muted text-xs"
                >
                  Phone Number *
                </Label>
                <Input
                  id="res-phone"
                  required
                  placeholder="+880 1700 000000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-black/30 border-landing-line text-landing-ink placeholder:text-landing-faint text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="res-dept"
                  className="text-landing-muted text-xs"
                >
                  Department Specialty *
                </Label>
                <select
                  id="res-dept"
                  required
                  value={form.departmentId}
                  onChange={(e) =>
                    setForm({ ...form, departmentId: e.target.value })
                  }
                  className="w-full rounded-md border border-landing-line bg-black/40 px-3 py-2 text-xs text-landing-ink focus:outline-none focus:ring-1 focus:ring-emerald-400 h-9"
                >
                  <option
                    value=""
                    disabled
                    className="bg-popover text-popover-foreground"
                  >
                    Select department
                  </option>
                  {departments.map((dept) => (
                    <option
                      key={dept.id}
                      value={dept.id}
                      className="bg-popover text-popover-foreground"
                    >
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="res-city"
                  className="text-landing-muted text-xs"
                >
                  Primary City *
                </Label>
                <Input
                  id="res-city"
                  required
                  placeholder="e.g. Dhaka"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="bg-black/30 border-landing-line text-landing-ink placeholder:text-landing-faint text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="res-area"
                  className="text-landing-muted text-xs"
                >
                  Preferred Zone / Area
                </Label>
                <Input
                  id="res-area"
                  placeholder="e.g. Mirpur, Gulshan, Dhanmondi"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="bg-black/30 border-landing-line text-landing-ink placeholder:text-landing-faint text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-bio" className="text-landing-muted text-xs">
                Professional Background / Certifications
              </Label>
              <Textarea
                id="res-bio"
                rows={2}
                placeholder="Mention any municipal trade licenses, certifications, or specialized field equipment..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="bg-black/30 border-landing-line text-landing-ink placeholder:text-landing-faint text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-landing-muted text-xs">
                Resume / CV (PDF or DOC) *
              </Label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-landing-line-strong bg-black/20 p-4 transition-colors hover:border-emerald-400/50 hover:bg-black/40">
                <UploadCloud className="size-6 text-emerald-400/80 mb-1" />
                <span className="text-xs font-medium text-landing-ink">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload Resume (Max 10MB)"}
                </span>
                <span className="text-[10px] text-landing-faint mt-0.5">
                  Securely stored on Cloudinary for administrative review
                </span>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setResumeFile(f);
                  }}
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <Label className="text-landing-muted text-xs">
                Supporting Certifications / Licenses (Optional)
              </Label>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                className="block w-full text-xs text-landing-faint file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-landing-ink hover:file:bg-white/15 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files) {
                    setAdditionalFiles(Array.from(e.target.files));
                  }
                }}
              />
              {additionalFiles.length > 0 && (
                <p className="text-[11px] text-emerald-300">
                  {additionalFiles.length} supporting file(s) attached
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-landing-line">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="border-landing-line bg-transparent text-landing-muted hover:text-landing-ink hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="gap-1.5 font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <UserCheck className="size-3.5" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
