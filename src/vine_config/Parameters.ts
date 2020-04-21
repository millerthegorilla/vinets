import { settings, html } from './parameter_types';

// TODO the below should be const, but I use object.assign to push default values in.
// I should probably use typescript partial or similar
let Html:html = {
    container: "garden",
    zindex: 1,
    gardenHeight: window.innerHeight,
    gardenWidth: window.innerWidth
};

let parameters: Array<settings> = [
    {
    stalk: {
        delay: 3,
        timeMax: 5,
        timeMin: 1,
        girthMax: 3,
        flexMax: 50,
        lengthMin: 30,
        lengthMax: 60,
        numCurvesMax: 4
    }
	}];

export { Html, parameters };