import type { EmployeeInfo, UserInfo } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type State = {
  userInfo: UserInfo | null;
  employeeInfo: EmployeeInfo | null;
};

const initialState: State = {
  userInfo: null,
  employeeInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    removeUserInfo: (state) => {
      state.userInfo = null;
    },
    setEmployeeInfo: (state, action: PayloadAction<EmployeeInfo>) => {
      state.employeeInfo = action.payload;
    },
    removeEmployeeInfo: (state) => {
      state.employeeInfo = null;
    },
  },
});

export const {
  setUserInfo,
  removeUserInfo,
  setEmployeeInfo,
  removeEmployeeInfo,
} = userSlice.actions;
export default userSlice.reducer;
