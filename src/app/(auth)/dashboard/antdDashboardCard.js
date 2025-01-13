"use client";

import { Card } from "antd";
import { redirect } from "next/navigation";

export default function AntdDashboardCard({ item }) {
  return (
    <Card
      hoverable
      style={{ backgroundColor: "var(--primary)" }}
      className="w-[12.5rem] h-[6.25rem] flex items-center justify-center"
      onClick={() => redirect(item.url)}
    >
      <span className="font-semibold text-lg text-white">{item.label}</span>
    </Card>
  );
}
