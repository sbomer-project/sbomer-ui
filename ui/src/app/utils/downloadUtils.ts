/**
 * Downloads a file from a URL and saves it with a custom filename.
 *
 * @param url - The URL of the file to download
 * @param filename - The desired filename for the downloaded file
 */
export const downloadFileWithCustomName = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Fallback to opening in new tab if download fails
    window.open(url, '_blank');
  }
};
