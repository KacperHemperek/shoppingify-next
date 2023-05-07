import Image from 'next/image';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="space-y-6 flex flex-col xl:flex-row xl:gap-8 items-center">
        <div className="flex flex-col max-w-sm">
          <h1 className="text-4xl font-bold mb-6 md:text-6xl">Error</h1>
          <p className="md:text-lg mb-6">
            Something <span className="text-danger font-medium">very bad</span>{' '}
            happend... we are sorry for that if you want to report that problem{' '}
            <a
              className="underline font-bold text-primary"
              href="https://github.com/KacperHemperek/shoppingify-next/issues"
              target="_blank"
            >
              go here{' '}
            </a>
          </p>
          <Link
            className="rounded-lg bg-success px-3 py-2 font-semibold text-white md:px-4 md:py-3 max-w-min"
            href={'/'}
          >
            {' '}
            Home
          </Link>
        </div>
        <div className="relative h-80 w-80 p-8 md:p-0">
          <Image
            src="/assets/undraw_bug_fixing_oc-7-a.svg"
            alt="not logged in hero image"
            fill
          />
        </div>
      </div>
    </div>
  );
}
