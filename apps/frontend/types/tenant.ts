export type CreateTenantProfilePayload = {
  name: string;
  slug: string;
  industry: string;
  companySize: "small" | "medium" | "large";
  country: string;
  timezone: string;
  currency: string;
};

export type TenantInfo = {
  id: string;
  name: string;
  workspaceSlug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
