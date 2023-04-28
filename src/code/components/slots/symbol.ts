import { Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import { Symbol, SymbolState, Reel } from "../../common/types";
import { pulseSizeMultiplier, baseTweenDuration, symbolIndexMultiplier, standardSymbolSize } from "../../common/consts";

export class PIXISymbol extends Sprite implements Symbol {
    private readonly symbolSize: number = 0;
    private readonly endPoint: number = 500;
    private velocity: number = 0;
    private readonly reel: Reel;

    private currentState: SymbolState = SymbolState.Idle;
    private symbolIndex: number;

    private currentAnimation: gsap.core.Tween | null = null;

    constructor(
        symbolSize: number,
        endMargin: number,
        reel: Reel
    ) {
        super();

        this.symbolSize = symbolSize;
        this.width = this.symbolSize;
        this.height = this.symbolSize;

        this.endPoint = endMargin;
        this.reel = reel;
    }

    public update(delta: number): void {
        if (this.currentState === SymbolState.Idle || this.currentState === SymbolState.Stopping) {
            return;
        }

        this.y += delta * this.velocity;

        this.y = (this.y % this.endPoint);

        this.handleWrap();  
    }

    /** 
     * Checks if y is very small, because checking if 0 will not work
     * Swap texture to wrap around reel
     */
    private handleWrap() {
        const wrapThreshold = 70;
        if (this.y <= wrapThreshold) {

            switch (this.currentState) {
                case SymbolState.PreparingToStop:
                    this.velocity = 0;
                    this.currentState = SymbolState.Stopping;
    
                    this.tweenToStop();
    
                    // If symbol is not the last (extra) one, set texture to final symbol
                    if (this.symbolIndex-1 !== this.reel.ReelLength-1){
                        this.texture = this.getFinalSymbol();
                    }
                    break;
                default:
                    this.texture = this.reel.getRandomTexture();
                    break;
            }
        }
    }

    /** 
     * Make animations duration shorter the later in the reel they start to make symbols move at same speed
     * Difference in duration betwen indexes flexible given symbol size
     * Smaller symbolsize means smaller difference in duration 
     */
    private tweenToStop() {
        this.symbolIndex = this.reel.incrementSymbolIndex(); // is there another way of cooridnating reel and symbol?
        
        const duration = baseTweenDuration - (this.symbolIndex * symbolIndexMultiplier * (this.symbolSize / standardSymbolSize));
        const targetY = this.endPoint - (this.symbolSize * this.symbolIndex);

        gsap.registerPlugin(CustomEase);

        gsap.to(this, { y: targetY, duration: duration, onComplete: () => {
            this.currentState = SymbolState.Idle;
        }});
    }

    /** 
     * Center anchor point to make scaling easier, set alpha and start animation
     * If there are multiple paylines, we want winning symbols to be darker when they are not highlighted
     */
    public initializePulse(payline: number, paylineLength: number) {
        this.anchor.set(0.5, 0.5);
        this.x += this.width/2;
        this.y += this.height/2;

        this.alpha = paylineLength > 1 ? 0.2 : 0.6; 

        this.createPulseAnim(payline, paylineLength);
    }

    private createPulseAnim(payline: number, paylineLength: number) {
        gsap.registerPlugin(CustomEase);
        const customEase = CustomEase.create("custom", "M0,0 C0.29,0.028 0.44,-0.084 0.66,0.182 0.827,0.384 0.756,1.042 1,1 ");
        
        /*
        Slightly increase duration of animation when there are more paylines
        Delay the start of the animation for each payline 
        so we see each payline one after another
        */
        const duration = 1 + (paylineLength/6);
        const startTimeDelay = (payline / paylineLength) * 2;

        /*
        Choose custom ease function for paylines after the first one
        It starts slowly and rapidly rises at the end
        We keep standard ease for the first payline, so the animation can start immediately
        */
        const hasStandardEase: boolean = startTimeDelay === 0;

        /* 
        We use yoyoEase for the first payline when there are many paylines
        Yoyo ease makes the animation spend more time on the start value (darkened) 
        */
        const hasYoyoEase: boolean = paylineLength > 1 && startTimeDelay === 0;

        const ease = hasStandardEase ? undefined : customEase;

        const animation = gsap.to(
            this, { 
                width: this.symbolSize * pulseSizeMultiplier, 
                height: this.symbolSize * pulseSizeMultiplier, 
                alpha: 1,
                duration: duration, 
                yoyo: true, 
                delay: startTimeDelay,
                repeat: Infinity, 
                ease: ease,
                yoyoEase: hasYoyoEase,
                onComplete: () => {
                    this.currentState = SymbolState.Idle;
                }
        });

        this.currentAnimation = animation;
    }

    public darken() {
        this.alpha = 0.5;
        this.tint = 0x888888;
    }

    public reset() {
        this.width = this.symbolSize;
        this.height = this.symbolSize;

        this.currentAnimation?.kill();

        if (this.anchor.x !== 0) {
            this.anchor.set(0, 0);
            this.x -= this.width/2;
            this.y -= this.width/2;
        }
        
        this.alpha = 1;
        this.tint = 0xFFFFFF;
    }

    private getFinalSymbol(): Texture {
        return this.reel.FinalSymbol; // Could this be done by reel to symbol? like a set instead of a get?
    }
    
    public set Velocity(velocity: number) {
        this.velocity = velocity;
    }

    public get State(): SymbolState {
        return this.currentState;
    }

    public set State(state: SymbolState) {
        this.currentState = state;
    }

    public set SymbolIndex(index: number) {
        this.symbolIndex = index;
    }

    public get SymbolIndex(): number {
        return this.symbolIndex;
    }
}
