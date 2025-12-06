export enum UserRole {
  ADMIN = "ADMIN",
  HR = "HR",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export type EmploymentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";

export type UserInfo = {
  id: string;
  email: string;
  role: UserRole;
  employeeID: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeInfo = {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  baseSalary: number;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
  departmentID: string | null;
  managerID: string | null;
  dateOfBirth?: string;
  departmentName?: string;
};

export type AuthInfo = {
  accessExpiresAt: string;
  accessToken: string;
};

export type Department = {
  id: string;
  name: string;
  managerId?: string;
  manager?: EmployeeInfo;
  totalEmployees?: number;
  createdAt: string;
  updatedAt: string;
};
