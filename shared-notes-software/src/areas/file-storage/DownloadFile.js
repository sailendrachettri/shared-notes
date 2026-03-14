// DownloadFile.js — clean and simple, works for all sizes
import axios from "axios";
import { VIEW_UPLOADED_FILE_URL } from "../../config/env";

export const downloadFile = async (file, setDownloadState) => {
  try {
    setDownloadState({
      active: true,
      fileName: file.file_name,
      downloadedSize: 0,
      totalSize: 0,
      percentage: 0,
      status: "downloading",
    });

    const token = localStorage.getItem("accessToken");
    const url = `${VIEW_UPLOADED_FILE_URL}/${file?.file_path}`;

    console.log("Downloading:", url); // verify URL is correct

    const response = await axios.get(url, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent: undefined, // uses browser's own cert handling
      onDownloadProgress: (progressEvent) => {
        const totalSize = progressEvent.total ?? 0;
        const downloadedSize = progressEvent.loaded ?? 0;
        const percentage = totalSize
          ? Math.round((downloadedSize / totalSize) * 100)
          : 0;

        setDownloadState((prev) => ({
          ...prev,
          downloadedSize,
          totalSize,
          percentage,
        }));
      },
    });

    // Trigger browser download
    const blob = new Blob([response.data]);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = file.file_name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    setDownloadState((prev) => ({ ...prev, status: "done", percentage: 100 }));
    setTimeout(() => setDownloadState({ active: false }), 3000);

  } catch (error) {
    console.error("Download error:", error);
    setDownloadState((prev) => ({ ...prev, status: "error" }));
    setTimeout(() => setDownloadState({ active: false }), 3000);
  }
};