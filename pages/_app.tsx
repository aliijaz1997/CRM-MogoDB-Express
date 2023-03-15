import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../src/context/authContext";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Layout from "../src/components/Layout/MainLayout";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { CustomTheme } from "../src/utils/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={CustomTheme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </AuthProvider>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </Provider>
  );
}
