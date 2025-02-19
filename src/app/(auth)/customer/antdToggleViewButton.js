"use client";

import { getPathSub1Key } from "@/src/lib/utils/pathUtils";
import { Button } from "antd";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";

export default function AntdToggleBatchViewButton() {
  const pathname = usePathname();
  const sub1Key = getPathSub1Key(pathname);

  const [isBatch, setIsBatch] = useState(!!sub1Key);

  const handleViewChange = () => {
    const newIsBatch = !isBatch;
    setIsBatch(newIsBatch);

    redirect(newIsBatch ? "/customer/batch" : "/customer");
  };

  return (
    <Button onClick={handleViewChange}>
      {`View ${isBatch ? "Customer" : "Batch"}`}
    </Button>
  );
}
