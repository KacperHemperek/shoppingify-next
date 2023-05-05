import { motion } from 'framer-motion';
import React from 'react';

import { api } from '@/utils/api';

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
        <h3 className="">{itemName}</h3>
        <p className="text-lg">{itemPercent}%</p>
      </div>
      <div className="h-2 rounded-full bg-[#E0E0E0] relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-2 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${itemPercent}%`,
            transition: {
              delay: 0.9,
              duration: 1.2 * (itemQuantity / allItems),
            },
          }}
        />
      </div>
    </div>
  );
}

export default function Statistics() {
  const { data: topThreeItems } = api.charts.getTopThreeItems.useQuery();

  if (!topThreeItems) {
    return <div>something went wrong</div>;
  }

  console.log(topThreeItems);

  return (
    <div className="flex w-full flex-col px-3 py-8 md:px-6 xl:px-20">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="grid gap-4">
          <h1 className="text-2xl font-medium mb-2 md:mb-4">Top items</h1>
          {topThreeItems.map((item) => (
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
          <BarChartRow itemQuantity={69} allItems={100} itemName={'Apple'} />
          <BarChartRow itemQuantity={69} allItems={100} itemName={'Apple'} />
          <BarChartRow itemQuantity={69} allItems={100} itemName={'Apple'} />
        </div>
      </div>
    </div>
  );
}
