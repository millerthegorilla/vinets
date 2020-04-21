import { coord, vineOrientation, vineBezCalcResult } from '../__types__/vine_types';
import FlowerBed from './FlowerBed';

export namespace Calculations {

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
						girth:number, flowerBed:FlowerBed,
						p2d:Path2D, segmentNum:number) : coord 
	{
		let p = bezier(time, controlPoints[segmentNum].plist);
		flowerBed.ctx!.lineWidth = girth as number;
		p2d.lineTo(p.x, p.y);
		FlowerBed.ctx.stroke(p2d);
		return p;	
	}

	export function plotSine(time:number, orientation:vineOrientation, left:number, 
		     		  top:number, height:number, width:number, numOfCurves:number, 
		     		  flex:number, p2d:Path2D)
	{
		let x:number = 0;
		let y:number = 0;

		switch (orientation)
		{
			case vineOrientation.Left:
			{
				x = left! + width! - (width! * time);
				y = flex! * Math.sin((x * Math.PI) / (width! / numOfCurves!)) + top! + flex!;
				x += flex! + left!;
				// derived formula using desmos
				break;
			}
			case vineOrientation.Right:
			{
				x = left! + (width! * time);
				y = flex! * Math.sin((x * Math.PI) / (width! / numOfCurves!));
				break;
			}
			case vineOrientation.Up:
			{
				y = top! + height! - (height! * time);
				x = flex! * Math.sin((y * Math.PI) / (height! / numOfCurves!));
				break;
			}
			case vineOrientation.Down:
			{
				y = top! + (height! * time);
				x = flex! * Math.sin((y * Math.PI) / (height! / numOfCurves!));
				break;
			}

		}
		p2d.lineTo(x,y);
		FlowerBed.ctx.stroke(p2d);
		return {x:x, y:y};
	}
}