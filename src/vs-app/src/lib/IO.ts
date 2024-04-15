/**
 * Triggers a file download using a blob.
 * 
 * @param {string} fileName - The name of the file to download.
 * @param {string} content - The content to be saved in the file.
 */
export function downloadFile(fileName:string, content:string) {
  if (!content) {
    console.error("No content available to download.");
    return;
  }
  const blob = new Blob([content], { type: 'chemical/x-pdb' }); // Adjust the MIME type as necessary
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link); // This line is optional depending on browser support
  link.click();
  window.URL.revokeObjectURL(link.href); // Clean up the URL object
  document.body.removeChild(link); // Clean up by removing the link if it was added to the document
}
