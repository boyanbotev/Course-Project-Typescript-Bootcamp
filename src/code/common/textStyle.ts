import { TextStyle } from "pixi.js";

export const textStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 30,
    dropShadow: true,
    dropShadowColor: "#c56d6d",
    dropShadowDistance: 0.2,
    dropShadowBlur: 1,
    fill: 0xffff99,
    lineJoin: "round",
    stroke: "0x662233",
    strokeThickness: 3,
    align: "center",
    fontWeight: "900",
    letterSpacing: 5,
});

export const bigTextStyle = new TextStyle({
    ...textStyle,
    fontSize: 96,
    dropShadowDistance: 5,
    letterSpacing: 10,
    fill: [
        0xffff99, 
        0xffff99, 
        0x662233, 
        0xffcc66
    ],
    fillGradientStops: [
        0.2,
        0.4,
        0.6
    ],
});