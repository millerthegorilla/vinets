/// <reference path="./@types/flower/index.d.ts" />
import { coord, vineOrientation, vineBezCalcResult } from '../__types__/vine_types'
import { stalk } from '../__types__/parameter_types';
import { plotBezier, calcStalkBezierControlPoints } from './Calculations';
import gsap from 'gsap';
import FlowerBed from './FlowerBed';
declare var flowerlib:any;

export default class VineStalk {
	orientation:vineOrientation;
	stalkParams:stalk;
	p2d:Path2D;
	controlPoints:Array<vineBezCalcResult>;
	segmentNum:number;
	timeline:GSAPTimeline;
	girth:number;
	currentPoint:coord;
	flower:any;

	constructor(duration:number, timeline?:GSAPTimeline, 
				stalkParams?:stalk, startPos?:coord, 
				vineOrient?:vineOrientation, vineP2d?:Path2D)
	{
		this.orientation = vineOrient as vineOrientation;
		this.currentPoint = startPos as coord;
		this.stalkParams = stalkParams as stalk;
		this.segmentNum = 0;
		this.controlPoints = new Array<vineBezCalcResult>();
		let timeline_params:object = {duration: duration, onUpdate: () => { this.update(); }, onComplete: () => { this.complete(); } }
		this.timeline = gsap.timeline(timeline_params);
		this.controlPoints[this.segmentNum] = calcStalkBezierControlPoints(this.orientation, 
																		   this.stalkParams.lengthMax as number,
																		   this.stalkParams.lengthMin as number,
																		   this.stalkParams.numCurvesMax as number,
																		   this.stalkParams.flexMax as number, 
																		   this.currentPoint);
		this.girth = Math.random() * (stalkParams!.girthMax! - 1) + 1;
		this.p2d = new Path2D();
		if (vineP2d !== undefined)
		{
			vineP2d!.addPath(this.p2d!);
		}
		this.play();
	}

	play()
	{
		this.p2d.moveTo(this.currentPoint.x, this.currentPoint.y);
		this.girth = Math.round(Math.random() * ((this.stalkParams!.girthMax as number) - 1) + 1);
		this.timeline!.time(0);
		this.timeline!.play();
	}

	complete() 
	{
		this.flower = flowerlib.flower(this.currentPoint.x, this.currentPoint.y, FlowerBed.ctx);
		this.flower.draw();
		this.timeline = gsap.timeline({duration:2, 
									   onUpdate:()=> (this.flower.update(), this.flower.draw()),
									   onComplete:()=>this.flowerGrown()});
	}

	update()
	{
		// here will be used later for flower.
		this.currentPoint = plotBezier(this.timeline!.progress(), this.controlPoints, this.girth,
							  		   this.p2d, this.segmentNum);
	}

	flowerGrown()
	{
		//console.log("flowered");
	}
}