import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InteractionsTable from "@/components/tables/Interactions";
import { Metadata } from "next";

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Interactions" />
      <div className="space-y-6">
          <InteractionsTable />
      </div>
    </div>
  );
}
