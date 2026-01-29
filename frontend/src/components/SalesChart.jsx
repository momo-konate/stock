import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SalesChart = ({ sales }) => {
  const data = useMemo(() => {
    // 1. Initialiser les 7 derniers jours
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push({
        name: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
        dateStr: d.toDateString(), // Pour comparaison
        total: 0
      });
    }

    // 2. Agréger les ventes
    sales.forEach(sale => {
      const saleDate = new Date(sale.dateVente || sale.date).toDateString();
      const dayData = last7Days.find(d => d.dateStr === saleDate);
      if (dayData) {
        dayData.total += sale.total;
      }
    });

    return last7Days;
  }, [sales]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[300px]">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Ventes des 7 derniers jours</h3>
      <div className="h-[230px] w-full text-xs" style={{ minHeight: '230px', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0} debounce={50}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.total > 0 ? '#10b981' : '#e2e8f0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
