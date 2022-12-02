import fetch from "cross-fetch";
import CoinPrice from "../entities/coinprice";

class CoinPriceFetcher {
    private symbol: string;

    constructor(symbol: string) {
        this.symbol = symbol;
    }
    
    async fetch(): Promise<CoinPrice | null> {
        if (this.symbol.includes(' ')) {
            return null;
        }

        const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${this.symbol}&tsyms=USD,EUR,CNY,JPY,GBP`);

        if (response.ok) {
            const json = await response.json();
            console.log(`json: ${JSON.stringify(json)}`);
            return CoinPrice.fromJson(this.symbol, json);
        }
    
        return null;
    }
}

export default CoinPriceFetcher;
