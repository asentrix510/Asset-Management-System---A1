// Straight-Line Depreciation
// Formula: Current Value = Cost × (1 - yearsElapsed / usefulLife)
// Clamped to minimum residual value (10% of cost)

const USEFUL_LIFE_YEARS = {
  Electronics: 5,
  Computers: 5,
  Laptops: 4,
  Furniture: 10,
  Vehicles: 8,
  Machinery: 10,
  Equipment: 7,
  Software: 3,
  Office: 7,
  Default: 5,
};

const getUsefulLife = (category) => {
  if (!category) return USEFUL_LIFE_YEARS.Default;
  const key = Object.keys(USEFUL_LIFE_YEARS).find(
    (k) => category.toLowerCase().includes(k.toLowerCase())
  );
  return key ? USEFUL_LIFE_YEARS[key] : USEFUL_LIFE_YEARS.Default;
};

const calculateDepreciation = (asset) => {
  const cost = parseFloat(asset.purchase_cost) || 0;
  if (!asset.purchase_date || cost === 0) {
    return {
      purchase_cost: cost,
      current_value: cost,
      depreciation_amount: 0,
      depreciation_percent: 0,
      years_elapsed: 0,
      useful_life_years: getUsefulLife(asset.category),
      is_fully_depreciated: false,
    };
  }

  const usefulLife = getUsefulLife(asset.category);
  const purchaseDate = new Date(asset.purchase_date);
  const now = new Date();
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const yearsElapsed = (now - purchaseDate) / msPerYear;

  const residualValue = cost * 0.1; // 10% residual
  const annualDepreciation = (cost - residualValue) / usefulLife;
  const totalDepreciation = Math.min(
    annualDepreciation * yearsElapsed,
    cost - residualValue
  );

  const currentValue = Math.max(cost - totalDepreciation, residualValue);
  const depreciationPercent = ((cost - currentValue) / cost) * 100;

  return {
    purchase_cost: parseFloat(cost.toFixed(2)),
    current_value: parseFloat(currentValue.toFixed(2)),
    depreciation_amount: parseFloat((cost - currentValue).toFixed(2)),
    depreciation_percent: parseFloat(depreciationPercent.toFixed(1)),
    years_elapsed: parseFloat(yearsElapsed.toFixed(1)),
    useful_life_years: usefulLife,
    is_fully_depreciated: yearsElapsed >= usefulLife,
  };
};

module.exports = { calculateDepreciation, getUsefulLife, USEFUL_LIFE_YEARS };
