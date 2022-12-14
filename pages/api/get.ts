import type { NextApiRequest, NextApiResponse } from "next"; 
import { Redis } from '@upstash/redis/with-fetch';
import { RedisKeys } from "../../utils/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const redis = Redis.fromEnv();

    try {
        const ethData = await redis.lrange(RedisKeys.ETHEREUM, 0, -1);
        const goerliData = await redis.lrange(RedisKeys.GOERLI, 0, -1);
        const polygonData = await redis.lrange(RedisKeys.POLYGON, 0, -1);

        res.status(200).json({
            ethereum: ethData,
            goerli: goerliData,
            polygon: polygonData
        });
    } catch (e) {
        console.log("an error hs occured.", e);
        res.status(500).send(`Unknown error occurred, reason: ${e}`);
    }
}