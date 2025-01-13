"use client";

import { SUB_MENU_ADMIN } from "@/src/lib/constants";
import { getPathSub1Key } from "@/src/services/pathname";
import { Menu } from "antd";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const [activeItem, setActiveItem] = useState();

  const handleMenuItem = ({ key }) => {
    setActiveItem(key);
    redirect(`/admin/${key}`);
  };

  // To handle route changes that are not triggered by the tab bar
  useEffect(() => {
    const sub1Key = getPathSub1Key(pathname);
    setActiveItem(sub1Key);
  }, [pathname]);

  return (
    <section className="bg-neutral-100 px-6 rounded-xl min-h-[70vh] dark:bg-neutral-800">
      <Menu
        mode="horizontal"
        style={{ backgroundColor: "transparent" }}
        selectedKeys={[activeItem]}
        items={SUB_MENU_ADMIN}
        onClick={handleMenuItem}
      />

      <section className="py-6">{children}</section>
    </section>
  );
}
