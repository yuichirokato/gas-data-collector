import { Redis } from '@upstash/redis/with-fetch';
import { MAX_DATA_COUNT } from "../utils/constants";
import FeeInfo from "../entities/feeinfo";
import { ProviderWrapper } from '../utils/provider-wrapper';

class GasDataCollecter {
    private redisKey: string;
    private wrapper: ProviderWrapper

    constructor(redisKey: string, wrapper: ProviderWrapper) {
        this.redisKey = redisKey;
        this.wrapper = wrapper;
    }

    async collectGasData(): Promise<FeeInfo> {
        const feeInfo = await this.wrapper.fetchGasData();
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