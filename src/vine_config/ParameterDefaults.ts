import { direction, settings, corner } from './parameter_types';

let ParameterDefaults: settings = {
    vine: {
        timing: {
            autoStart: true,
            delay: 1,
            duration: 10
        },
        direction: direction.CCW,
        girth: 15,
        numOfSides: 2,
        numCurvesPerSide: 2,
        plantAt: {x:window.innerWidth - 200,
                  y:window.innerHeight - 200 },
        startCorner: corner.Bottom_Right,
        height: window.innerHeight + 100,
        width: window.innerWidth - 210,
        flex: 100,
        stalkChance: 50
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