import {
    useEffect,
    useState,
} from "react";

import AssetForm from "../../components/assets/AssetForm";
import AssetTable from "../../components/assets/AssetTable";

import {
    getAssets,
    createAsset,
    deleteAsset,
    updateAsset,
} from "../../api/assetApi";

export default function Assets() {
    const [assets, setAssets] =
        useState([]);
    const [editingAsset, setEditingAsset] =
        useState(null);
    const [search, setSearch] =
        useState("");

    const [statusFilter,
        setStatusFilter] =
        useState("All");

    const fetchAssets =
        async () => {
            const data =
                await getAssets();

            setAssets(data.assets);
        };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleSubmit = async (
        formData
    ) => {
        console.log(
            "Submitting:",
            formData
        );

        if (editingAsset) {
            await updateAsset(
                editingAsset.asset_id,
                formData
            );

            setEditingAsset(null);
        } else {
            await createAsset(formData);
        }

        await fetchAssets();

    };

    const handleDelete =
        async (id) => {
            await deleteAsset(id);

            fetchAssets();
        };

    const filteredAssets =
        assets.filter((asset) => {
            const matchesSearch =
                [
                    asset.asset_name,
                    asset.asset_code,
                    asset.category,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesStatus =
                statusFilter === "All" ||
                asset.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Asset Management
            </h1>

            <AssetForm
                onSubmit={handleSubmit}
                initialData={editingAsset}
                isEditing={!!editingAsset}
                existingAssets={assets}
            />

            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search assets..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="border p-2 rounded flex-1"
                />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                    className="border p-2 rounded"
                >
                    <option value="All">
                        All Status
                    </option>

                    <option value="Available">
                        Available
                    </option>

                    <option value="Assigned">
                        Assigned
                    </option>

                    <option value="Maintenance">
                        Maintenance
                    </option>

                    <option value="Retired">
                        Retired
                    </option>
                </select>
            </div>

            <AssetTable
                assets={filteredAssets}
                onDelete={handleDelete}
                onEdit={setEditingAsset}
            />
        </div>
    );
}