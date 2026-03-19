import { setAuthToken, clearAuthToken } from "../lib/axios.js";
export const createAuthSlice = (set) => ({
  auth: {
    user: null,
    token: null,
  },
  setAuth: (user, token) => {
    setAuthToken(token);
    set((state) => {
      state.auth.user = user;
      state.auth.token = token;
    });
  },
  clearAuth: () => {
    clearAuthToken();
    set((state) => {
      state.auth.user = null;
      state.auth.token = null;
    });
  },
});
