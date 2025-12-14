import { TenantInfo } from "@/types/tenant";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type State = {
  tenants: TenantInfo[];
  selectedTenant: TenantInfo | null;
};

const initialState: State = {
  tenants: [],
  selectedTenant: null,
};

const tenantsSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {
    setTenants: (state, action: PayloadAction<{ tenants: TenantInfo[] }>) => {
      state.tenants = action.payload.tenants;
    },
    setSelectedTenant: (
      state,
      action: PayloadAction<{ tenant: TenantInfo | null }>
    ) => {
      state.selectedTenant = action.payload.tenant;
    },
  },
});

export const { setSelectedTenant, setTenants } = tenantsSlice.actions;
export default tenantsSlice.reducer;
