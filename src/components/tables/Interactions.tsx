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
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import { EyeIcon } from "@/icons";
import Button from "../ui/button/Button";

type Obj = {
  [key: string]: any
}


export default function InteractionsTable() {
  const [tableData, setInteractions] = useState<Array<Obj>>([]);
  const [offset, setOffset] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadData, setLoadData] = useState<boolean>(false);
  const [viewDetail, setViewDetail] = useState<Obj>({});
  const { isOpen, openModal, closeModal } = useModal();

  const getInteractions = async (offset: string) => {
    let offsetParam = "";
    if (offset) {
      offsetParam = `&pageToken=${offset}`;
    }
    setLoading(true);
    const res = await fetch(`/api/user-session/get-interactions?pageSize=10${offsetParam}`, {
      method: 'GET',
    });
    const { data, nextPageToken } = await res.json();
    setLoading(false);
    setLoadData(false);
 
    if (data && data?.length > 0) {
      if (tableData) {
        setInteractions([...tableData, ...data]);
      } else {
        setInteractions(data);
      }

    }
    setOffset(nextPageToken ? nextPageToken : "");

  }


  useEffect(() => {
    setLoadData(true);
    getInteractions("");
  }, []);


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]" >
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Interactions ID

                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Report Name 
                </TableCell>
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Item Name
                </TableCell>


                
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  User Notes
                </TableCell> */}
              <TableCell
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Interaction Status
                </TableCell>
                <TableCell
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Allocated Cost

                </TableCell>
                  <TableCell
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Date Created

                </TableCell>
                <TableCell
                  isHeader 
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Action

                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

              {!loadData ? tableData?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="block font-medium text-gray-800 text-theme-sm dark:text-white/90"> {order["Interaction ID"]}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {Array.isArray(order["Report Name"]) ? (
                    // It's an array
                    order["Report Name"].length > 0 ? (
                      order["Report Name"].map((report: string, index: number) => (
                        <React.Fragment key={index}>
                          <Badge size="sm" color="success">{report}</Badge>
                          <br />
                        </React.Fragment>
                      ))
                    ) : (
                      <Badge size="sm" color="error">Not found</Badge>
                    )
                  ) : typeof order["Report Name"] === "string" && order["Report Name"] ? (
                    // It's a string
                    <Badge size="sm" color="success">{order["Report Name"]}</Badge>
                  ) : (
                    <Badge size="sm" color="error">Not found</Badge>
                  )}
                  </TableCell>
                 
                   <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order["Interaction Status"]}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    ${(order["Allocated Cost"] ?? 0)?.toLocaleString("en-US")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                     {order["Date Created"] ?? <Badge
                      size="sm"
                      color="error"
                    >Not found</Badge>}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <button onClick={()=>{
                        setViewDetail(order)
                        openModal();
                      }} title="View Detail" className="shadow-theme-xs inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                   <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M2.96487 10.7925C2.73306 10.2899 2.73306 9.71023 2.96487 9.20764C4.28084 6.35442 7.15966 4.375 10.4993 4.375C13.8389 4.375 16.7178 6.35442 18.0337 9.20765C18.2655 9.71024 18.2655 10.2899 18.0337 10.7925C16.7178 13.6458 13.8389 15.6252 10.4993 15.6252C7.15966 15.6252 4.28084 13.6458 2.96487 10.7925Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M13.5202 10C13.5202 11.6684 12.1677 13.0208 10.4993 13.0208C8.83099 13.0208 7.47852 11.6684 7.47852 10C7.47852 8.33164 8.83099 6.97917 10.4993 6.97917C12.1677 6.97917 13.5202 8.33164 13.5202 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    </button>
                   
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
                onClick={() => getInteractions(offset)}
                disabled={loading}
                className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        
            <h4 className="mb-7 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Interaction ID: <span className="font-normal">{viewDetail["Interaction ID"]}</span>
            </h4>
           
          
          <div>
           <div className="mt-4">
              <div className="mb-2 text-md font-semibold text-gray-800 dark:text-white/90">
                Item Name
              </div>

              <div className="dark:bg-gray-900 flex flex-wrap gap-2 p-3 rounded-md  ">
                {viewDetail["Item Name"]?.map((item: any, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-green-100 dark:bg-success-500/15 dark:text-success-500 text-green-700  "
                  >
                    {item}
                  </span>
                )) ?? <Badge
                      size="sm"
                      color="error"
                    >Not found</Badge>}
              </div>
            </div>

            <div className="mt-4 dark:bg-gray-900 ">
              <div className="mb-2 text-md font-semibold text-gray-800 dark:text-white/90">
                User Notes
              </div>

              <div className="flex dark:bg-gray-900 text-gray-800 dark:text-white/90 flex-wrap gap-2  p-3 rounded-md ">
                {viewDetail["User Notes"] ?? <Badge
                      size="sm"
                      color="error"
                    >Not found</Badge>}
              </div>
            </div>
          </div>
           <div className="dark:bg-gray-900 flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
             
            </div>
          </div>
          </Modal>
    </div>
  );
}
