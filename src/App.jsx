import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import RenderRouter from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComponent from "./components/Error";
import { localeConfig } from "./config/locale";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { init as initApm } from "@elastic/apm-rum";

const apm = initApm({
  serviceName: import.meta.env.VITE_APM_SERVICE_NAME,
  serverUrl: import.meta.env.VITE_APM_SERVER_URL,
  environment: import.meta.env.VITE_APM_ENVIRONMENT,
  breakdownMetrics: true,
});

const App = () => {
  const { lang } = useSelector(
    (state) => state.userInfos
  );

  const [locale, setLang] = useState("fr");
  const getLocale = () => {
    const lang = localeConfig.find((item) => {
      return item.key === locale.toLowerCase();
    });
    return lang?.messages;
  };

  useEffect(() => {
    setLang(lang);
  }, [lang]);
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <IntlProvider locale={locale} messages={getLocale()}>
        <BrowserRouter>
          <ToastContainer />
          <RenderRouter />
        </BrowserRouter>
      </IntlProvider>
    </ErrorBoundary>
  );
};

export default App;
