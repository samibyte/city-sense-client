"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetAllCategories, useGetAllServices } from "@/hooks";
import { PageHeader, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Clock,
  Tag,
  ArrowRight,
  Sparkles,
  DollarSign,
  Building2,
} from "lucide-react";

export default function ServicesCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const { data: catData } = useGetAllCategories();
  const { data: servData, isLoading } = useGetAllServices({ limit: 50 });

  const categories = catData?.data || [];
  const services = servData?.data || [];

  const filtered = services.filter((s) => {
    const matchesSearch =
      searchTerm === "" ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || s.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Municipal Services Catalog"
        description="Browse available city services, permits, utility requests, and maintenance programs."
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search catalog services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card/40 backdrop-blur-xs border-border/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === "ALL"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-border/40"
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-border/40"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/40 p-12 text-center text-sm text-muted-foreground bg-card/20 backdrop-blur-xs">
          Loading service catalog...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Try selecting another category or adjusting your search term."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-md transition-all hover:border-border/80 hover:bg-card/60 hover:shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                    <Tag className="size-3" />
                    <span>{service.category?.name || "General"}</span>
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
    </div>
  );
}
