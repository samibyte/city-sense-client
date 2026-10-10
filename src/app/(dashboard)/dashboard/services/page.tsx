"use client";

import {
  ArrowRight,
  Building,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Search,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState, PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetAllCategories,
  useGetAllDepartments,
  useGetAllServices,
} from "@/hooks";
import useDebounce from "@/hooks/debounce.hook";

const PAGE_SIZE = 12;

export default function ServicesCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm.trim(), 350);

  const { data: catData } = useGetAllCategories();
  const { data: deptData } = useGetAllDepartments();
  const {
    data: servData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllServices({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    categoryId: selectedCategory || undefined,
    departmentId: selectedDepartment || undefined,
    serviceType:
      selectedServiceType === "FREE" || selectedServiceType === "PAID"
        ? selectedServiceType
        : undefined,
  });

  const categories = catData?.data || [];
  const services = servData?.data || [];
  const departments = deptData?.data || [];
  const meta = servData?.meta;
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  );
  const departmentNames = new Map(
    departments.map((department) => [department.id, department.name]),
  );
  const hasFilters =
    searchTerm.length > 0 ||
    selectedCategory.length > 0 ||
    selectedDepartment.length > 0 ||
    selectedServiceType.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Municipal Services Catalog"
        description="Browse available city services, permits, utility requests, and maintenance programs."
      />

      {/* Filter & Search Bar */}
      <div className="space-y-3 rounded-2xl border border-border/40 bg-card/30 p-4 backdrop-blur-xs">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search catalog services..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              aria-label="Search services"
              className="pl-9 bg-card/40 backdrop-blur-xs border-border/40"
            />
          </div>
          <label className="sr-only" htmlFor="service-category-filter">
            Filter by category
          </label>
          <select
            id="service-category-filter"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border/60 bg-background/80 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="service-department-filter">
            Filter by department
          </label>
          <select
            id="service-department-filter"
            value={selectedDepartment}
            onChange={(event) => {
              setSelectedDepartment(event.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border/60 bg-background/80 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="service-type-filter">
            Filter by price
          </label>
          <select
            id="service-type-filter"
            value={selectedServiceType}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedServiceType(
                value === "FREE" || value === "PAID" ? value : "",
              );
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border/60 bg-background/80 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All prices</option>
            <option value="FREE">Free</option>
            <option value="PAID">Paid</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {meta
              ? `Showing ${meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}–${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total} services`
              : "Browse the available city services"}
            {isFetching && !isLoading ? " · Updating…" : ""}
          </span>
          {hasFilters && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedDepartment("");
                setSelectedServiceType("");
                setPage(1);
              }}
            >
              <RotateCcw className="size-3.5" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/40 p-12 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
          Loading service catalog...
        </div>
      ) : isError ? (
        <EmptyState
          title="Unable to load services"
          description={
            error instanceof Error
              ? error.message
              : "Please try again in a moment."
          }
        />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services found"
          description={
            hasFilters
              ? "Try changing your search or filters to find available services."
              : "There are no services available right now."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-border/80 hover:bg-card/60 hover:shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                    <Tag className="size-3" />
                    <span>
                      {categoryNames.get(service.categoryId) || "General"}
                    </span>
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      service.isPaid
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    {service.isPaid ? `$${service.price}` : "Free"}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {service.name}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>
                    {service.estimatedDuration
                      ? `~${service.estimatedDuration} hrs`
                      : "Standard SLA"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="size-3.5" />
                  <span>
                    {departmentNames.get(service.departmentId) ||
                      "City department"}
                  </span>
                </div>

                <Button
                  render={
                    <Link
                      href={`/dashboard/requests/new?serviceId=${service.id}`}
                    />
                  }
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1 text-primary hover:bg-primary/10 hover:text-primary -mr-2"
                >
                  <span>Request</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && !isError && meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages || isFetching}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
