import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  createService,
  deleteCategory,
  deleteService,
  getAllCategories,
  getAllServices,
  getCategoryById,
  getServiceById,
  updateCategory,
  updateService,
} from "@/api";
import type {
  AllServiceParams,
  CreateCategoryPayload,
  CreateServiceRequestPayload,
} from "@/types";

const serviceKeys = {
  all: ["services"] as const,
  list: (params?: AllServiceParams) => ["services", "list", params] as const,
  detail: (id: string) => ["services", "detail", id] as const,
  categories: ["services", "categories"] as const,
  category: (id: string) => ["services", "categories", id] as const,
};

export function useGetAllServices(params?: AllServiceParams) {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => getAllServices(params),
  });
}

export function useGetServiceById(id: string) {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => getServiceById(id),
    enabled: Boolean(id),
  });
}

export function useGetAllCategories() {
  return useQuery({
    queryKey: serviceKeys.categories,
    queryFn: getAllCategories,
  });
}

export function useGetCategoryById(id: string) {
  return useQuery({
    queryKey: serviceKeys.category(id),
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id),
  });
}

function useInvalidateServices() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: serviceKeys.all });
}

export function useCreateService() {
  const invalidate = useInvalidateServices();

  return useMutation({
    mutationFn: (payload: CreateServiceRequestPayload) =>
      createService(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateService() {
  const invalidate = useInvalidateServices();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateServiceRequestPayload>;
    }) => updateService(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteService() {
  const invalidate = useInvalidateServices();

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: invalidate,
  });
}

export function useCreateCategory() {
  const invalidate = useInvalidateServices();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateServices();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCategoryPayload>;
    }) => updateCategory(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateServices();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: invalidate,
  });
}
