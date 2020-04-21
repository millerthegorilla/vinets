export enum corner {
        Bottom_Right = 0,
        Top_Right,
        Top_Left,
        Bottom_Left
}

export enum direction {
        CCW = 0,
        CW
}

export enum vineOrientation {
	Left = 0,
	Down,
	Right,	
	Up,
}

export interface coord {
        x:number,
        y:number
}

export interface vineBezCalcResult { 
	plist:Array<coord>, 
	orientation:vineOrientation
}

export const MAXSTALKCHANCE = 100;
export const NUM_OF_CP_PER_CURVE = 4;
export type tRAND = string;
export const RAND:tRAND = "RAND";
export type seedPos = coord | tRAND;
export type cornerPos = corner | tRAND;
export type shape = number | Error
