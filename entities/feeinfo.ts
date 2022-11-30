class FeeInfo {
    constructor(public block: number, public time: number, public base: number, public rewards: number) {
        this.block = block;
        this.time = time;
        this.base = base;
        this.rewards = rewards;
    }
};

export default FeeInfo;