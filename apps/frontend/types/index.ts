enum UserRole {
  ADMIN = "ADMIN",
  HR = "HR",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export type UserInfo = {
  id: string;
  email: string;
  role: UserRole;
  employeeID: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthInfo = {
  accessExpiresAt: string;
  accessToken: string;
};
