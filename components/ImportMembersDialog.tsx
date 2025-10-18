import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface ImportMembersDialogProps {
  onImportComplete?: (members: any[]) => void;
}

export function ImportMembersDialog({
  onImportComplete,
}: ImportMembersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importStep, setImportStep] = useState<"upload" | "preview" | "result">(
    "upload"
  );
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  }>({
    success: 0,
    failed: 0,
    errors: [],
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith(".csv") &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      toast.error("Invalid file type", {
        description: "Please upload an Excel (.xlsx, .xls) or CSV file",
      });
      return;
    }

    setImportFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setImportData(jsonData);
        setImportPreview(jsonData.slice(0, 5)); // Show first 5 rows as preview
        setImportStep("preview");
      } catch (error) {
        toast.error("Error reading file", {
          description: "Could not parse the file. Please check the format.",
        });
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleImportMembers = () => {
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];
    const validMembers: any[] = [];

    importData.forEach((row: any, index: number) => {
      try {
        // Validate required fields
        if (!row.name || !row.email || !row.phone) {
          errors.push(
            `Row ${index + 2}: Missing required fields (name, email, or phone)`
          );
          failedCount++;
          return;
        }

        // Calculate end date if startDate is provided
        let calculatedEndDate = row.endDate || "";
        if (row.startDate && !row.endDate) {
          const startDate = new Date(row.startDate);
          const planType = (row.planType || "Monthly Basic").toLowerCase();
          if (planType.includes("monthly")) {
            startDate.setMonth(startDate.getMonth() + 1);
          } else if (planType.includes("annual")) {
            startDate.setFullYear(startDate.getFullYear() + 1);
          }
          calculatedEndDate = startDate.toISOString().split("T")[0];
        }

        // Add the member to valid members list
        validMembers.push({
          id: `imported-${Date.now()}-${index}`,
          name: row.name,
          email: row.email,
          phone: row.phone,
          planType: row.planType || "Monthly Basic",
          startDate: row.startDate || new Date().toISOString().split("T")[0],
          endDate:
            calculatedEndDate ||
            new Date(new Date().setMonth(new Date().getMonth() + 1))
              .toISOString()
              .split("T")[0],
          status: (row.status?.toLowerCase() === "active"
            ? "active"
            : row.status?.toLowerCase() === "expired"
            ? "expired"
            : "pending") as "active" | "expired" | "pending",
          amount: Number(row.amount) || 0,
          address: row.address || "",
          emergencyContact: row.emergencyContact || "",
          joinDate:
            row.joinDate ||
            row.startDate ||
            new Date().toISOString().split("T")[0],
          lastPayment:
            row.lastPayment ||
            row.startDate ||
            new Date().toISOString().split("T")[0],
          nextBilling:
            row.nextBilling ||
            calculatedEndDate ||
            new Date(new Date().setMonth(new Date().getMonth() + 1))
              .toISOString()
              .split("T")[0],
          dob: row.dob || "",
          gender: row.gender || "",
          weight: row.weight || "",
          height: row.height || "",
          batch: row.batch || "",
          notes: row.notes || "",
        });

        successCount++;
      } catch (error) {
        errors.push(
          `Row ${index + 2}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        failedCount++;
      }
    });

    setImportResults({ success: successCount, failed: failedCount, errors });
    setImportStep("result");

    // Call the callback with valid members
    if (onImportComplete && validMembers.length > 0) {
      onImportComplete(validMembers);
    }

    toast.success(`Import completed`, {
      description: `${successCount} members imported successfully${
        failedCount > 0 ? `, ${failedCount} failed` : ""
      }`,
    });
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        planType: "Monthly Basic",
        startDate: "2024-01-01",
        endDate: "2024-02-01",
        status: "active",
        amount: 1000,
        address: "123 Main St",
        emergencyContact: "+1234567891",
        dob: "1990-01-01",
        gender: "Male",
        weight: "75",
        height: "180",
        batch: "Morning",
        notes: "Sample member data",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members Template");
    XLSX.writeFile(wb, "gym_members_template.xlsx");

    toast.success("Template downloaded", {
      description: "Use this template to format your member data",
    });
  };

  const resetImport = () => {
    setImportFile(null);
    setImportData([]);
    setImportPreview([]);
    setImportStep("upload");
    setImportResults({ success: 0, failed: 0, errors: [] });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetImport();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 sm:flex-none border-neon-green/50 hover:bg-neon-green/10"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Import</span>
          <span className="sm:hidden">Import</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Members from Excel/CSV</DialogTitle>
          <DialogDescription>
            Upload a spreadsheet file to bulk import members
          </DialogDescription>
        </DialogHeader>

        {importStep === "upload" && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Supported formats: .xlsx, .xls, .csv
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            </div>

            <div className="border-2 border-dashed border-border hover:border-neon-green/50 rounded-lg p-12 text-center transition-colors">
              <input
                type="file"
                id="file-upload"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FileSpreadsheet className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-sm">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Excel (.xlsx, .xls) or CSV files
                  </p>
                </div>
              </label>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm">Required columns:</p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• name - Member's full name</li>
                <li>• email - Email address</li>
                <li>• phone - Phone number</li>
              </ul>
              <p className="text-sm mt-3">Optional columns:</p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• planType, startDate, endDate, status, amount, address</li>
                <li>
                  • emergencyContact, dob, gender, weight, height, batch, notes
                </li>
              </ul>
            </div>
          </div>
        )}

        {importStep === "preview" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">
                  Found{" "}
                  <span className="text-neon-green">{importData.length}</span>{" "}
                  members in the file
                </p>
                <p className="text-xs text-muted-foreground">
                  Preview of first 5 rows
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportStep("upload")}
              >
                Change File
              </Button>
            </div>

            <div className="border rounded-lg overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Plan Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importPreview.map((row: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{row.name || "-"}</TableCell>
                      <TableCell>{row.email || "-"}</TableCell>
                      <TableCell>{row.phone || "-"}</TableCell>
                      <TableCell>{row.planType || "-"}</TableCell>
                      <TableCell>{row.status || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {importData.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">
                ... and {importData.length - 5} more rows
              </p>
            )}
          </div>
        )}

        {importStep === "result" && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-neon-green/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-neon-green" />
                    <CardTitle className="text-lg">Success</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-neon-green">
                    {importResults.success}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Members imported
                  </p>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <CardTitle className="text-lg">Failed</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-destructive">
                    {importResults.failed}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rows with errors
                  </p>
                </CardContent>
              </Card>
            </div>

            {importResults.errors.length > 0 && (
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-sm mb-2">Errors:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {importResults.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {importStep === "upload" && (
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          )}

          {importStep === "preview" && (
            <>
              <Button variant="outline" onClick={() => setImportStep("upload")}>
                Back
              </Button>
              <Button
                onClick={handleImportMembers}
                className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
              >
                Import {importData.length} Members
              </Button>
            </>
          )}

          {importStep === "result" && (
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
