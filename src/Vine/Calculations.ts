import { direction, coord, vineOrientation, vineBezCalcResult } from '../__types__/vine_types';
import FlowerBed from './FlowerBed';

/// could have made a singleton with static accessors to the functions, but namespace is probably sufficiently private,
/// and I don't think that there are any memory issues

	// the binom and bezier function below is from: 
	// https://stackoverflow.com/questions/31167663/how-to-code-an-nth-order-bezier-curve/31169371
	// from: http://rosettacode.org/wiki/Evaluate_binomial_coefficients#JavaScript
	// TODO public static to use less memory - is public keyword necessary on static keyword?
	export function binom(n:number, k:number) {
	  let coeff = 1;
	  for (let i = n - k + 1; i <= n; i++) coeff *= i;
	  for (let i = 1; i <= k; i++) coeff /= i;
	  return coeff;
	}

	// based on: https://stackoverflow.com/questions/16227300
	// TODO could use plist but safer to make copy and only operate on that.
	export function bezier(t:number, plist:Array<coord>):coord {
	  let order = plist.length - 1;

	  let y = 0;
	  let x = 0;

	  for (let i = 0; i <= order; i++) {
	    x = x + (binom(order, i) * Math.pow((1 - t), (order - i)) * Math.pow(t, i) * (plist[i].x));
	    y = y + (binom(order, i) * Math.pow((1 - t), (order - i)) * Math.pow(t, i) * (plist[i].y));
	  }

	  return {
	    x: x,
	    y: y
	  };
	}

	export function plotBezier(time:number, controlPoints:Array<vineBezCalcResult>, 
							   girth:number, p2d:Path2D, segmentNum:number) : coord 
	{
		let p = bezier(time, controlPoints[segmentNum].plist);
		FlowerBed.ctx!.lineWidth = girth as number;
		p2d.lineTo(p.x, p.y);
		FlowerBed.ctx.stroke(p2d);
		return p;	
	}

	export function plotSine(time:number, orientation:vineOrientation, left:number, 
		     		  		 top:number, height:number, width:number, numOfCurves:number, 
		     		  		 flex:number, p2d:Path2D, directn:direction, startPos:coord) : coord
	{
		let x:number = 0;
		let y:number = 0;

		// refactor this!
		switch (orientation)
		{
			case vineOrientation.Left:
			{
				directn === direction.CCW ? x = startPos.x - (width! * time) //implicitly startcorner.Top_Right
										  : x = startPos.x - (width! * time); // startcorner.Bottom_Right
				y = (Math.sin((x * Math.PI) / (width! / numOfCurves!)) * flex) + startPos.y - flex;
				// derived formula using desmos
				break;
			}
			case vineOrientation.Right:
			{
				directn === direction.CCW ? x = startPos.x + (width! * time) //startcorner.Bottom_Left
										  : x = startPos.x + (width! * time); //startcorner.Top_Left
				y = (flex! * Math.sin((x * Math.PI) / (width! / numOfCurves!))) + startPos.y - flex;
				break;
			}
			case vineOrientation.Up:
			{
				console.log("going up");
				directn === direction.CCW ? y = startPos.y - (height! * time) // startcorner.Bottom_Right
										  : y = startPos.y - (height! * time); //startcorner.Bottom_Left
				x = (flex! * Math.sin((y * Math.PI) / (height! / numOfCurves!))) + startPos.x - flex;
				break;
			}
			case vineOrientation.Down:
			{
				directn === direction.CCW ? y = startPos.y + (height! * time) //startcorner.Top_Left
										  : y = startPos.y + (height! * time); //startcorner.Top_Right
				x = (flex! * Math.sin((y * Math.PI) / (height! / numOfCurves!))) + startPos.x - flex;
				break;
			}

		}
		console.log(x + " : " + y);
		p2d.lineTo(x,y);
		FlowerBed.ctx.stroke(p2d);
		return {x:x, y:y};
	}

	export function calcStalkBezierControlPoints(orientation:vineOrientation, stalkLengthMax:number,
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