import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Database } from "lucide-react";
import type { CSVPreview } from "@/types";

interface DataPreviewProps {
  preview: CSVPreview;
  fileName?: string;
}

export function DataPreview({ preview, fileName }: DataPreviewProps) {
  const { headers, rows, totalRows } = preview;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Data Preview
            </CardTitle>
            <CardDescription>
              Showing first {rows.length} rows of {totalRows.toLocaleString()}{" "}
              total rows
            </CardDescription>
          </div>
          {fileName && (
            <Badge variant="secondary" className="text-xs">
              {fileName}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">{headers.length}</span>
              <span className="text-muted-foreground"> columns</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              <span className="font-medium">{totalRows.toLocaleString()}</span>
              <span className="text-muted-foreground"> rows</span>
            </span>
          </div>
        </div>

        {/* Table Container with horizontal scroll */}
        <div className="relative rounded-md border overflow-hidden">
          <div className="overflow-x-auto max-h-[400px]">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
                <TableRow>
                  <TableHead className="w-12 text-center font-bold">
                    #
                  </TableHead>
                  {headers.map((header, index) => (
                    <TableHead
                      key={index}
                      className="min-w-[120px] font-semibold text-foreground"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="truncate max-w-[150px]" title={header}>
                          {header}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                          Col {index + 1}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-muted/50">
                    <TableCell className="text-center text-muted-foreground font-mono text-sm">
                      {rowIndex + 1}
                    </TableCell>
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className="font-mono text-sm"
                        title={cell}
                      >
                        <span className="truncate block max-w-[150px]">
                          {cell || (
                            <span className="text-muted-foreground italic">
                              -
                            </span>
                          )}
                        </span>
                      </TableCell>
                    ))}
                    {/* Fill empty cells if row has fewer columns than headers */}
                    {row.length < headers.length &&
                      Array.from({ length: headers.length - row.length }).map(
                        (_, i) => (
                          <TableCell
                            key={`empty-${i}`}
                            className="text-muted-foreground italic"
                          >
                            -
                          </TableCell>
                        ),
                      )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Scroll horizontally to view all columns • Showing preview only
        </p>
      </CardContent>
    </Card>
  );
}

export default DataPreview;
