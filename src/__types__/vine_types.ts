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
	Right = 0,
	Up,
	Left,	
	Down,
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