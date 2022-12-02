import fetch from "cross-fetch";
import { ethers } from "ethers";
import FeeInfo from "../entities/feeinfo";
import CoinPriceFetcher from "../services/coin-price-fetcher";

interface ProviderWrapper {
    fetchGasData(): Promise<FeeInfo>
}

class EtherProviderWrapper implements ProviderWrapper {
    private provider: ethers.providers.JsonRpcProvider;
    private symbol: string;

    constructor(provider: ethers.providers.JsonRpcProvider, symbol: string) {
        this.provider = provider;
        this.symbol = symbol;
    }

    async fetchGasData(): Promise<any> {
        const feeHistory = await this.provider.send('eth_feeHistory', [1, "latest", [20, 50, 80]]);
        const coinPrice = await new CoinPriceFetcher(this.symbol).fetch();

        const now = new Date();
        const minute = now.getMinutes() >= 30 ? 30 : 0;

        const feeInfo = new FeeInfo(
            Number(feeHistory.oldestBlock), 
            now.setUTCMinutes(minute, 0, 0),
            Number(feeHistory.baseFeePerGas[0]),
            feeHistory.reward[0].map((s: any) => Number(s))
        );

        let feeObject: any = feeInfo.toJson();
        feeObject['coinPrice'] = coinPrice?.toJson();

        return feeObject;
    }
}

class PolygonProviderWrapper implements ProviderWrapper {
    private symbol: string;

    constructor(symbol: string) {
        this.symbol = symbol;
    }
    
    async fetchGasData(): Promise<any> {
        const response = await fetch('https://gasstation-mainnet.matic.network/v2');
        const jsonData = await response.json();
        const coinPrice = await new CoinPriceFetcher(this.symbol).fetch();

        console.log(`json: ${JSON.stringify(jsonData)}`);

        const now = new Date();
        const minute = now.getMinutes() >= 30 ? 30 : 0;

        const feeInfo = new FeeInfo(
            jsonData.blockNumber,
            now.setUTCMinutes(minute, 0, 0),
            jsonData.estimatedBaseFee * 10 ** 9,
            [
                jsonData.safeLow.maxPriorityFee * 10 ** 9,
                jsonData.standard.maxPriorityFee * 10 ** 9,
                jsonData.fast.maxPriorityFee * 10 ** 9
            ]
        );
        
        let feeObject: any = feeInfo.toJson();
        feeObject['coinPrice'] = coinPrice?.toJson();

        return feeObject;
    }
}

export type { ProviderWrapper };

export {
    EtherProviderWrapper,
    PolygonProviderWrapper
}
