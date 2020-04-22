import React from 'react';
import './Garden.css';
import { Html } from '../vine_config/Parameters'; 
import FlowerBed from './FlowerBed';

class Garden extends React.Component {
	flowerBed:FlowerBed;
	constructor (props:object) {
		super(props);
		this.flowerBed = new FlowerBed();
	};

	digFlowerBed() {
		this.flowerBed.dig();
		this.flowerBed.plant();
	}

	render() { return <canvas id="garden" height={Html.gardenHeight as number} width={Html.gardenWidth as number} className={ Html.container } /> };

}

export default Garden;