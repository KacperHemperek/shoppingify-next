import { motion } from 'framer-motion';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { RouterOutputs, api } from '@/utils/api';

function BarChartRow({
  itemName,
  itemQuantity,
  allItems,
}: {
  itemName: string;
  allItems: number;
  itemQuantity: number;
}) {
  const itemPercent = Math.floor((itemQuantity / allItems) * 100);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-sm">{itemName}</h3>
        <p className="text-lg">{itemPercent}%</p>
      </div>
      <div className="h-2 rounded-full bg-[#E0E0E0] relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-2 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${itemPercent}%`,
            transition: {
              delay: 0.5,
              duration: 1.2 * (itemQuantity / allItems),
            },
          }}
        />
      </div>
    </div>
  );
}

function LineChartWithItemsPerMonth({
  data,
}: {
  data?: RouterOutputs['charts']['getLineChartData'];
}) {
  if (!data) {
    return (
      <div className="flex w-full h-full py-8">
        <h4>Not enough data for current user</h4>
      </div>
    );
  }

  const maxValue = Math.max(...(data?.map(({ items }) => items) ?? [])) + 10;
  const minValue = Math.min(...(data?.map(({ items }) => items) ?? [])) - 10;

  return (
    <div className="flex w-full h-full py-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[minValue <= 0 ? 0 : minValue, maxValue]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="items"
            label="items"
            stroke="#F9A109"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Statistics() {
  const { data: topThreeItems } = api.charts.getTopThreeItems.useQuery();
  const { data: topThreeCategories } =
    api.charts.getTopThreeCategories.useQuery();

  const { data: lineChartData } = api.charts.getLineChartData.useQuery();

  return (
    <div className="flex w-full flex-col px-3 py-8 md:px-6 xl:px-20">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="grid gap-4">
          <h1 className="text-2xl font-medium mb-2 md:mb-4">Top items</h1>
          {!!topThreeItems &&
            topThreeItems.map((item) => (
              <BarChartRow
                allItems={item.allItemsAmount}
                itemName={item.name}
                itemQuantity={item.amount}
                key={item.id + item.name}
              />
            ))}
        </div>
        <div className="grid gap-4">
          <h1 className="text-2xl font-medium mb-2 md:mb-4">Top categories</h1>
          {!!topThreeCategories &&
            topThreeCategories.map((item) => (
              <BarChartRow
                allItems={item.allItemsAmount}
                itemName={item.name}
                itemQuantity={item.amount}
                key={item.id + item.name}
              />
            ))}
        </div>
      </div>
      <LineChartWithItemsPerMonth data={lineChartData} />
    </div>
  );
}
