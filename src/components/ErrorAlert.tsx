import { XCircleIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';

function ErrorAlert({ text, visible }: { text: string; visible: boolean }) {
  return (
    <AnimatePresence mode="popLayout">
      {visible && (
        <motion.div
          key="errorMessage"
          initial={{
            opacity: 0,
            // height: 0,
          }}
          animate={{
            opacity: 1,
            // height: 'auto',
          }}
          exit={{
            opacity: 0,
            // height: 0,
          }}
          transition={{
            duration: 0.25,
            delay: 0.15,
          }}
          className="flex w-full items-center  space-x-3 font-semibold text-neutral-dark"
        >
          <div className="flex w-full items-center space-x-3 rounded-xl bg-red-500  p-2 font-semibold text-neutral-extralight ">
            <XCircleIcon className="h-9 w-9 " />
            <div className="flex w-full flex-col ">
              <h4 className=" -mb-1 text-lg  font-bold">Error</h4>
              <span className="text-sm">{text}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ErrorAlert;
