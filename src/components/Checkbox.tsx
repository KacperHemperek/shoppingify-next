import classnames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';

export default function Checkbox({
  checked,
  newValue,
  wrapperClassName,
  onCheck: setChecked,
  disabled = false,
}: {
  checked: boolean;
  wrapperClassName?: string;
  newValue?: boolean;
  onCheck?: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={classnames('relative w-min', wrapperClassName)}>
      <input
        type="checkbox"
        defaultChecked={checked}
        className="hide-visually"
        onChange={(e) => {
          e.stopPropagation();
          !disabled && setChecked && setChecked(newValue ?? e.target.checked);
        }}
        disabled={disabled}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        className={classnames(
          disabled
            ? 'cursor-not-allowed border-neutral-light stroke-neutral-light'
            : 'cursor-pointer border-primary stroke-primary',
          'h-6 w-6 rounded-md border-2  stroke-[4px] duration-100 group-focus:outline-4'
        )}
      >
        <motion.path
          animate={{
            pathLength: checked ? 1 : 0,
            opacity: 1,
            transition: { ease: 'easeInOut' },
          }}
          fill="none"
          d="M 7 22
             l 7 8
             20-19"
          strokeLinejoin="round"
        />
      </svg>
    </label>
  );
}
