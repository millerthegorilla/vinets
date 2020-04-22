import { direction, corner } from '../__types__/vine_types';
import { settings } from '../__types__/parameter_types';

let ParameterDefaults: settings = {
    vine: {
        timing: {
            autoStart: true,
            delay: 1,
            duration: 10
        },
    	top: 100,
    	left: 100,
        direction: direction.CCW,
        girth: 15,
        numOfSides: 4,
        numCurvesPerSide: 3,
        startCorner: corner.Bottom_Right,
        height: 500,
        width: 500,
        flex: 40,
        stalkChance: 10
    },
    stalk: {
        delay: 5,
        timeMax: 5,
        timeMin: 1,
        girthMax: 3,
        flexMax: 5,
        lengthMin: 2,
        lengthMax: 10,
        numCurvesMax: 4
    }
}

export default ParameterDefaults;