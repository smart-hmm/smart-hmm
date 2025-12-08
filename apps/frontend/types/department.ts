import { EmployeeInfo } from "./employee";

export type Department = {
  id: string;
  name: string;
  managerId?: string;
  manager?: EmployeeInfo;
  totalEmployees?: number;
  createdAt: string;
  updatedAt: string;
};
