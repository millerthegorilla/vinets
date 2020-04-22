import gsap from 'gsap';
import VineStalk from './VineStalk';
import FLowerBed from './FlowerBed';
import { MAXSTALKCHANCE, vineOrientation, 
		 corner, direction, 
		 coord } from '../__types__/vine_types';
import { settings, stalk } from '../__types__/parameter_types';
import { plotSine } from './Calculations';
export default class Vine {
	stalks:Array<VineStalk>;
	numOfSides:number;
	stalk:stalk;
	direction:direction;
	stalkChance:number;
	stalkTimeMin:number;
	stalkTimeMax:number;
	p2d:Path2D;
	timeline:GSAPTimeline;
	girth:number;
	segmentNum:number;
	segmentDuration:number;
	top:number;
	left:number;
	width:number;
	height:number;
	flex:number;
	numOfCurves:number;
	startPos?:coord;
	orientation?:vineOrientation;
	points:Array<coord>;


	constructor(parameters:settings)
	{	
		let segmentDuration:number = Math.round((parameters.vine!.timing!.duration as number) 
													/ (parameters.vine!.numOfSides as number));

		this.top = parameters.vine!.top as number;
		this.left = parameters.vine!.left as number;
		this.height = parameters.vine!.height as number;
		this.width = parameters.vine!.width as number;
		this.direction = parameters.vine!.direction as direction; // and this doesn't?
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
		//calculate startpos and orientation
		switch (parameters.vine!.startCorner)
		{
			case corner.Bottom_Left:
			{
				this.startPos = {x:this.left, y:this.top + this.height};
				this.direction === direction.CCW ? this.orientation = vineOrientation.Right
												 : this.orientation = vineOrientation.Up;
				break;
			}
			case corner.Bottom_Right:
			{
				this.startPos = {x:this.left + this.width, y:this.top + this.height};
				this.direction === direction.CCW ? this.orientation = vineOrientation.Up
												 : this.orientation = vineOrientation.Left;
				break;
			}
			case corner.Top_Left:
			{
				this.startPos = {x:this.left, y: this.top};
				this.direction === direction.CCW ? this.orientation = vineOrientation.Down
												 : this.orientation = vineOrientation.Right;
				break;
			}
			case corner.Top_Right:
			{
				this.startPos = {x:this.left + this.width, y:this.top};
				this.direction === direction.CCW ? this.orientation = vineOrientation.Left
												 : this.orientation = vineOrientation.Down;
				break;
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
		let here = plotSine(this.timeline!.progress(), this.orientation!, this.left!, this.top!,
							this.height!, this.width!, this.numOfCurves!, this.flex!, this.p2d!, this.direction);
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