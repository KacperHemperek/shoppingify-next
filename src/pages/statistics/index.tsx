import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

import ErrorPage from '@/components/layouts/ErrorPage';
import Loadingpage from '@/components/layouts/LoadingPage';

import useSidebar from '@/hooks/useSidebar';

import { type RouterOutputs, api } from '@/utils/api';

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
  data: RouterOutputs['charts']['getLineChartData'];
}) {
  const maxValue = Math.max(...(data?.map(({ items }) => items) ?? [])) + 10;
  const minValue = Math.min(...(data?.map(({ items }) => items) ?? [])) - 10;

  return (
    <div className="flex w-full h-80 md:h-[450px] py-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ right: 46 }}>
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
  const router = useRouter();
  const { setSidebarOption } = useSidebar();

  const {
    data: topThreeItems,
    isLoading: topItemsLoading,
    isError: fetchingTopItemsFailed,
  } = api.charts.getTopThreeItems.useQuery();
  const {
    data: topThreeCategories,
    isLoading: topCategoriesLoading,
    isError: fetchingTopCategoriesFailed,
  } = api.charts.getTopThreeCategories.useQuery();

  const {
    data: lineChartData,
    isLoading: lineChartDataLoading,
    isError: fetchingLineChartDataFailed,
  } = api.charts.getLineChartData.useQuery();

  if (lineChartDataLoading || topItemsLoading || topCategoriesLoading) {
    return <Loadingpage />;
  }

  if (
    fetchingTopItemsFailed ||
    fetchingTopCategoriesFailed ||
    fetchingLineChartDataFailed
  ) {
    return <ErrorPage />;
  }

  function goToCreateList() {
    router.push('/');
    setSidebarOption('cart');
  }

  return (
    <div className="flex w-full flex-col px-3 py-8 md:px-6 xl:px-20 ">
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-medium mb-4 md:mb-8">Top items</h1>
          {!!topThreeItems.length &&
            topThreeItems.map((item) => (
              <BarChartRow
                allItems={item.allItemsAmount}
                itemName={item.name}
                itemQuantity={item.amount}
                key={item.id + item.name}
              />
            ))}
          {!topThreeItems.length && (
            <div className="flex-grow">
              <p>
                There is not enough data to show{' '}
                <span className="font-medium text-primary">top items</span>{' '}
                statistics.{' '}
                <span
                  className="font-medium text-primary underline cursor-pointer hidden lg:inline"
                  onClick={goToCreateList}
                >
                  Create new lists
                </span>
                <Link
                  href="/"
                  className="font-medium text-primary underline cursor-pointer lg:hidden"
                >
                  Create new lists
                </Link>
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-medium mb-4 md:mb-8">Top categories</h1>
          {!!topThreeCategories.length &&
            topThreeCategories.map((item) => (
              <BarChartRow
                allItems={item.allItemsAmount}
                itemName={item.name}
                itemQuantity={item.amount}
                key={item.id + item.name}
              />
            ))}
          {!topThreeCategories.length && (
            <div className="flex-grow">
              <p>
                There is not enough data to show{' '}
                <span className="font-medium text-primary">top Categories</span>{' '}
                statistics.{' '}
                <span
                  className="font-medium text-primary underline cursor-pointer hidden lg:inline"
                  onClick={goToCreateList}
                >
                  Create new lists
                </span>
                <Link
                  href="/"
                  className="font-medium text-primary underline cursor-pointer lg:hidden"
                >
                  Create new lists
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 pb-10 md:pb-4 xl:pb-0">
        <h1 className="text-2xl font-medium mb-4 md:mb-8">Monthly Summary</h1>
        {!!lineChartData.length && (
          <LineChartWithItemsPerMonth data={lineChartData} />
        )}
        {!lineChartData.length && (
          <p>
            There is not enough data to show{' '}
            <span className="font-medium text-primary">top Categories</span>{' '}
            statistics.{' '}
            <span
              className="font-medium text-primary underline cursor-pointer hidden lg:inline"
              onClick={goToCreateList}
            >
              Create new lists
            </span>
            <Link
              href="/"
              className="font-medium text-primary underline cursor-pointer lg:hidden"
            >
              Create new lists
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
