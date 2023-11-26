import axiosClient from "@/query/config/axios-config";

export function GET({ searchParams } : any) {
  return axiosClient.get(`/schematics`, { params: searchParams });
}
