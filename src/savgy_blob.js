

/**
 * create blob from
 * data URL
 */
export function dataURLToBlob(dataUrl) {
    // Check if the data URL is valid
    if (!dataUrl.startsWith('data:')) {
        throw new Error('Invalid data URL format');
    }

    // Split into metadata and data parts
    const [metaPart, dataPart] = dataUrl.split(',');
    if (!metaPart || !dataPart) {
        throw new Error('Invalid data URL format');
    }

    // Extract MIME type (handle cases like `charset=utf8`)
    const mimeMatch = metaPart.match(/^data:([^;]+)/);
    const mimeString = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

    let byteString;
    if (metaPart.includes('base64')) {
        // Handle base64-encoded data
        byteString = atob(dataPart);
    } else {
        // Handle URL-encoded data (e.g., SVG with %3C, %20, etc.)
        byteString = decodeURIComponent(dataPart);
    }

    // Convert to ArrayBuffer → Blob
    const buffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([buffer], { type: mimeString });
}


/**
 * convert blob to 
 * base64 data URL
 */
export function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(blob);
    });
}