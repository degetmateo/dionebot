import { T_VN } from "../vndbTypes";

export default class VN {
    private data: T_VN;

    constructor (vn: T_VN) {
        this.data = vn;
    };

    public getId () {
        return this.data.id || null;
    };

    public getSafeScreenshots () {
        if (!this.data.screenshots || this.data.screenshots.length <= 0) return [];

        return this.data.screenshots.filter(screenshot => 
            screenshot.sexual === 0 && screenshot.violence === 0
        );
    };
};