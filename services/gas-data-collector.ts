import { Redis } from '@upstash/redis/with-fetch';
import { ethers } from "ethers";
import { MAX_DATA_COUNT } from "../utils/constants";
import FeeInfo from "../entities/feeinfo";
import { BuilderConfig, ProviderBuilder } from '../utils/provider-builder';
import build from 'next/dist/build';

class GasDataCollecter {
    private redisKey: string;
    private builderConfig: any;

    constructor(redisKey: string, builderConfig: any) {
        this.redisKey = redisKey;
        this.builderConfig = builderConfig;
    }

    async collectGasData(): Promise<FeeInfo> {
        const provider = new ProviderBuilder().buildFromConfig(this.builderConfig);
        const feeHistory = await provider.send('eth_feeHistory', [1, "latest", [20, 50, 80]]);
        const feeInfo = new FeeInfo(
            Number(feeHistory.oldestBlock), 
            new Date().setUTCMinutes(0, 0, 0),
            Number(feeHistory.baseFeePerGas[0]),
            feeHistory.reward[0].map((s: any) => Number(s))
        );

        const redis = Redis.fromEnv();
        const lastFeeInfo = await redis.lindex(this.redisKey, 0);
        const lastTime = lastFeeInfo === null ? 0 : lastFeeInfo.time;

        if (lastTime !== feeInfo.time) {
            await redis.lpush(this.redisKey, feeInfo);
            await redis.ltrim(this.redisKey, 0, MAX_DATA_COUNT - 1);
        }

        return feeInfo
    }
}

export default GasDataCollecter;