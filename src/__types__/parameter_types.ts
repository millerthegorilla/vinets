import { direction, corner } from './vine_types';

export interface html {
        container?: string
        zindex?: number,
        gardenHeight?: number,
        gardenWidth?: number,
}

export interface timing {
            autoStart?: boolean,
            delay?: number,
            duration?: number
}

export interface vine {
        timing?: timing,
        top?: number,
        left?: number,
        direction?: direction,
        girth?: number,
        numOfSides?: number,
        numCurvesPerSide?: number,
        startCorner?: corner,
        height?: number,
        width?: number,
        flex?: number,
        stalkChance?: number
}

export interface stalk {
        delay?: number,
        timeMax?: number,
        timeMin?: number
        girthMax?: number,
        flexMax?: number,
        lengthMax?: number,
        lengthMin?: number,
        numCurvesMax?: number
}

export interface flower {
	stamenSize?: number,
	stamenColour?: number,
	petalSize?: number,
	petalColour?: number
}

export interface settings {
    vine?: vine,
    stalk?: stalk,
    flower? : flower
}
