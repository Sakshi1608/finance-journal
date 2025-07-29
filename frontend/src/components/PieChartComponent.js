import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

const COLORS = ["#1565C0", "#388E3C", "#FF8F00"];

const renderLabel = ({ name, percent, cx, cy, midAngle, outerRadius }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor="middle"
      fontSize="12"
      dominantBaseline="central"
    >
      {`${name}: ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

function PieChartComponent({ data, title }) {
  const theme = useTheme();

  return (
    <Box sx={{ height: 300, width: "100%" }}>
      {title && (
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            nameKey="name"
            label={renderLabel}
            labelLine
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default PieChartComponent;
