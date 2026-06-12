// Auth
export interface User {
  id: string;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

// Employé — correspond exactement à la réponse des routes
// POST /api/declarations/employees/by-card-number/
// POST /api/declarations/employees/by-passport/
export interface EmployeeJob {
  slug: string;
  name: string;
  category: string;
  permit: string;
}

export interface EmployeeDocument {
  slug: string;
  type: string;
  name: string;
  file: string;
  expiry_date: string;
  is_expired: string;
  remaining_days: string;
  created_on: string;
  modified_on: string;
}

export interface Employee {
  slug: string;
  reference: string;
  declaration_number: string;
  declaration_slug: string;
  employee_slug: string;
  employee_reference: string;
  passport_number: string;
  card_number: string;
  first: string;
  last: string;
  sexe: string;
  sexe_display: string;
  birthday: string;
  birth_place: string;
  email: string;
  phone: string;
  address: string;
  residence: string;
  country: string;
  nationality: string;
  enrolled_at: string;
  picture: string;
  signature: string;
  job: EmployeeJob;
  type: string;
  type_display: string;
  status:
    | "processing"
    | "validated"
    | "rejected"
    | "printed"
    | "delivered"
    | string;
  status_display: string;
  contract_starts_at: string;
  contract_duration: number;
  company_name: string;
  company_sigle: string;
  company_address: string;
  card_issued_at: string;
  card_expires_at: string;
  submitted_at: string;
  validated_at: string;
  printed_at: string;
  delivered_at: string;
  printed_count: number;
  submitted_by: string;
  validated_by: string;
  documents: EmployeeDocument[];
  created_by: string;
  created_on: string;
  modified_on: string;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}
