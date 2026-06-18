import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGenerator({
  assetId,
}) {
  const qrRef = useRef();

  const qrValue =
    `${window.location.origin}/assets/${assetId}`;

  const downloadQR = () => {
    const canvas =
      qrRef.current.querySelector(
        "canvas"
      );

    const url =
      canvas.toDataURL(
        "image/png"
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `asset-${assetId}.png`;

    link.click();
  };

  return (
    <div
      ref={qrRef}
      className="flex flex-col items-center gap-4"
    >
      <QRCodeCanvas
        value={qrValue}
        size={220}
      />

      <button
        onClick={downloadQR}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download QR
      </button>

      <p className="text-xs text-slate-500 break-all text-center">
        {qrValue}
      </p>
    </div>
  );
}