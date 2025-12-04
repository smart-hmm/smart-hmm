import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

enum Locale  {
    VI = "vi",
    EN = "en",
}

type Display = {
    isOpenSideBar: boolean
    locale: Locale,
}

type State = {
    display: Display;
    
}

const initialState: State = {
    display: {
        isOpenSideBar: true,
        locale: Locale.EN,
    }
}

const appSlice = createSlice({
    name: "",
    initialState,
    reducers: {
        toggleSideBar: (state) => {
            state.display.isOpenSideBar = !state.display.isOpenSideBar
        },
        setLocale: (state, action: PayloadAction<{ locale: Locale }>) => {
            state.display.locale = action.payload.locale
        }
    }
})

export const { toggleSideBar, setLocale } = appSlice.actions
export default appSlice.reducer