"use client";
import {
  CustomButton,
  DashboardProductTable,
  DashboardSidebar,
} from "@/components";
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="bg-slate-950 min-h-screen flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col max-xl:gap-y-4">
      <DashboardSidebar />
        <DashboardProductTable />
    </div>
  );
};

export default DashboardProducts;
