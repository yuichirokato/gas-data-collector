class CoinPrice {
    constructor(public symbol: string, public usd: number, public jpy: number, public eur: number, public cny: number, public gbp: number) {
        this.symbol = symbol;
        this.usd = usd;
        this.jpy = jpy;
        this.eur = eur;
        this.cny = cny;
        this.gbp = gbp;
    }

    static fromJson(symbol: string, json: any): CoinPrice {
        return new CoinPrice(
            symbol,
            json.USD,
            json.JPY,
            json.EUR,
            json.CNY,
            json.GBP
        );
    }

    toJson(): { symbol: string, usd: number, jpy: number, eur: number, cny: number, gbp: number } {
        return {
            symbol: this.symbol,
            usd: this.usd,
            jpy: this.jpy,
            eur: this.eur,
            cny: this.cny,
            gbp: this.gbp
        };
    }

    static empty(): CoinPrice {
        return new CoinPrice('', 0, 0, 0, 0, 0);
    }
}

export default CoinPrice;