"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";

type Obj = {
  [key: string]: any
}


export default function ReportsTable() {
  const [tableData, getReports] = useState<Array<Obj>>([]);
  const [offset, setOffset] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadData, setLoadData] = useState<boolean>(false);

  const getReportsData = async (offset: string) => {
    let offsetParam = "";
    if (offset) {
      offsetParam = `&offset=${offset}`;
    }
    setLoading(true);
    const res = await fetch(`/api/user-session/get-reports?pageSize=10${offsetParam}`, {
      method: 'GET',
    });
    const data = await res.json();
    setLoading(false);
    setLoadData(false);
    if (data && data?.records && data?.records?.length > 0) {
      if (tableData) {
        getReports([...tableData, ...data?.records]);
      } else {
        getReports(data?.records);
      }

      setOffset(data?.offset ? data?.offset : "");
    }

  }


  useEffect(() => {
    setLoadData(true);
    getReportsData("");
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Report Name

                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Session ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  
                Tech Type
                </TableCell>


                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Initial Budget

                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Total Allocated

                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                 Date Created

                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

              {!loadData ? tableData?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">

                    <div className="block font-medium text-gray-800 text-theme-sm dark:text-white/90"> {order?.fields?.["Report Name"]}</div>


                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order?.fields?.["Session ID"]?.map((report: string, index: number) => (
                      <React.Fragment key={index}>
                        <Badge
                          size="sm"
                          color="success"
                        >{report}</Badge>
                        <br />
                      </React.Fragment>
                    )) ?? <Badge
                      size="sm"
                      color="error"
                    >Not found</Badge>}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {order?.fields?.["Tech Type"] ?? <Badge
                      size="sm"
                      color="error"
                    >Not found</Badge>}
                    </div>
                  </TableCell>


                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    ${(order?.fields?.["Initial Budget"] ?? 0)?.toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    ${(order?.fields?.["Total Allocated"] ?? 0)?.toLocaleString("en-US")}

                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order?.fields?.["Date Created"] ?? <Badge
                      size="sm"
                      color="error"
                    >Not found</Badge>}
                  </TableCell>
                </TableRow>
              )) : <TableRow>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 text-theme-sm dark:text-gray-400"
                >
                  Loading...
                </td>
              </TableRow>}

            </TableBody>


          </Table>
          {offset &&
            <div className="flex items-center justify-center p-5">
              <button
                onClick={() => getReportsData(offset)}
                disabled={loading}
                className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
              >
                {loading ? "Loading..." : "Load More"}
              </button>


            </div>}
        </div>
      </div>
    </div>
  );
}
