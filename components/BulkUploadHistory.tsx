"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";

import apiClient from "@/lib/api";

interface BatchHistory {
  id: string;
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  errors?: string[];
}

const BulkUploadHistory = () => {
  const [batches, setBatches] = useState<BatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingBatchId, setDeletingBatchId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<{
    id: string;
    fileName: string;
  } | null>(null);
  const [deleteProducts, setDeleteProducts] = useState(false);

  useEffect(() => {
    fetchBatchHistory();
  }, []);

  const fetchBatchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/bulk-upload");

      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
      } else {
        setError("Failed to load batch history");
      }
    } catch (err) {
      console.error("Error fetching batch history:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (batchId: string, fileName: string) => {
    setBatchToDelete({ id: batchId, fileName });
    setDeleteProducts(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!batchToDelete) return;

    setDeletingBatchId(batchToDelete.id);
    setShowDeleteModal(false);

    try {
      const response = await apiClient.delete(
        `/api/bulk-upload/${batchToDelete.id}?deleteProducts=${deleteProducts}`
      );

      let data = null;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error("Failed to parse JSON:", text);
          }
        }
      }

      if (response.ok) {
        toast.success(
          deleteProducts
            ? "Batch and products deleted successfully!"
            : "Batch deleted successfully (products kept)"
        );
        await fetchBatchHistory();
      } else {
        toast.error(
          data?.error || `Failed to delete batch (${response.status})`
        );
      }
    } catch (err) {
      console.error("Error deleting batch:", err);
      toast.error("Network error occurred");
    } finally {
      setDeletingBatchId(null);
      setBatchToDelete(null);
      setDeleteProducts(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBatchToDelete(null);
    setDeleteProducts(false);
  };

  const getStatusIcon = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "COMPLETED":
        return <FaCheckCircle className="text-emerald-400 text-xl" />;
      case "FAILED":
        return <FaTimesCircle className="text-rose-400 text-xl" />;
      case "PARTIAL":
        return <FaExclamationTriangle className="text-amber-400 text-xl" />;
      case "PENDING":
        return <FaClock className="text-cyan-400 text-xl" />;
      default:
        return <FaFileAlt className="text-slate-400 text-xl" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-400 text-sm">
        {error}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <FaFileAlt className="text-4xl mx-auto mb-2 text-slate-600" />
        <p>No upload history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
        📜 Upload History
      </h2>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && batchToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-amber-400 text-2xl" />
              <h3 className="text-lg font-bold text-slate-100">Delete Batch Upload</h3>
            </div>

            <p className="text-slate-300 text-sm">
              Are you sure you want to delete{" "}
              <strong className="text-slate-100">{batchToDelete.fileName}</strong>?
            </p>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteProducts}
                  onChange={(e) => setDeleteProducts(e.target.checked)}
                  className="mt-1 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30"
                />
                <div className="text-xs">
                  <span className="font-semibold text-amber-300">
                    Also delete all products created from this batch
                  </span>
                  <p className="text-amber-400/80 mt-1">
                    Warning: Permanently removes all products created from this CSV upload (unless in active orders).
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors text-sm font-medium border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 rounded-xl transition-colors text-sm font-bold shadow-lg shadow-rose-500/20"
              >
                {deleteProducts
                  ? "Delete Batch & Products"
                  : "Delete Batch Only"}
              </button>
            </div>
          </div>
        </div>
      )}

      {batches.map((batch) => (
        <div
          key={batch.id}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:border-slate-700 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(batch.status)}
              <div>
                <h3 className="font-semibold text-slate-100 text-base">{batch.fileName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uploaded by {batch.uploadedBy} •{" "}
                  {formatDate(batch.uploadedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  batch.status === "COMPLETED"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : batch.status === "FAILED"
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : batch.status === "PARTIAL"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                {batch.status}
              </span>
              <button
                onClick={() => handleDeleteClick(batch.id, batch.fileName)}
                disabled={deletingBatchId === batch.id}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors disabled:opacity-50"
                title="Delete batch"
              >
                {deletingBatchId === batch.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-400"></div>
                ) : (
                  <FaTrash className="text-sm" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-slate-200">
                {batch.totalRecords}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Total</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-emerald-400">
                {batch.successfulRecords}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Success</p>
            </div>
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-rose-400">
                {batch.failedRecords}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Failed</p>
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-cyan-400">
                {batch.totalRecords > 0
                  ? Math.round(
                      (batch.successfulRecords / batch.totalRecords) * 100
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Success Rate</p>
            </div>
          </div>

          {batch.errors && batch.errors.length > 0 && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
              <p className="font-semibold text-rose-400 text-xs mb-2">
                Errors ({batch.errors.length}):
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-rose-300 max-h-24 overflow-y-auto">
                {batch.errors.slice(0, 5).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {batch.errors.length > 5 && (
                  <li className="text-rose-400 font-semibold">
                    ... and {batch.errors.length - 5} more errors
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BulkUploadHistory;
