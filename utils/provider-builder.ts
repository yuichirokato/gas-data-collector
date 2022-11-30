import { ethers } from "ethers";
import GasDataCollectError from "../entities/gas-data-collect-error";

const BuilderConfig = {
    mainnet: {
        url: 'https://eth-mainnet.g.alchemy.com/v2/',
        apiKey: process.env.MAINNET_ALCHEMY_API_KEY || '',
        name: 'Ethereum Mainnet'
    },
    goerli: {
        url: 'https://eth-goerli.g.alchemy.com/v2/',
        apiKey: process.env.ALCHEMY_API_KEY || '',
        name: 'Ethereum Goerli'
    }
};

class ProviderBuilder {
    constructor() {};

    buildFromConfig(config: any): ethers.providers.JsonRpcProvider {
        if (config.apiKey === '') {
            throw new GasDataCollectError(`${config.name} Api Key is empty.`, 500);
        }

        const url = `${config.url}${config.apiKey}`;
        return new ethers.providers.JsonRpcProvider(url);
    }
}

export {
    BuilderConfig,
    ProviderBuilder
};