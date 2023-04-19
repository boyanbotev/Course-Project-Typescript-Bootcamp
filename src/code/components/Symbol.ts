import { Sprite, Texture, Filter } from "pixi.js";
import { Reel } from "./Reel";
import { SymbolState } from "../common/types";
import { gsap } from "gsap";
import { CustomEase } from "gsap/all";

export class Symbol extends Sprite {
    private symbolSize: number = 0;
    private endPoint: number = 500;
    private velocity: number = 0;
    private reel: Reel;

    private currentState: SymbolState = SymbolState.Idle;
    private symbolIndex: number;

    private currentAnimation: gsap.core.Tween | null = null;

    constructor(
        symbolSize: number,
        endMargin: number,
        reel: Reel
    ) {
        super();
        reel.addChild(this);

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
        const wrapThreshold = 16;
        if (this.y <= wrapThreshold) {

            switch (this.currentState) {
                case SymbolState.PreparingToStop:
                    this.velocity = 0;
                    this.currentState = SymbolState.Stopping;
    
                    this.initializeTween();
    
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
    private initializeTween() {
        this.symbolIndex = this.reel.incrementSymbolIndex();

        const standardSymbolSize = 165;
        const baseDuration = 0.6;
        const xPositionMultiplier = 0.09;

        const duration = baseDuration - (this.symbolIndex * xPositionMultiplier * (this.symbolSize / standardSymbolSize));
        const targetY = this.endPoint - (this.symbolSize * this.symbolIndex);

        gsap.registerPlugin(CustomEase);

        gsap.to(this, { y: targetY, duration: duration, onComplete: () => {
            this.currentState = SymbolState.Idle;
        }});
    }

    public highlight(payline: number, paylineLength: number) {
        this.anchor.set(0.5, 0.5);
        this.x += this.width/2;
        this.y += this.height/2;

        const alphaValue = paylineLength > 1 ? 0.2 : 0.6;
        this.alpha = alphaValue;  
        
        this.currentState = SymbolState.Animating;

        const sizeMultiplier = 1.1;

        const duration = 1 + (paylineLength/6);
        const startTimeDelay = (payline / paylineLength) * 2;

        this.createHighlightAnimation(duration, sizeMultiplier, startTimeDelay, paylineLength);
    }

    private createHighlightAnimation(duration: number, sizeMultiplier: number, startTimeDelay: number, paylineLength: number) {
        gsap.registerPlugin(CustomEase);
        const customEase = CustomEase.create("custom", "M0,0 C0.29,0.028 0.44,-0.084 0.66,0.182 0.827,0.384 0.756,1.042 1,1 ");

        const isCustom: boolean = paylineLength > 1 && startTimeDelay > 0 ? false : true;
 
        const hasYoyoEase: boolean = paylineLength > 1 && startTimeDelay === 0 ? true : false;

        // TODO: refactor to be more mathematical and less based on if statements?

        const ease = !isCustom ? customEase : undefined;

        const animation = gsap.to(
            this, { 
                width: this.symbolSize * sizeMultiplier, 
                height: this.symbolSize * sizeMultiplier, 
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
        return this.reel.FinalSymbol;
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
