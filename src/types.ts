export interface FormData {
  name: string;
  email: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ApiResponse {
  success?: boolean;
  id?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface CheckEmailResponse {
  exists: boolean;
}
