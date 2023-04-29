import { motion } from 'framer-motion';
import React from 'react';

export default function Checkbox({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div onClick={() => setChecked((prev) => !prev)} className="relative">
      <input
        type="checkbox"
        checked={checked}
        className="w-0 h-0 absolute pointer-events-none group"
        onChange={() => setChecked((prev) => !prev)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
        className={`${
          checked ? 'bg-primary' : 'bg-transparent'
        } w-6 h-6 rounded-md border-2 border-primary duration-100 group-focus:outline-4 group-focus:outline-primary/25`}
      >
        <motion.path
          animate={{
            pathLength: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
            transition: { delay: checked ? 0.075 : 0, ease: 'easeInOut' },
          }}
          className="stroke-[4px] stroke-white"
          fill="none"
          d="M 6 20
             l 7 7
             17.5-17.5"
        />
      </svg>
    </div>
  );
}
