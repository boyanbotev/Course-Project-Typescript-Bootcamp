import { Container, IDestroyOptions, Ticker } from "pixi.js";
import { BigText } from "../ui/text/bigText";
import { Manager } from "../../common/manager";
import { gsap } from "gsap";

export class Title extends BigText {

    private ticker: Ticker; 
    constructor(parent: Container, text: string) {
        super(parent);

        this.position.x = Manager.Width / 2;
        this.position.y = Manager.Height / 7;
        this.text = text;
        this.style.fillGradientStops = [0.2, 0.58, 0.78, 0.98];
    }

    public animateTitleDown(finalYOffset: number, ease: any, duration: number) {
        gsap.to(this, { y: Manager.Height + finalYOffset, ease: ease, duration: duration*1.1 });
        gsap.to(this, { alpha: 0, ease: ease, duration: duration * 1.5  });

        this.ticker = Ticker.shared;
        this.ticker.add(this.updateGradientText, this);
    }

    private updateGradientText() {
        const stops = this.style.fillGradientStops;
        const i = 0.003;

        const stop0 = stops[0];
        let stop1 = stops[1] - i;

        let stop2 = stops[2] - i;

        let stop3 = stops[3] - i;

        if (stop1 < 0) {
            stop1 = 0.8;
            stop2 = 1;
            stop3 = 1.2;
        }

        this.style.fillGradientStops = [stop0, stop1, stop2, stop3];
    }

    destroy(options?: boolean | IDestroyOptions): void {
        this.ticker.remove(this.updateGradientText, this);
    }
}
        