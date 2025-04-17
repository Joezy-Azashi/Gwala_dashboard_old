import React from "react";

// import { ReactComponent as ZhCnSvg } from "@/assets/header/zh_CN.svg";
// import { ReactComponent as EnUsSvg } from "@/assets/header/en_US.svg";

import en from "../locales/en";
import ar from "../locales/ar";
import fr from "../locales/fr";
export const localeConfig = [
  {
    name: "English",
    key: "en",
    messages: en,
    // icon: <EnUsSvg />,
  },
  {
    name: "Arabic",
    key: "ar",
    messages: ar,
    // icon: <ZhCnSvg />,
  },
  {
    name: "French",
    key: "fr",
    messages: fr,
    // icon: <EnUsSvg />,
  },
];
