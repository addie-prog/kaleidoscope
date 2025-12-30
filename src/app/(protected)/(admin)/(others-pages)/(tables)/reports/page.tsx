import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ReportsTable from "@/components/tables/Reports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports | The Kaleidoscope Project",
};
export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Reports" />
      <div className="space-y-6">
          <ReportsTable />
      </div>
    </div>
  );
}
