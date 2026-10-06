function base64ToUint8Array(text: string) {
  return new Uint8Array(Buffer.from(text, "base64"));
}

function uInt8ArrayToBase64(array: Uint8Array) {
  return Buffer.from(array).toString("base64");
}

export default {
  base64ToUint8Array,
  uInt8ArrayToBase64,
};
