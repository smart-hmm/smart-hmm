export type EmploymentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";

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
