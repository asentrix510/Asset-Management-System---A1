import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  getAssetById,
} from "../../api/assetApi";

import AssetDetails from "../../components/assets/AssetDetails";

export default function AssetDetailsPage() {
  const { id } =
    useParams();

  const [asset, setAsset] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchAsset =
      async () => {
        try {
          const data =
            await getAssetById(id);

          setAsset(
            data.asset
          );
        } catch (error) {
          console.error(
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchAsset();
  }, [id]);

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black">
          Asset Details
        </h1>

        <p className="text-slate-500">
          Asset information and QR code
        </p>
      </div>

      <AssetDetails
        asset={asset}
      />
    </div>
  );
}