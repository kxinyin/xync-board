"use client";

import { Breadcrumb, Button, Menu } from "antd";
import { MENU_ITEMS } from "@/src/lib/constants";
import { LogoutOutlined } from "@ant-design/icons";
import { redirect, usePathname } from "next/navigation";
import { logout } from "@/src/auth/helpers";
import { useEffect, useState } from "react";
import { getPathParentKey, splitPathname } from "@/src/services/pathname";

export default function AuthLayout({ children }) {
  const pathname = usePathname();

  const [activeItem, setActiveItem] = useState("");
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const handleBreadcrumbs = (keyPath) => {
    setBreadcrumbItems(
      keyPath.map((item) => {
        return { title: item.charAt(0).toUpperCase() + item.slice(1) };
      })
    );
  };

  const handleMenuItem = ({ key, keyPath }) => {
    setActiveItem(key);

    const reversedPath = keyPath.reverse();

    handleBreadcrumbs(reversedPath);
    redirect("/" + reversedPath.join("/"));
  };

  const handleLogout = async () => await logout();

  // To handle route changes that are not triggered by the header
  useEffect(() => {
    const parentKey = getPathParentKey(pathname);
    const splitPath = splitPathname(pathname);

    setActiveItem(parentKey);
    handleBreadcrumbs(splitPath);
  }, [pathname]);

  return (
    <>
      <header
        className="h-15 leading-[3.75rem] flex items-center gap-4 px-6 border-b-[0.03125rem] border-[#e5e7eb]/50
                   lg:px-8
                   dark:border-[#e5e7eb]/20"
      >
        {/* // TODO: Import logo */}
        <div className="w-12 h-12 border-2 border-neutral-200" />

        <Menu
          mode="horizontal"
          style={{ lineHeight: "inherit", border: "none" }}
          className="flex-1 min-w-0"
          selectedKeys={[activeItem]}
          items={MENU_ITEMS}
          onClick={handleMenuItem}
        />

        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </header>

      {/* calc(view height - header(60px) - footer(69px) ) */}
      <main className="min-h-[calc(100vh-3.75rem-4.3125rem)] py-6 px-8 lg:px-10">
        <Breadcrumb
          items={breadcrumbItems}
          style={{
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
            padding: "0 32px 24px",
          }}
          className="font-semibold"
        ></Breadcrumb>

        <section>{children}</section>
      </main>

      <footer className="px-[3.125rem] py-6 text-sm text-center opacity-60 border-t-[0.03125rem] border-[#e5e7eb]/50">
        &copy; {new Date().getFullYear()} Xync Board. All Rights Reserved.
      </footer>
    </>
  );
}
