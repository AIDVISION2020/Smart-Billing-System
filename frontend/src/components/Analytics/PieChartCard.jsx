import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import propTypes from "prop-types";

// Generate N visually distinct colors using HSL
function generateColors(count) {
  const colors = [];
  const saturation = 70;
  const lightness = 60;
  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 * i) / count);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

export default function PieChatCard({ data, metricOptions, title, nameKey }) {
  const [selected, setSelected] = useState(metricOptions[0]);
  const [open, setOpen] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((item) => item[selected.value] > 0);
  }, [data, selected.value]);
  const colors = useMemo(
    () => generateColors(filteredData.length),
    [filteredData.length]
  );

  // Check if all values for the selected metric are zero or null
  const hasData = data.some((val) => val[selected.value] > 0);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-xl mx-auto w-full ">
      {/* Header with embedded dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center px-3 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <span className="mr-2 text-sm font-medium">{selected.label}</span>
            <ChevronDown
              className={`h-4 w-4 transform transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
          {open && (
            <ul className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 w-40 overflow-auto max-h-40">
              {metricOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    setSelected(opt);
                    setOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer text-sm"
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Pie Chart or No Data Message */}
      {!hasData ? (
        <div className="h-full text-gray-600 flex items-center justify-center">
          <p>No data available for the selected metric.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredData}
              dataKey={selected.value}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) =>
                `${name}: ${
                  selected.isCurrency
                    ? `₹${value.toFixed(2)}`
                    : value.toFixed(2)
                }`
              }
            >
              {filteredData.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => (selected.isCurrency ? `₹${v.toFixed(2)}` : v)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

PieChatCard.propTypes = {
  data: propTypes.array.isRequired,
  metricOptions: propTypes.array.isRequired,
  title: propTypes.string.isRequired,
  nameKey: propTypes.string,
};
