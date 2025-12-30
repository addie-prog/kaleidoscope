import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SessionTable from "@/components/tables/Sessions";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sessions | The Kaleidoscope Project",
};
export default function BasicTables() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Sessions" />
      <div className="space-y-6">
          <SessionTable />
      </div>
    </div>
  );
}
