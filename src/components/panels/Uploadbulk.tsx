import { useState, useMemo, FormEvent, ChangeEvent } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const API_BASE_URL = "http://51.20.181.155:3000";

export default function Uploadbulk() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const resetForm = () => {
    setSelectedFiles([]);
    setParsedRows([]);
    setFileError("");
    setProgress(0);
  };

  const headers = useMemo(() => {
    const allKeys = new Set<string>();
    parsedRows.forEach((row) => {
      Object.keys(row).forEach((key) => allKeys.add(key));
    });
    return Array.from(allKeys);
  }, [parsedRows]);

  const removeRow = (index: number) => {
    setParsedRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    let allRows: any[] = [];
    let filesProcessed = 0;

    files.forEach((file) => {
      const valid = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!valid.includes(file.type)) {
        return setFileError(`Unsupported type: ${file.name}`);
      }

      if (file.type === "text/csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            allRows = allRows.concat(res.data);
            filesProcessed++;
            if (filesProcessed === files.length) {
              setParsedRows(allRows);
            }
          },
        });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          allRows = allRows.concat(XLSX.utils.sheet_to_json(ws));
          filesProcessed++;
          if (filesProcessed === files.length) {
            setParsedRows(allRows);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!parsedRows.length) {
      setFileError("No data to upload");
      return;
    }
    setUploading(true);
    try {
      console.log(parsedRows);
      await axios.post(
        `${API_BASE_URL}/candidate/createCandidatesBulk`,
        parsedRows,
        {
          headers: { "Content-Type": "application/json" },
          onUploadProgress: (evt) => {
            setProgress(Math.round((evt.loaded / evt.total!) * 100));
          },
        }
      );
      toast.success("Upload successful");
      resetForm();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUploadSubmit}>
      <Input
        type="file"
        multiple
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        aria-label="Upload CSV or Excel file"
      />
      {fileError && <p className="text-red-500 mt-2">{fileError}</p>}

      {/* Preview warning */}
      {parsedRows.length > 0 && (
        <p className="text-sm italic text-gray-600 mt-4">
          ⚠️ These rows are only in preview. Click “Upload” to save.
        </p>
      )}

      {/* Data preview table */}
      {parsedRows.length > 0 && (
        <div className="max-h-96 overflow-auto mt-2">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold uppercase">
                  Remove
                </th>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-xs font-semibold uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parsedRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRow(i);
                      }}
                    >
                      ×
                    </Button>
                  </td>
                  {headers.map((key, j) => (
                    <td
                      key={`${i}-${j}`}
                      className="px-4 py-2 whitespace-nowrap text-sm"
                    >
                      {row[key] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Progress bar */}
      {uploading && (
        <progress
          value={progress}
          max={100}
          className="w-full mt-4"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      )}

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={uploading}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={uploading || !parsedRows.length}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {uploading ? `Uploading ${progress}%` : "Upload"}
        </Button>
      </div>
    </form>
  );
}
