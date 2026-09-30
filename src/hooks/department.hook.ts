import { useQuery } from "@tanstack/react-query";
import { getAllDepartments, getDepartmentById } from "@/api";

export function useGetAllDepartments() {
  return useQuery({
    queryKey: ["departments", "list"],
    queryFn: getAllDepartments,
  });
}

export function useGetDepartmentById(id: string) {
  return useQuery({
    queryKey: ["departments", "detail", id],
    queryFn: () => getDepartmentById(id),
    enabled: Boolean(id),
  });
}
