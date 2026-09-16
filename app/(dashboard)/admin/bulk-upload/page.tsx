// *********************
// Role of the component: Bulk upload products page for admin dashboard
// Name of the component: BulkUpload.tsx
// Developer: Aleksandar Kuzmanovic (modified)
// Version: 1.0
// Component call: <BulkUpload />
// Input parameters: no input parameters
// Output: bulk upload page for admin dashboard
// *********************

"use client";
import { DashboardSidebar } from "@/components";
import BulkUploadHistory from "@/components/BulkUploadHistory";
import React, { useState, useRef } from "react";
import config from "@/lib/config";
import toast from "react-hot-toast";
import {
  FaFileUpload,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface UploadResult {
  success: boolean;
  message: string;
  details?: {
    processed: number;
    successful: number;
    failed: number;
    errors?: string[];
  };
}

const BulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "text/csv" ||
        droppedFile.name.endsWith(".csv")
      ) {
        setFile(droppedFile);
        setUploadResult(null);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${config.apiBaseUrl}/api/bulk-upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: data.message || "Products uploaded successfully!",
          details: data.details,
        });
        toast.success("Bulk upload completed!");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadResult({
          success: false,
          message: data.error || "Upload failed",
          details: data.details,
        });
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        message: "Network error occurred during upload",
      });
      toast.error("Network error occurred");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `title,price,manufacturer,inStock,mainImage,description,slug,categoryId
Sample Product,99.99,Sample Manufacturer,10,https://example.com/image.jpg,Sample description,sample-product,category-uuid
Another Product,149.99,Another Manufacturer,5,https://example.com/image2.jpg,Another description,another-product,category-uuid`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  return (
    <div className="bg-slate-950 min-h-screen flex justify-start items-start max-w-screen-2xl mx-auto xl:flex-row flex-col">
      <DashboardSidebar />
      <div className="w-full xl:p-10 p-4">
        <h1 className="text-2xl font-bold text-slate-100 mb-8">Bulk Upload Products</h1>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 mb-6">
          <h2 className="text-base font-semibold mb-2 text-blue-300">ðŸ“‹ Instructions</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-400/80">
            <li>Download the CSV template below</li>
            <li>Fill in your product data (title, price, manufacturer, stock, image URL, description, slug, categoryId)</li>
            <li>Upload the completed CSV file</li>
            <li>Maximum file size: 5MB</li>
          </ul>
        </div>

        {/* Download Template Button */}
        <div className="mb-6">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/20 transition-all duration-200 text-sm"
          >
            <FaDownload /> Download CSV Template
          </button>
        </div>

        {/* File Upload Area */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
              dragActive
                ? "border-cyan-500 bg-cyan-500/10"
                : "border-slate-700 bg-slate-900/40 hover:border-slate-600"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FaFileUpload className="text-5xl text-slate-600 mx-auto mb-4" />
            <p className="text-base mb-4 text-slate-300">
              {file ? (
                <span className="font-semibold text-cyan-400">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </span>
              ) : (
                <span className="text-slate-400">Drag and drop CSV file here, or click to select</span>
              )}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold rounded-xl cursor-pointer hover:bg-cyan-500/20 transition-all duration-200 text-sm"
            >
              Select CSV File
            </label>
          </div>
        </div>

        {/* Upload Button */}
        {file && (
          <div className="mb-6">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                uploading
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Products"
              )}
            </button>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className={`border rounded-xl p-5 mb-6 ${
            uploadResult.success
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-rose-500/10 border-rose-500/30"
          }`}>
            <div className="flex items-start gap-3">
              {uploadResult.success ? (
                <FaCheckCircle className="text-2xl text-emerald-400 flex-shrink-0 mt-1" />
              ) : (
                <FaTimesCircle className="text-2xl text-rose-400 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <h3 className={`text-base font-bold mb-1 ${
                  uploadResult.success ? "text-emerald-300" : "text-rose-300"
                }`}>
                  {uploadResult.success ? "âœ… Upload Successful!" : "âŒ Upload Failed"}
                </h3>
                <p className={`text-sm ${
                  uploadResult.success ? "text-emerald-400/80" : "text-rose-400/80"
                }`}>
                  {uploadResult.message}
                </p>

                {uploadResult.details && (
                  <div className="mt-4 bg-slate-800/60 rounded-xl p-4 space-y-3">
                    <p className="font-semibold text-slate-300 text-sm">Upload Statistics:</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">{uploadResult.details.processed}</p>
                        <p className="text-xs text-slate-400">Processed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-400">{uploadResult.details.successful}</p>
                        <p className="text-xs text-slate-400">Successful</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-rose-400">{uploadResult.details.failed}</p>
                        <p className="text-xs text-slate-400">Failed</p>
                      </div>
                    </div>

                    {uploadResult.details.errors && uploadResult.details.errors.length > 0 && (
                      <div className="mt-3">
                        <p className="font-semibold text-rose-400 text-sm mb-2">Errors:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs text-rose-400/80 max-h-40 overflow-y-auto">
                          {uploadResult.details.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CSV Format Guide */}
        <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-5">ðŸ“ CSV Format Guide</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Column</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Required</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {[
                  { col: "title", req: true, type: "String", desc: "Product name" },
                  { col: "price", req: true, type: "Number", desc: "Product price (e.g., 99.99)" },
                  { col: "manufacturer", req: true, type: "String", desc: "Manufacturer/Brand name" },
                  { col: "inStock", req: false, type: "Number", desc: "Stock quantity (default: 0)" },
                  { col: "mainImage", req: false, type: "URL", desc: "Product image URL" },
                  { col: "description", req: true, type: "String", desc: "Product description" },
                  { col: "slug", req: true, type: "String", desc: "URL-friendly identifier" },
                  { col: "categoryId", req: true, type: "UUID", desc: "Category ID from database" },
                ].map((row) => (
                  <tr key={row.col} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-cyan-400 text-xs">{row.col}</td>
                    <td className="px-4 py-3">
                      {row.req
                        ? <span className="text-xs font-semibold text-emerald-400">âœ… Yes</span>
                        : <span className="text-xs font-semibold text-slate-500">âŒ No</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{row.type}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload History */}
        <div className="mt-8">
          <BulkUploadHistory />
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;

