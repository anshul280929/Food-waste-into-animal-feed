import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, AreaChart, Area } from "recharts";
import { ArrowUpRight, Activity, TrendingUp, PieChart as PieIcon } from 'lucide-react';

const NutritionChart = () => {
  // Farm-inspired color palette
  const colors = {
    primary: '#2F5233',    // Deep forest green
    secondary: '#8B4513',  // Saddle brown
    accent: '#556B2F',     // Dark olive green
    highlight: '#8F9779',  // Sage green
    background: '#F5F5DC', // Beige
    lightAccent: '#A9B388', // Light sage
    text: '#463E3F',       // Dark brown text
  };

  const [chartData, setChartData] = useState([]);
  const [animalName, setAnimalName] = useState("");
  const [activeChart, setActiveChart] = useState('bar');

  useEffect(() => {
    fetch("http://localhost:5000/nutrition-comparison")
      .then((res) => res.json())
      .then((data) => {
        setChartData([
          { name: "Protein (g)", Required: data.required.protein, Available: data.available.protein },
          { name: "Calories (kcal)", Required: data.required.calories, Available: data.available.calories },
          { name: "Minerals (g)", Required: data.required.minerals, Available: data.available.minerals },
          { name: "Vitamins (g)", Required: data.required.vitamins, Available: data.available.vitamins },
        ]);
        setAnimalName(data.animal_name);
      });
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold" style={{ color: colors.text }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span style={{ color: colors.text }}>{entry.name}:</span>
              <span className="font-medium" style={{ color: colors.primary }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (activeChart) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.lightAccent} />
            <XAxis dataKey="name" tick={{ fill: colors.text }} />
            <YAxis tick={{ fill: colors.text }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Required" fill={colors.primary} name="Required Daily" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Available" fill={colors.secondary} name="Available in Feed" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.lightAccent} />
            <XAxis dataKey="name" tick={{ fill: colors.text }} />
            <YAxis tick={{ fill: colors.text }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="Required" stroke={colors.primary} strokeWidth={2} dot={{ r: 4 }} name="Required Daily" />
            <Line type="monotone" dataKey="Available" stroke={colors.secondary} strokeWidth={2} dot={{ r: 4 }} name="Available in Feed" />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.lightAccent} />
            <XAxis dataKey="name" tick={{ fill: colors.text }} />
            <YAxis tick={{ fill: colors.text }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="Required" stroke={colors.primary} fill={colors.primary} fillOpacity={0.2} name="Required Daily" />
            <Area type="monotone" dataKey="Available" stroke={colors.secondary} fill={colors.secondary} fillOpacity={0.2} name="Available in Feed" />
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="Required"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={colors.primary}
              label
            />
            <Pie
              data={chartData}
              dataKey="Available"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={110}
              fill={colors.secondary}
              label
            />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
      default:
        return null;
    }
  };

  const ChartButton = ({ type, icon: Icon, label }) => (
    <button
      onClick={() => setActiveChart(type)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all`}
      style={{
        backgroundColor: activeChart === type ? colors.lightAccent : 'transparent',
        color: activeChart === type ? colors.primary : colors.text
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-6" style={{ backgroundColor: colors.background }}>
      <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: colors.lightAccent }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>Nutrition Analysis</h2>
              <p style={{ color: colors.text }} className="mt-1">Detailed breakdown for {animalName}</p>
            </div>
            <div className="flex gap-2">
              <ChartButton type="bar" icon={Activity} label="Bar" />
              <ChartButton type="line" icon={TrendingUp} label="Line" />
              <ChartButton type="area" icon={ArrowUpRight} label="Area" />
              <ChartButton type="pie" icon={PieIcon} label="Pie" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6 bg-white">
          <div className="h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6" style={{ backgroundColor: colors.background }}>
          {chartData.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium" style={{ color: colors.text }}>{item.name}</h3>
              <div className="mt-2 flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>{item.Available}</p>
                  <p className="text-sm" style={{ color: colors.text }}>Available</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold" style={{ color: colors.secondary }}>{item.Required}</p>
                  <p className="text-sm" style={{ color: colors.text }}>Required</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;