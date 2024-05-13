import { createSlice } from "@reduxjs/toolkit";
import { setEnabled } from "react-native/Libraries/Performance/Systrace";

const initialState = {
    loginInfo: {},
    userInfo: {},
    splashscreen: true,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.loginInfo = action.payload
        },
        setUser: (state, action) => {
            state.userInfo = action.payload
        },
        setSplashscreen: (state, action) => {
            state.splashscreen = action.payload
        }
    }
})

export const { setLogin, setUser, setPersonalInfo, setRegister, setSplashscreen } = userSlice.actions;
export default userSlice.reducer;