import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssetById } from "../../api/assetApi";
import api from "../../api/axios";
import AssetDetails from "../../components/assets/AssetDetails";

export default function AssetDetailsPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [depreciation, setDepreciation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const [assetData, deprData] = await Promise.all([
          getAssetById(id),
          api.get(`/assets/${id}/depreciation`).then((r) => r.data),
        ]);
        setAsset(assetData.asset);
        setDepreciation(deprData.depreciation || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        Loading asset details...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Asset Details</h1>
        <p className="text-slate-500 text-sm mt-1">
          Asset information, depreciation and QR code
        </p>
      </div>

      <AssetDetails asset={asset} depreciation={depreciation} />
    </div>
  );
}