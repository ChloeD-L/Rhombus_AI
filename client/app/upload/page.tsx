"use client";

import DataTable from "@/components/DataTable";
import { useUserContext } from "@/context/UserContext";
import { UploadResponse, uploadChunk, uploadFile } from "@/utils/api";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

// Define chunk size for file uploads (5MB per chunk)
const CHUNK_SIZE = 5 * 1024 * 1024;
// Set file size threshold (10MB) to decide between single and chunked upload
const FILE_SIZE_THRESHOLD = 10 * 1024 * 1024;

export default function UploadPage() {
  // Access user token from context
  const { token, setToken } = useUserContext();

  // Define state for file, upload progress, uploaded data, and data types
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [dataTypes, setDataTypes] = useState<Record<string, string>>({});

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check if the file type is .csv or .xlsx
      const validTypes = [
        "text/csv", // MIME type for CSV files
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // MIME type for Excel files (.xlsx)
      ];

      // Check the file extension
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      const validExtensions = ["csv", "xlsx"];

      // Validate the file type
      if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension || "")) {
        alert("Invalid file type. Please upload a .csv or .xlsx file.");
        return;
      }

      // Optionally check the file size (limit to 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        alert("File is too large. Please upload a file smaller than 100MB.");
        return;
      }

      // Set the selected file if valid
      setFile(selectedFile);
    }
  };

  // Upload a single file
  const uploadSingleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log(token);
      const response: AxiosResponse<UploadResponse> = await uploadFile(formData, token, setProgress);
      console.log("upload", response.data.data);
      console.log("upload", response.data.data_types);
      alert("File uploaded successfully!");
      setUploadedData(response.data.data);
      setDataTypes(response.data.data_types);
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || "Upload failed"}`);
    }
  };

  // Upload a large file in chunks
  const uploadChunkedFile = async (file: File) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedChunks = 0;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("chunkIndex", String(i));
      formData.append("totalChunks", String(totalChunks));
      formData.append("fileName", file.name);

      try {
        await uploadChunk(formData, token, setProgress);
        uploadedChunks += 1;
        setProgress(Math.round((uploadedChunks / totalChunks) * 100));
      } catch (error: any) {
        alert(`Error: ${error.response?.data?.error || "Chunk upload failed"}`);
        return;
      }
    }

    alert("Chunked file upload completed successfully!");
  };

  // Handle file upload based on file size
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    // Use single upload for small files, chunked upload for larger files
    if (file.size <= FILE_SIZE_THRESHOLD) {
      await uploadSingleFile(file);
    } else {
      await uploadChunkedFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-10 py-16">
      <h1 className="text-2xl font-medium">Upload a file to begin</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      <progress value={progress} max={100} />

      {/* Display the uploaded data in a table if upload is successful */}
      {uploadedData.length > 0 && (
        <div className="w-full mt-10">
          <h2 className="text-xl font-semibold mb-4">Uploaded Data</h2>
          <DataTable data={uploadedData} dataTypes={dataTypes} />
        </div>
      )}
    </div>
  );
}
