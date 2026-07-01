import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const BAR_COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ec4899",
  "#3b82f6", "#8b5cf6", "#14b8a6", "#f43f5e",
  "#0ea5e9", "#a855f7",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg">
      <p className="font-semibold">{label}</p>
      <p className="text-slate-300 mt-0.5">{payload[0].value} assets</p>
    </div>
  );
};

export default function AssetCategoryChart({ data }) {
  const counts = data?.map(d => d.count) || [];
  const maxCount = counts.length > 0 ? Math.max(...counts) : 0;
  const yAxisMax = maxCount > 0 ? Math.ceil(maxCount * 1.2) : 5;

  const CustomCursor = (props) => {
    const { x, y, width, height, payload } = props;
    if (!payload || payload.length === 0) return null;

    const value = payload[0].value;
    const barHeight = (value / yAxisMax) * height;
    const barY = y + height - barHeight;

    return (
      <rect
        x={x}
        y={barY}
        width={width}
        height={barHeight}
        fill="#f8fafc"
      />
    );
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={32}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, yAxisMax]}
            allowDecimals={false}
            tickFormatter={(v) => Math.floor(v)}
            tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={<CustomCursor />} />
          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
          >
            {data?.map((entry, index) => (
              <Cell
                key={index}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}