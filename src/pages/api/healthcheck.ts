import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/server/db';

async function checkKey(key: string) {
  if (!process.env.HEALTHCHECK_SECRET) {
    return false;
  }

  return process.env.HEALTHCHECK_SECRET === key;
}

async function checkDb() {
  try {
    const result = await prisma.list.findFirst();

    return result;
  } catch (e) {
    return undefined;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { key } = req.body;

  if (!key) {
    return res.status(400).json({
      status: 'error',
      message: 'No key provided',
    });
  }

  const keyCheckResult = await checkKey(key);

  if (!keyCheckResult) {
    return res.status(403).json({
      status: 'error',
      message: 'Key is invalid',
    });
  }

  const dbCheckResult = await checkDb();

  console.log(process.env.HEALTHCHECK_SECRET);

  if (!dbCheckResult) {
    return res.status(500).json({
      status: 'error',
      message: 'Database is not connected',
    });
  }

  return res.status(200).json({
    status: 'ok',
  });
}
