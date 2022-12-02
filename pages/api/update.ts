import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import GasDataCollecter from "../../services/gas-data-collector";
import { BuilderConfig, ProviderBuilder } from "../../utils/provider-builder";
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

    const builder = new ProviderBuilder();
    const collecters = configs
        .map(config => [config.redisKey, builder.buildFromConfig(config.providerConfig)])
        .map((pair: any) => new GasDataCollecter(pair[0], pair[1]));

    try {
        await Promise.all(collecters.map(collecter => collecter.collectGasData()));
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