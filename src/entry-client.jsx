import App from "./App.jsx";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { getQueryClient } from "./lib/makeQueryClient.js";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";

const queryClient = getQueryClient();
const dehydratedState = window.__REACT_QUERY_STATE__;

async function initAuth() {
  try {
    const { getMe, refresh } = await import("./api/user.js");
    const { useStore } = await import("./store/store.js");
    const { setAuthToken } = await import("./lib/axios.js");

    // 1. refresh first to get a valid token
    const res = await refresh();
    const token = res.accessToken;

    // 2. set token so getMe request is authenticated
    await setAuthToken(token);

    // 3. now fetch the user
    const resUser = await getMe();
    const user = resUser.user;

    useStore.getState().setAuth(user, token);
  } catch (error) {}
}

initAuth().finally(() =>
  hydrateRoot(
    document.getElementById("root"),
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HydrationBoundary>
      </QueryClientProvider>
    </StrictMode>,
  ),
);
