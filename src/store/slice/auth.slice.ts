import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { localStorageService } from "../../utils/localStorageService";

type AuthState = {
  token: string | null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: { token: localStorageService.getToken() } as AuthState,
  reducers: {
    loginRedux: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
      localStorageService.setToken(payload);
    },
    updateToken: (state, { payload }: PayloadAction<string | null>) => {
      if (!payload) {
        localStorageService.removeToken();
        state.token = null;
      } else {
        state.token = payload;
        localStorageService.setToken(payload);
      }
    },
    logoutRedux: (state) => {
      localStorageService.removeToken();
      localStorageService.removeAdminToken();
      state.token = null;
    },
  },
});

export default authSlice.reducer;

export const { loginRedux, updateToken, logoutRedux } = authSlice.actions;
