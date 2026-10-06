function base64ToUint8Array(text: string) {
  const bytes = atob(text);

  return Uint8Array.from(bytes, (char) => char.charCodeAt(0));
}

function uInt8ArrayToBase64(array: Uint8Array) {
  let text = "";
  for (let i = 0; i < array.length; i++) {
    text += String.fromCharCode(array[i]);
  }

  return btoa(text);
}

export default {
  base64ToUint8Array,
  uInt8ArrayToBase64,
};
