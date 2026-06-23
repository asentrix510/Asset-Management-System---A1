import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

/**
 * Builds a plain-text payload of all asset fields.
 * When scanned by any phone camera, the text is shown directly —
 * no URL, no website, no internet required. Works 100% offline.
 */
function buildPlainTextPayload(asset) {
  let orgName = "Asset Management System";
  try {
    const s = JSON.parse(localStorage.getItem("ams_settings") || "{}");
    if (s.org_name) orgName = s.org_name;
  } catch { /* ignore */ }

  function fmt(date) {
    if (!date) return null;
    try { return new Date(date).toLocaleDateString("en-IN"); }
    catch { return date; }
  }

  function fmtCost(cost) {
    if (cost == null || cost === "") return null;
    return `Rs. ${Number(cost).toLocaleString("en-IN")}`;
  }

  const lines = [
    `=== ASSET CARD ===`,
    `Org    : ${orgName}`,
    ``,
    `Code   : ${asset.asset_code || "-"}`,
    `Name   : ${asset.asset_name || "-"}`,
    `Cat.   : ${asset.category || "-"}`,
    `Status : ${asset.status || "-"}`,
  ];

  if (asset.brand)         lines.push(`Brand  : ${asset.brand}`);
  if (asset.model)         lines.push(`Model  : ${asset.model}`);
  if (asset.serial_number) lines.push(`S/N    : ${asset.serial_number}`);
  if (asset.vendor_name)   lines.push(`Vendor : ${asset.vendor_name}`);

  const cost = fmtCost(asset.purchase_cost);
  const pDate = fmt(asset.purchase_date);
  const wDate = fmt(asset.warranty_expiry);

  if (pDate)  lines.push(`Purch. : ${pDate}`);
  if (cost)   lines.push(`Cost   : ${cost}`);
  if (wDate)  lines.push(`Warr.  : ${wDate}`);
  if (asset.description) lines.push(`Notes  : ${asset.description}`);

  lines.push(``, `=================`);

  return lines.join("\n");
}

export default function QRCodeGenerator({ asset }) {
  const qrRef = useRef();

  if (!asset) {
    return <p className="text-xs text-slate-400">No asset data provided.</p>;
  }

  const qrValue = buildPlainTextPayload(asset);

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `asset-${asset.asset_code || asset.asset_id}.png`;
    link.click();
  };

  return (
    <div ref={qrRef} className="flex flex-col items-center gap-4 w-full">
      {/* QR Code */}
      <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
        <QRCodeCanvas
          value={qrValue}
          size={200}
          level="M"
          includeMargin={false}
        />
      </div>

      {/* Info */}
      <div className="text-center space-y-1">
        <p className="text-xs font-semibold text-slate-600">
          {asset.asset_code} — {asset.asset_name}
        </p>
        <p className="text-[10px] text-slate-400 leading-tight">
          Scan with any phone camera to view details.<br />
          Works completely offline — no internet needed.
        </p>
      </div>

      {/* Download */}
      <button
        onClick={downloadQR}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-xl text-xs font-semibold"
      >
        ⬇ Download QR
      </button>
    </div>
  );
}