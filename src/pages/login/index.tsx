import { motion, AnimatePresence } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import { useState } from 'react';
import useMeasure from 'react-use-measure';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSubmitButton from '@/components/FormSubmitButton';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';

type LoginFormInput = {
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginFormContent() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormInput>({ resolver: zodResolver(loginSchema) });

  const router = useRouter();
  const utils = api.useContext();

  const { mutateAsync: login } = api.user.login.useMutation({
    onSuccess: () => {
      utils.user.getUserFromSession.invalidate();
    },
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      // TODO Login
      await login(data);
      router.push('/');
    } catch (error) {}
  };

  return (
    <>
      <motion.form
        className="flex w-full flex-col "
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* <ErrorAlert text={(loginError as any)?.message} visible={isError} /> */}

        <label htmlFor="email" className="label">
          <span className="mb-2 ">Email</span>
          <input
            type="text"
            className=" rounded-xl border-2 border-neutral-light p-4 outline-2 outline-primary transition-all placeholder:text-sm placeholder:text-neutral-light focus:placeholder:text-primary"
            placeholder={'Enter an email'}
            {...register('email')}
          />
        </label>
        <label htmlFor="email" className="label mb-4">
          <span className="mb-2 mt-6">Password</span>
          <input
            type="password"
            className="w-full rounded-xl border-2 border-neutral-light p-4 outline-2 outline-primary transition-all placeholder:text-sm placeholder:text-neutral-light focus:placeholder:text-primary"
            placeholder={'Enter a password'}
            {...register('password')}
          />
        </label>
        <div className="mt-6">
          <FormSubmitButton
            buttonText="Login"
            isValid={isValid}
            loading={false}
          />
        </div>
      </motion.form>
    </>
  );
}

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const registerSchema = z.object({
  name: z.string().min(3, 'Name must have at least 3 characters').trim(),
  email: z
    .string()
    .min(5, 'Email must be at least 5 characters')
    .email('This field must be a valid email')
    .trim(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/gi),
});

function RegisterFormContent() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<RegisterFormInputs>({ resolver: zodResolver(registerSchema) });

  const router = useRouter();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      //TODO: Register method from trpc
      // await signUp(data);
      console.log(data);
      router.push('/');
    } catch (err) {
      // TODO: Handle Register errors
    }
  };

  return (
    <form
      className="flex w-full flex-col space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* <ErrorAlert
        visible={isError && error instanceof FirebaseError}
        text={formatFireabseAuthError(error as FirebaseError)}
      /> */}

      <label htmlFor="email" className="label">
        Email
        <span className="mb-2"></span>
        <input
          type="email"
          className=" rounded-xl border-2 border-neutral-light p-4 outline-2 outline-primary transition-all placeholder:text-sm placeholder:text-neutral-light focus:placeholder:text-primary"
          placeholder={'Enter an email'}
          {...register('email', { required: true })}
        />
      </label>
      <label htmlFor="name" className="label">
        Name
        <span className="mb-2"></span>
        <input
          type="text"
          className=" rounded-xl border-2 border-neutral-light p-4 outline-2 outline-primary transition-all placeholder:text-sm placeholder:text-neutral-light focus:placeholder:text-primary"
          placeholder={'Enter your name'}
          {...register('name', { required: true })}
        />
      </label>
      <label htmlFor="password" className="label mb-4">
        Password
        <span className="mb-2"></span>
        <input
          type="password"
          className="w-full rounded-xl border-2 border-neutral-light p-4 outline-2 outline-primary transition-all placeholder:text-sm placeholder:text-neutral-light focus:placeholder:text-primary"
          placeholder={'Enter a password'}
          {...register('password', { required: true })}
        />
      </label>
      <FormSubmitButton
        buttonText="Register"
        isValid={isValid}
        loading={false}
      />
    </form>
  );
}

const X_WIDTH = 500;

const variants = {
  login: {
    left: 0,
  },
  register: {
    left: 'calc(50% - 4px)',
  },
};

const variantsPresence: AnimationProps['variants'] = {
  initial: (right: boolean) => ({
    x: right ? -X_WIDTH : X_WIDTH,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (right: boolean) => ({
    x: right ? -X_WIDTH : X_WIDTH,
    opacity: 0,
  }),
};

function Login() {
  const [formType, setFormType] = useState<'login' | 'register'>('login');

  const [ref, bounds] = useMeasure();

  const isLogin = formType === 'login';

  const swapForm = (value: 'login' | 'register') => {
    if (formType === value) {
      return;
    }
    setFormType(value);
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-neutral-extralight ">
      <motion.div
        animate={formType}
        initial={formType}
        className="mx-auto flex w-full max-w-sm flex-col items-center space-y-6 overflow-hidden  rounded-xl bg-neutral-extralight p-8 shadow-primary/30 md:border md:border-primary md:bg-white md:shadow-lg"
      >
        <motion.div className="relative flex w-full justify-evenly space-x-1 overflow-hidden rounded-xl border-2 border-primary bg-primary-light p-1">
          <div
            className={`${
              isLogin ? 'text-white' : 'text-primary'
            }  transition-color z-10 h-full w-full cursor-pointer bg-transparent p-2 text-center text-lg font-semibold`}
            onClick={() => swapForm('login')}
          >
            Login
          </div>
          <div
            className={`${
              !isLogin ? 'text-white' : 'text-primary'
            }  transition-color z-10 h-full w-full cursor-pointer bg-transparent p-2 text-center text-lg  font-semibold`}
            onClick={() => swapForm('register')}
          >
            Register
          </div>

          <motion.div
            variants={variants}
            transition={{ duration: 0.3 }}
            className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg bg-primary"
          />
        </motion.div>
        <motion.div
          animate={{ height: bounds.height > 0 ? bounds.height : 'auto' }}
          transition={{
            type: 'spring',
            bounce: 0.1,
            duration: 0.25,
          }}
          className=" w-full"
        >
          <div ref={ref}>
            <AnimatePresence mode={'wait'} initial={false}>
              <motion.div
                ref={ref}
                key={isLogin ? 'loginFormContent' : 'registerFormContent'}
                className="w-full "
                variants={variantsPresence}
                animate={'animate'}
                exit={'exit'}
                initial={'initial'}
                custom={isLogin}
                transition={{ duration: 0.15 }}
              >
                {formType === 'login' ? (
                  <LoginFormContent key={'loginFormContent'} />
                ) : (
                  <RegisterFormContent key={'registerFormContent'} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
