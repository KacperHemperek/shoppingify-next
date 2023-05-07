import Image from 'next/image';
import { useRouter } from 'next/router';

function NotLoggedIn() {
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-extralight lg:flex-row">
      <div className=" space-y-6 p-8">
        <h1 className="text-4xl font-bold  md:text-6xl">Sorry</h1>
        <p className="md:text-lg ">You must be logged in to see that page</p>

        <button
          className="rounded-lg bg-success px-4 py-2 font-semibold text-white  md:px-6 md:py-4"
          onClick={() => router.push('login')}
        >
          {' '}
          Login
        </button>
      </div>
      <div className="relative h-80 w-80 p-8 md:p-0">
        <Image
          src="/assets/undraw_my_password_re_ydq7.svg"
          alt="not logged in hero image"
          fill
        />
      </div>
    </div>
  );
}

export default NotLoggedIn;
