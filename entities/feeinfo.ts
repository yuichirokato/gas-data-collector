class FeeInfo {
    constructor(public block: number, public time: number, public base: number, public rewards: number[]) {
        this.block = block;
        this.time = time;
        this.base = base;
        this.rewards = rewards;
    }

    toJson(): { block: number, time: number, base: number, rewards: number[] } {
        return {
            block: this.block,
            time: this.time,
            base: this.base,
            rewards: this.rewards
        };
    }
};

export default FeeInfo;