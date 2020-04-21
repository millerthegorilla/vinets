import { coord, vineOrientation, vineBezCalcResult } from '../__types__/vine_types'
import { stalk } from '../__types__/parameter_types';
import { Calculations } from './Calculations';

export default class VineStalk {
	orientation:vineOrientation;
	startPos:coord;
	stalkParams:stalk;
	p2d:Path2D;
	controlPoints:Array<vineBezCalcResult>;
	segmentNum:number;
	timeline:GSAPTimeline;
	girth:number;

	constructor(duration:number, timeline?:GSAPTimeline, 
				stalkParams?:stalk, startPos?:coord, 
				vineOrient?:vineOrientation, vineP2d?:Path2D)
	{
		this.orientation = vineOrient as vineOrientation;
		this.startPos = startPos as coord;
		this.stalkParams = stalkParams as stalk;
		this.segmentNum = 0;
		this.controlPoints = new Array<vineBezCalcResult>();
		let timeline_params:object = {duration: duration, onUpdate: () => { this.update(); }, onComplete: () => { this.complete(); } }
		this.timeline = gsap.timeline(timeline_params);
		this.controlPoints[this.segmentNum] = VineStalk.calcStalkBezierControlPoints(this.orientation, 
																					 this.stalkParams.lengthMax as number,
																					 this.stalkParams.lengthMin as number,
																					 this.stalkParams.numCurvesMax as number,
																					 this.stalkParams.flexMax as number, 
																					 this.startPos);
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
		this.p2d.moveTo(this.startPos!.x, this.startPos!.y);
		//FlowerBed.ctx.lineTo(this.startPos!.x, this.startPos!.y);
		this.girth = Math.round(Math.random() * ((this.stalkParams!.girthMax as number) - 1) + 1);
		this.timeline!.time(0);
		this.timeline!.play();
	}

	complete() 
	{

	}

	update()
	{
		// here will be used later for flower.
		let here = Calculations.plotBezier(this.timeline!.progress(), this.controlPoints, this.girth,
										   this.flowerBed, this.p2d, this.segmentNum);
	}


	public static calcStalkBezierControlPoints(orientation:vineOrientation, stalkLengthMax:number,
												stalkLengthMin:number, stalkNumCurvesMax:number,
												stalkFlexMax:number, startPos:coord): vineBezCalcResult
	{
		//switch vineOrientation
		let length:number;
		let plist:Array<coord> = [startPos];
		let direction:vineOrientation;
		// could use a ternary but legibility would suffer
		switch (orientation)
		{
			case vineOrientation.Up:
			case vineOrientation.Down:
			{
				direction = Math.round(Math.random());
				break;
			}
			case vineOrientation.Left:
			case vineOrientation.Right:
			{
				direction = Math.round(Math.random() + 2);
				break;
			}
		}
		length = Math.round(Math.random() * ((stalkLengthMax as number) - (stalkLengthMin as number)) 
										  + (stalkLengthMin as number));
		let numOfCurves:number = Math.round(Math.random() * ((stalkNumCurvesMax as number) - 1) + 1);
		let len:number = length / numOfCurves;
		let flexmin = () => { return Math.round(Math.random() * ((stalkFlexMax as number) / 2 - 1) + 1)};
		let flexmax = () => { return Math.round(Math.random() * ((stalkFlexMax as number) - flexmin()) + flexmin())};
		//let flexmax = () => { return 30 };
		switch (direction)
		{
			case vineOrientation.Up:
			{
				for (let i = 1; i <= numOfCurves; i++)
				{   //try this for the mo.
					plist.push({x:(i%2 ? startPos.x - flexmax() : startPos.x + flexmax()), y:startPos.y + i * len});
				}
				plist.push({x:startPos.x, y:startPos.y + length})
				break;
			}
			case vineOrientation.Down:
			{
				for (let i = 1; i <= numOfCurves; i++)
				{   //try this for the mo.
					plist.push({x:(i%2 ? startPos.x - flexmax() : startPos.x + flexmax()), y:startPos.y - i * len});
				}
				plist.push({x:startPos.x, y:startPos.y - length})
				break;
			}
			case vineOrientation.Left:
			{
				for (let i = 1; i <= numOfCurves; i++)
				{   //try this for the mo.
					plist.push({x:startPos.x - i * len, y:(i%2 ? startPos.y + flexmax() : startPos.y - flexmax())});
				}
				plist.push({x:startPos.x - length, y:startPos.y})
				break;
			}
			case vineOrientation.Right:
			{
				for (let i = 1; i <= numOfCurves; i++)
				{   //try this for the mo.
					plist.push({x:startPos.x + i * len, y:(i%2 ? startPos.y - flexmax() : startPos.y + flexmax())});
				}
				plist.push({x:startPos.x + length, y:startPos.y});
				break;
			}
			default:
			{
				throw new Error("eh? stalkOrientation has reached default switch");
			}
		}
		return  {plist, orientation}
	}
}