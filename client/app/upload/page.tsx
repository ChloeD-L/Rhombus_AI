"use client";

import DataTable from "@/components/DataTable";
import { useUserContext } from "@/context/UserContext";
import { UploadResponse, uploadChunk, uploadFile } from "@/utils/api";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const CHUNK_SIZE = 5 * 1024 * 1024; // 每个块的大小为 5MB
const FILE_SIZE_THRESHOLD = 10 * 1024 * 1024; // 阈值为 10MB

export default function UploadPage() {
  const { token, setToken } = useUserContext();

  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [dataTypes, setDataTypes] = useState<Record<string, string>>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // 检查文件类型是否为 .csv 或 .xlsx
      const validTypes = [
        "text/csv", // MIME 类型：CSV 文件
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // MIME 类型：Excel 文件 (.xlsx)
      ];

      // 检查文件扩展名
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      const validExtensions = ["csv", "xlsx"];

      // 判断文件类型
      if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension || "")) {
        alert("Invalid file type. Please upload a .csv or .xlsx file.");
        return;
      }

      // 检查文件大小（可选），例如限制在 100MB 以内
      const maxSize = 100 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        alert("File is too large. Please upload a file smaller than 100MB.");
        return;
      }

      // 如果文件合法，则设置文件
      setFile(selectedFile);
    }
  };

  // Upload single file
  const uploadSingleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
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

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

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

      {/* 上传成功后显示表格 */}
      {uploadedData.length > 0 && (
        <div className="w-full mt-10">
          <h2 className="text-xl font-semibold mb-4">Uploaded Data</h2>
          <DataTable data={uploadedData} dataTypes={dataTypes} />
        </div>
      )}
    </div>
  );
}
