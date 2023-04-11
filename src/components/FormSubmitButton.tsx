import { motion } from 'framer-motion';
import { Puff } from 'react-loader-spinner';

function FormSubmitButton({
  loading,
  isValid,
  buttonText,
}: {
  buttonText: string;
  loading?: boolean;
  isValid?: boolean;
}) {
  return (
    <motion.button
      className={'submit-button'}
      disabled={(!isValid && isValid !== undefined) || loading}
    >
      {loading ? (
        <motion.div layout={'position'} className="flex w-auto self-center">
          <Puff width={'24'} height={'24'} wrapperClass={''} color={'white'} />
        </motion.div>
      ) : (
        buttonText
      )}
    </motion.button>
  );
}

export default FormSubmitButton;
