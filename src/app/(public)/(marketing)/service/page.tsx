"use client";

import {
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetAllCategories,
  useGetAllDepartments,
  useGetAllServices,
  useGetMe,
} from "@/hooks";
import { dashboardPathByRole } from "@/routes";

const PAGE_SIZE = 9;

type ServiceTypeFilter = "FREE" | "PAID" | "";
type QueryKey =
  | "search"
  | "categoryId"
  | "departmentId"
  | "serviceType"
  | "page";
type QueryUpdates = Partial<Record<QueryKey, string | null>>;

function PublicServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search")?.trim() ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const departmentId = searchParams.get("departmentId") ?? "";
  const rawServiceType = searchParams.get("serviceType") ?? "";
  const serviceType: ServiceTypeFilter =
    rawServiceType === "FREE" || rawServiceType === "PAID"
      ? rawServiceType
      : "";
  const pageParam = Number(searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const { data: categoriesResponse } = useGetAllCategories();
  const { data: departmentsResponse } = useGetAllDepartments();
  const { data: userResponse } = useGetMe();
  const {
    data: servicesResponse,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllServices({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    categoryId: categoryId || undefined,
    departmentId: departmentId || undefined,
    serviceType: serviceType || undefined,
  });

  const categories = categoriesResponse?.data ?? [];
  const departments = departmentsResponse?.data ?? [];
  const services = servicesResponse?.data ?? [];
  const meta = servicesResponse?.meta;
  const user = userResponse?.data;
  const categoryNames = new Map<string, string>(
    categories.map((category) => [category.id, category.name]),
  );
  const departmentNames = new Map<string, string>(
    departments.map((department) => [department.id, department.name]),
  );
  const hasFilters = Boolean(
    search || categoryId || departmentId || serviceType,
  );
  const isUpdating = isPending || (isFetching && !isLoading);
  const requestHref: (serviceId: string) => string =
    user?.role === "CITIZEN"
      ? (serviceId: string) => `/dashboard/requests/new?serviceId=${serviceId}`
      : user
        ? () => dashboardPathByRole[user.role]
        : () => "/auth";

  const updateQuery = (updates: QueryUpdates) => {
    const params = new URLSearchParams(searchParams.toString());
    const entries = Object.entries(updates) as [QueryKey, string | null][];

    for (const [key, value] of entries) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const goToPage = (nextPage: number) => {
    updateQuery({ page: nextPage > 1 ? String(nextPage) : null });
  };

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <main className="relative">
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold text-primary">
              City services
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-landing-ink text-balance sm:text-6xl">
              Find the right service.
              <span className="text-primary"> Get it moving.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-landing-muted sm:text-lg">
              Explore municipal services, understand what your city offers, and
              connect with the team that can help.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-6xl">
            <div className="landing-glass rounded-2xl border-landing-line p-4 sm:p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(15rem,1fr)_repeat(3,minmax(10rem,0.55fr))]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-landing-muted" />
                  <Input
                    aria-label="Search services"
                    placeholder="Search services..."
                    value={search}
                    onChange={(event) =>
                      updateQuery({
                        search: event.target.value || null,
                        page: null,
                      })
                    }
                    className="h-11 border-landing-line bg-landing-bg/60 pl-9 text-landing-ink placeholder:text-landing-muted"
                  />
                </div>
                <label className="sr-only" htmlFor="public-service-category">
                  Filter by category
                </label>
                <select
                  id="public-service-category"
                  value={categoryId}
                  onChange={(event) =>
                    updateQuery({
                      categoryId: event.target.value || null,
                      page: null,
                    })
                  }
                  className="h-11 min-w-0 rounded-lg border border-landing-line bg-landing-bg/60 px-3 text-sm text-landing-ink outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/50"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor="public-service-department">
                  Filter by department
                </label>
                <select
                  id="public-service-department"
                  value={departmentId}
                  onChange={(event) =>
                    updateQuery({
                      departmentId: event.target.value || null,
                      page: null,
                    })
                  }
                  className="h-11 min-w-0 rounded-lg border border-landing-line bg-landing-bg/60 px-3 text-sm text-landing-ink outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/50"
                >
                  <option value="">All departments</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor="public-service-price">
                  Filter by price
                </label>
                <select
                  id="public-service-price"
                  value={serviceType}
                  onChange={(event) =>
                    updateQuery({
                      serviceType: event.target.value || null,
                      page: null,
                    })
                  }
                  className="h-11 min-w-0 rounded-lg border border-landing-line bg-landing-bg/60 px-3 text-sm text-landing-ink outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/50"
                >
                  <option value="">All prices</option>
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-landing-line pt-4">
                <p className="text-sm text-landing-muted" aria-live="polite">
                  {meta
                    ? `Showing ${meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}–${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total} services`
                    : "Browse services available in your city"}
                  {isUpdating ? " · Updating results…" : ""}
                </p>
                {hasFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-landing-muted hover:text-landing-ink"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="landing-glass rounded-2xl border-landing-line px-6 py-16 text-center text-sm text-landing-muted">
              Loading city services…
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="landing-glass rounded-2xl border border-red-400/20 px-6 py-16 text-center"
            >
              <h2 className="font-display text-xl font-semibold text-landing-ink">
                Services couldn’t be loaded
              </h2>
              <p className="mt-2 text-sm text-landing-muted">
                {error instanceof Error
                  ? error.message
                  : "Please try again in a moment."}
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="landing-glass rounded-2xl border-landing-line px-6 py-16 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Search className="size-5" />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold text-landing-ink">
                {hasFilters
                  ? "No matching services"
                  : "No services available yet"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-landing-muted">
                {hasFilters
                  ? "Try another search or clear some filters to see more services."
                  : "Please check back later for services offered by your city."}
              </p>
              {hasFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-5 border-landing-line text-landing-ink"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <article
                    key={service.id}
                    className="landing-glass group flex min-h-64 flex-col rounded-2xl border-landing-line p-6 transition duration-200 hover:-translate-y-0.5 hover:border-landing-brand/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-landing-brand">
                        <Tag className="size-3.5 shrink-0" />
                        <span className="truncate">
                          {categoryNames.get(service.categoryId) ??
                            "City service"}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-foreground">
                        {service.isPaid ? `$${service.price}` : "Free"}
                      </span>
                    </div>

                    <h2 className="mt-5 font-display text-xl font-semibold text-landing-ink transition-colors group-hover:text-landing-brand">
                      {service.name}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-landing-muted">
                      {service.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-landing-line pt-4 text-xs text-landing-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="size-3.5" />
                        {departmentNames.get(service.departmentId) ??
                          "City department"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="size-3.5" />
                        {service.estimatedDuration
                          ? `~${service.estimatedDuration} hours`
                          : "Standard turnaround"}
                      </span>
                    </div>

                    <Button
                      render={<Link href={requestHref(service.id)} />}
                      className="mt-5 w-full justify-between bg-landing-brand text-landing-bg hover:bg-landing-brand/90"
                    >
                      <span>
                        {user?.role === "CITIZEN"
                          ? "Request this service"
                          : user
                            ? "Go to dashboard"
                            : "Sign in to request"}
                      </span>
                      {user?.role === "CITIZEN" ? (
                        <Check className="size-4" />
                      ) : (
                        <ArrowRight className="size-4" />
                      )}
                    </Button>
                  </article>
                ))}
              </div>

              {meta && meta.totalPages > 1 && (
                <nav
                  aria-label="Service catalog pages"
                  className="mt-10 flex items-center justify-center gap-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    disabled={page <= 1 || isUpdating}
                    onClick={() => goToPage(page - 1)}
                    className="border-landing-line text-landing-ink"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-landing-muted">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={page >= meta.totalPages || isUpdating}
                    onClick={() => goToPage(page + 1)}
                    className="border-landing-line text-landing-ink"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </nav>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default function PublicServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-background">
          <section className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8">
            <div className="landing-glass rounded-2xl border-landing-line px-6 py-16 text-center text-sm text-landing-muted">
              Loading city services…
            </div>
          </section>
        </div>
      }
    >
      <PublicServicesContent />
    </Suspense>
  );
}
