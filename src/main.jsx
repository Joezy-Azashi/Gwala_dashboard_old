import React, { Suspense, useMemo } from "react";
import ReactDOM from "react-dom/client";
import axios, { AxiosContext } from "./api/request";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { store } from "./store";
import Loading from "./pages/Loading";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      // suspense: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchInterval: false,
    },
  },
});
const AxiosProvider = ({ children }) => {
  const axiosValue = useMemo(() => {
    return axios;
  }, []);

  return (
    <AxiosContext.Provider value={axiosValue}>{children}</AxiosContext.Provider>
  );
};
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <AxiosProvider>
      <QueryClientProvider client={queryClient}>
        {/* <Suspense fallback={<Loading />}> */}
          <App />
        {/* </Suspense> */}
      </QueryClientProvider>
    </AxiosProvider>
  </Provider>
  // </React.StrictMode>
);
