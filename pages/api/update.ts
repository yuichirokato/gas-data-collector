import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import GasDataCollecter from "../../services/gas-data-collector";
import { BuilderConfig } from "../../utils/provider-builder";
import GasDataCollectError from "../../entities/gas-data-collect-error";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const configs = [
        {
            redisKey: 'ethereum-every-thirty-minutes',
            providerConfig: BuilderConfig.mainnet 
        },
        {
            redisKey: 'goerli-every-thirty-minutes',
            providerConfig: BuilderConfig.goerli
        },
        {
            redisKey: 'polygon-every-thirty-minutes',
            providerConfig: BuilderConfig.polygon
        }
    ];

    const providers = configs.map(config => new GasDataCollecter(config.redisKey, config.providerConfig));

    try {
        await Promise.all(providers.map(provider => provider.collectGasData()));
        res.status(200);
    } catch (e) {
        if (e instanceof GasDataCollectError) {
            res.status(e.status).send(e.message);
        } else {
            res.status(500).send(`Unknown error occurred, reason: ${e}`);
        }
    }
}

export default verifySignature(handler);

export const config = {
    api: {
        bodyParser: false
    }
}