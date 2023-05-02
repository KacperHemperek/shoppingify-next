import { motion, AnimatePresence } from 'framer-motion';

import ItemCard from '@/components/ItemCard';

import useSidebar from '@/hooks/useSidebar';

import type { CategoryType } from '@/types/Categoy.interface';

function Category({ items, name, id }: CategoryType) {
  return (
    <motion.div
      layout={'position'}
      transition={{
        layout: {
          delay: 0.4,
        },
      }}
      className=" mb-12"
    >
      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-6 text-lg font-medium text-black md:text-xl"
      >
        {name}
      </motion.h2>
      <motion.div
        transition={{ delayChildren: 0.3 }}
        className="grid gap-6 grid-cols-2  xl:grid-cols-3  2xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <ItemCard
              item={item}
              categoryId={id}
              delay={i * 0.2 + 0.6}
              key={item.name ?? i}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function CategoriesList({ categories }: { categories?: CategoryType[] }) {
  const { setSidebarOption } = useSidebar();
  if (!categories || !categories?.length) {
    return (
      <div>
        <h2 className="my-6 text-lg font-medium text-neutral-light">
          No items were found{' '}
          <a
            className="cursor-pointer font-bold text-primary underline"
            onClick={() => setSidebarOption('addItem')}
          >
            add item
          </a>
        </h2>
      </div>
    );
  }

  return (
    <motion.div
      layout={'size'}
      transition={{
        layout: {
          delay: 0.5,
        },
      }}
    >
      {categories?.map((category) => (
        <Category key={category.name} {...category} />
      ))}
    </motion.div>
  );
}

export default CategoriesList;
