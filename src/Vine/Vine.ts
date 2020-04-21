import gsap from 'gsap';
import VineStalk from './VineStalk';
import FLowerBed from './FlowerBed';
import { MAXSTALKCHANCE, vineOrientation, 
		 corner, direction, 
		 coord, RAND } from '../__types__/vine_types';
import { settings, html, stalk } from '../__types__/parameter_types';
import { Html } from '../vine_config/Parameters';
import { Calculations } from './Calculations';
export default class Vine {
	stalks:Array<VineStalk>;
	numOfSides:number;
	stalk:stalk;
	startCorner:corner;
	direction:direction;
	stalkChance:number;
	stalkTimeMin:number;
	stalkTimeMax:number;
	startPos:coord;
	p2d:Path2D;
	timeline:GSAPTimeline;
	girth:number;
	segmentNum:number;
	segmentDuration:number;
	orientation:vineOrientation;
	top:number;
	left:number;
	width:number;
	height:number;
	flex:number;
	numOfCurves:number;
	delta:number;
	points:Array<coord>;


	constructor(parameters:settings)
	{	
		let segmentDuration:number = Math.round((parameters.vine!.timing!.duration as number) 
													/ (parameters.vine!.numOfSides as number));
		this.startPos = parameters.vine!.plantAt as coord;
		this.height = parameters.vine!.height as number;
		this.width = parameters.vine!.width as number;
		this.startCorner = parameters.vine!.startCorner as corner; // why does this include string...
		this.direction = parameters.vine!.direction; // and this doesn't?
		this.segmentDuration = segmentDuration;
		this.flex = parameters.vine!.flex as number;
		this.numOfSides = parameters.vine!.numOfSides as number;
		this.numOfCurves = parameters.vine!.numCurvesPerSide as number;
		this.girth = parameters.vine!.girth as number;
		this.stalk = parameters.stalk as stalk;
		this.stalks = new Array<VineStalk>();
		this.stalkChance = parameters.vine!.stalkChance as number;
		this.stalkTimeMax = parameters.stalk!.timeMax as number;
		this.stalkTimeMin = parameters.stalk!.timeMin as number;
		this.points = new Array<coord>();
		this.segmentNum = 0;
		this.timeline = gsap.timeline({onUpdate: () => { this.update(); }, onComplete: () => { this.complete(); } });
		this.p2d = new Path2D();

		// calculate which side for delta
		switch (this.startCorner)
		{
			case corner.Top_Left:
			{
				this.top = this.startPos.y;
				this.left = this.startPos.x;
				this.direction === direction.CCW ? this.orientation = vineOrientation.Down
												: this.orientation = vineOrientation.Right;
				break;
			}
			case corner.Bottom_Left:
			{
				this.top = this.startPos.y - this.height!;
				this.left = this.startPos.x;
				this.direction === direction.CCW ? this.orientation = vineOrientation.Right
												: this.orientation = vineOrientation.Up;
				break;
			}
			case corner.Bottom_Right:
			{
				this.top = this.startPos.y - this.height!;
				this.left = this.startPos.x - this.width!;
				this.direction === direction.CCW ? this.orientation = vineOrientation.Up
												: this.orientation = vineOrientation.Left;
				break;
			}
			case corner.Top_Right:
			{
				this.top = this.startPos.y;
				this.left = this.startPos.x - this.width!;
				this.direction === direction.CCW ? this.orientation = vineOrientation.Left
												: this.orientation = vineOrientation.Down;
				break;
			}
		}
		switch (this.orientation)
		{
			case vineOrientation.Up:
			case vineOrientation.Down:
			{
				this.delta = (1 / this.segmentDuration);
				break;
			}
			case vineOrientation.Left:
			case vineOrientation.Right:
			{
				this.delta = (1 / this.segmentDuration);
			}
		}
		if (parameters.vine!.timing!.autoStart as boolean) this.play();
	}

	play() 
	{
		FLowerBed.ctx.beginPath();
		this.timeline!.play();
	}

	pause()
	{
		this.timeline!.pause();
	}

	update()
	{  
		let here = Calculations.plotSine(this.timeline!.progress(), this.orientation!, this.left!, this.top!,
										 this.height!, this.width!, this.numOfCurves!, this.flex!, this.p2d!);
		// if ((Math.floor(Math.random() * MAXSTALKCHANCE)) < (this.stalkChance as number))
		// {
		// 	let duration = Math.random() * (this.stalkTimeMax as number) 
		// 							- (this.stalkTimeMin as number) 
		// 							+ (this.stalkTimeMin as number);
		// 	this.stalks.push(new VineStalk(duration, this.timeline, this.stalk, here, this.orientation, this.p2d));
		// }
	}

	complete()
	{
		this.timeline!.pause();
		if(this.segmentNum! < (this.numOfSides as number))
		{
			this.direction === direction.CCW ? this.orientation = (this.orientation! + 1) % 3
											: this.orientation = this.orientation! - 1;
			if (this.orientation < 0) this.orientation = 3;
			// switch (this.orientation)
			// {
			// 	case vineOrientation.Up:
			// 	case vineOrientation.Down:
			// 	{
			// 		this.delta = 1 / this.height!;
			// 		break;
			// 	}
			// 	case vineOrientation.Left:
			// 	case vineOrientation.Right:
			// 	{
			// 		this.delta = 1 / this.width!;
			// 	}
			// }
			this.timeline = gsap.timeline({duration:this.segmentDuration, 
										   onUpdate:()=>this.update(),
										   onComplete:()=>this.complete()});
			this.segmentNum! += 1;
			this.timeline.play();
		}
		else
		{
			this.timeline!.pause();
		}
	}
}