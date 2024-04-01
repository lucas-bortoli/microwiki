export function base64toBlob(base64Data: string, contentType: string) {
  contentType = contentType || "";
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.substr(dataUrl.indexOf(",") + 1));
    };
    reader.readAsDataURL(blob);
  });
}
