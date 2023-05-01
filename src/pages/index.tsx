import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

import CategoriesList from '@/components/CategoriesList';
import ErrorPage from '@/components/layounts/ErrorPage';
import Loadingpage from '@/components/layounts/LoadingPage';

import type { CategoryType } from '@/types/Categoy.interface';

import { api } from '@/utils/api';

function filterCategories(
  query: string,
  data?: CategoryType[]
): CategoryType[] {
  if (!data) {
    return [];
  }
  return data
    .filter((category) =>
      category.items.some((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    )
    .map(({ id, items, name }) => ({
      id,
      name,
      items: items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ),
    }));
}

function Homepage() {
  const { data, isLoading, error } = api.item.getAll.useQuery();
  const [searchQ, setSearchQ] = useState('');

  const filteredCategories = useMemo(
    () => filterCategories(searchQ, data),
    [data, searchQ]
  );

  if (error) {
    return <ErrorPage />;
  }

  if (isLoading) {
    return <Loadingpage />;
  }

  return (
    <div className="flex w-full flex-col px-3 py-8 md:px-6 xl:px-20">
      <header className="mb-8 flex w-full flex-col space-y-4 lg:justify-between xl:flex-row xl:space-x-4 xl:space-y-0">
        <h1 className="text-xl font-medium text-neutral-dark lg:text-2xl xl:text-4xl">
          <span className="text-primary ">Shoppingify</span> allows you take
          your shopping list wherever you go
        </h1>
        <div className="group flex h-min w-full max-w-[330px] items-center overflow-hidden rounded-xl bg-white text-sm focus-within:outline focus-within:outline-2 focus-within:outline-primary">
          <MagnifyingGlassIcon className="ml-4 h-6 w-6 text-neutral-dark group-focus-within:text-primary" />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value.trim())}
            type="text"
            className="flex-grow p-4 focus:outline-none"
            placeholder="search item"
          />
        </div>
      </header>
      <div className="flex w-full flex-col">
        <CategoriesList categories={filteredCategories ?? []} />
      </div>
    </div>
  );
}

export default Homepage;
