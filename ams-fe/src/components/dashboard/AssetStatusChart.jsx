import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = {
  Available: "#10b981",
  Assigned: "#6366f1",
  Maintenance: "#f59e0b",
  Retired: "#94a3b8",
};

const FALLBACK_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#94a3b8", "#ec4899"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg">
      <span className="font-semibold">{name}</span>: {value}
    </div>
  );
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-4">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span className="font-medium">{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function AssetStatusChart({ data }) {
  const getColor = (entry, index) =>
    COLORS[entry.status] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            cornerRadius={4}
            label={renderCustomLabel}
            labelLine={false}
            stroke="none"
          >
            {data?.map((entry, index) => (
              <Cell
                key={index}
                fill={getColor(entry, index)}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}