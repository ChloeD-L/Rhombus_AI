"use client";

import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

interface DataTableProps {
  data: Array<Record<string, any>>;
  dataTypes: Record<string, string>;
}

const DataTable: React.FC<DataTableProps> = ({ data, dataTypes }) => {
  const columns = Object.keys(dataTypes);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>
                {column} <span className="text-xs text-gray-500">({dataTypes[column]})</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column}>{row[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
