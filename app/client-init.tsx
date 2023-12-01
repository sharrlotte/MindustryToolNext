"use client";

import { addRefreshInterceptor } from "@/query/config/axios-config";
import React, { useEffect } from "react";

export default function ClientInit() {
  useEffect(() => {
    addRefreshInterceptor();
  }, []);

  return undefined;
}
