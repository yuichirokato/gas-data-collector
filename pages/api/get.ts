import type { NextApiRequest, NextApiResponse } from "next"; 
import { Redis } from "@upstash/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const redis = Redis.fromEnv();
    const key = "goerli-every-thirty-minutes";
    const data = await redis.lrange(key, 0, -1);
    res.status(200).json(data);
}