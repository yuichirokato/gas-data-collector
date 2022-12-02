import { ethers } from "ethers";
import GasDataCollectError from "../entities/gas-data-collect-error";
import { ProviderWrapper, PolygonProviderWrapper, EtherProviderWrapper } from "./provider-wrapper";

const BuilderConfig = {
    mainnet: {
        url: 'https://eth-mainnet.g.alchemy.com/v2/',
        apiKey: process.env.MAINNET_ALCHEMY_API_KEY || '',
        name: 'Ethereum Mainnet',
        symbol: 'ETH'
    },
    goerli: {
        url: 'https://eth-goerli.g.alchemy.com/v2/',
        apiKey: process.env.ALCHEMY_API_KEY || '',
        name: 'Ethereum Goerli',
        symbol: 'ETH Goerli'
    },
    polygon: {
        url: 'https://polygon-mainnet.g.alchemy.com/v2/',
        apiKey: process.env.POLYGON_ALCHEMY_API_KEY || '',
        name: 'Polygon Mainnet',
        symbol: 'MATIC'
    }
};

class ProviderBuilder {
    constructor() {};

    buildFromConfig(config: any): ProviderWrapper {
        if (config.apiKey === '') {
            throw new GasDataCollectError(`${config.name} Api Key is empty.`, 500);
        }

        if (config.name === 'Polygon Mainnet') {
            console.log("use polygon wrapper");
            return new PolygonProviderWrapper(config.symbol);
        } else {
            const url = `${config.url}${config.apiKey}`;
            const provider = new ethers.providers.JsonRpcProvider(url);
            return new EtherProviderWrapper(provider, config.symbol);
        }
    }
}

export {
    BuilderConfig,
    ProviderBuilder
};
