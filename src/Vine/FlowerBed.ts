import { parameters } from '../vine_config/Parameters';
import ParameterDefaults from '../vine_config/ParameterDefaults'
import { settings } from '../__types__/parameter_types';
import Vine from './Vine';

export default class FlowerBed {
  public static canv:HTMLCanvasElement;
  public static ctx:CanvasRenderingContext2D;
  public static pattern:CanvasPattern;
  public static parameters:Array<settings>;
  ctx?:CanvasRenderingContext2D;
  image?:HTMLImageElement;
  timeline:any;
  timeline2:any;
  vines:Array<Vine>;

  constructor () {
  	this.image = undefined;
    this.ctx = FlowerBed.ctx;
    FlowerBed.parameters = new Array<settings>();
    for(var i of parameters){
      let j:settings = {} as settings;
      Object.assign(j, ParameterDefaults);
      Object.assign(j, i);
      FlowerBed.parameters.push(j);
    }
    this.vines = [];
  }

  dig() {
    FlowerBed.canv = document.getElementById("garden") as HTMLCanvasElement;
    FlowerBed.ctx = FlowerBed.canv.getContext("2d") as CanvasRenderingContext2D;
    this.image = document.getElementById("bark") as HTMLImageElement;
    if(this.ctx != null) {
        if (this.image) {
    			createImageBitmap(this.image).then((img)=> {
    				if (this.ctx != null) {
  		      		FlowerBed.pattern = this.ctx.createPattern(img, "repeat") as CanvasPattern;
  		      		this.ctx.strokeStyle = FlowerBed.pattern as CanvasPattern; }
  		    });
      }
  	}
  }

  plant() {
    for(let params of FlowerBed.parameters!)
    {
      this.vines.push(new Vine(params))
    }
  }

  grow() {
    for (let vine of this.vines)
    {
      vine.play();
    }
  }

  stopGrowing() {
    for (let vine of this.vines)
    {
      vine.pause();
    }
  }

  startGrowing() {
    for (let vine of this.vines)
    {
      vine.play();
    }
  } 
}