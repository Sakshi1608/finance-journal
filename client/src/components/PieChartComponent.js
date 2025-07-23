import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ['#1f77b4', '#ff7f0e', '#d62728']; // Blue, Orange, Red

const renderLabel = ({ name, percent, x, y, cx, cy, outerRadius, midAngle }) => {
  const radius = outerRadius + 20;
  const RADIAN = Math.PI / 180;
  const xPos = cx + radius * Math.cos(-midAngle * RADIAN);
  const yPos = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={xPos} y={yPos} fill="#333" textAnchor="middle" dominantBaseline="central" fontWeight="bold">
      {`${name}: ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function PieChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={renderLabel}
          labelLine={true}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
