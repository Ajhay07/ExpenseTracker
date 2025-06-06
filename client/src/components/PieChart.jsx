import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28'];

const PieChartComponent = ({ data }) => {
  const grouped = data.reduce((acc, item) => {
    const key = item.desc;
    acc[key] = (acc[key] || 0) + item.amount;
    return acc;
  }, {});
  const chartData = Object.keys(grouped).map((k) => ({ name: k, value: Math.abs(grouped[k]) }));

  return (
    <PieChart width={300} height={200}>
      <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={70}>
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;
