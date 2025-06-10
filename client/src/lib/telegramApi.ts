import { apiRequest } from "./queryClient";

export interface RequestFormData {
  name: string;
  phone: string;
  comment?: string;
}

export async function submitRequest(data: RequestFormData): Promise<void> {
  await apiRequest("POST", "/api/requests", data);
}
