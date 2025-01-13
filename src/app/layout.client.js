"use client";

import { ConfigProvider, theme } from "antd";
import { Suspense, useEffect, useState } from "react";

export default function RootLayoutClient({ children, roboto }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleThemeChange = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handleThemeChange);

    return () =>
      darkModeMediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#14b8a6", // teal-500
          colorInfo: "#14b8a6", // teal-500
          colorError: "#fc393c",
          wireframe: true,
          fontFamily: roboto,
        },
      }}
    >
      <Suspense>{children}</Suspense>
    </ConfigProvider>
  );
}
