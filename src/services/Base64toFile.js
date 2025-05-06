function base64ToFile(base64Url, filename) {
  // Extract base64 data and content type from URL
  const [header, base64Data] = base64Url.split(",");
  const mime = header.match(/:(.*?);/)[1];

  // Decode base64 data to binary
  const binaryString = window.atob(base64Data);

  // Create a Uint8Array to hold the binary data
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the binary data
  const blob = new Blob([bytes], { type: mime });

  // Create a File from the Blob
  return new File([blob], filename, { type: mime });
}

export default base64ToFile;
