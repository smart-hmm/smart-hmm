import type { UserInfo } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


type State = {
  userInfo: UserInfo | null
};

const initialState: State = {
    userInfo: null
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers: {
        setUserInfo:(state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload
        },
        removeUserInfo: (state) => {
            state.userInfo = null
        }
    }
})

export const { setUserInfo, removeUserInfo } = userSlice.actions
export default userSlice.reducer