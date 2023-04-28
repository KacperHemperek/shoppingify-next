import { type TRPCClientErrorLike } from '@trpc/client';

export function formatErrorMessage(
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  error: TRPCClientErrorLike<any> | null
): string | undefined {
  try {
    if (error && Array.isArray(JSON.parse(error.message))) {
      return JSON.parse(error.message)[0].message;
    }
    return error?.message;
  } catch (e) {
    return error?.message;
  }
}
