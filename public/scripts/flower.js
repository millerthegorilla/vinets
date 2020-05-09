var flowerlib = (function () {
    //use flower in some fashion.
	var isArray = function( object ) 
		{
			return Object.prototype.toString.call( object ) == '[object Array]';
		};

	var isNumber = function( object ) 
		{
			return typeof object == 'number';
		};

   var random = function( min, max ) 
		{
			if ( isArray( min ) )
				return min[ ~~( Math.random() * min.length ) ];
			if ( !isNumber( max ) )
				max = min || 1; min = 0;
			return min + Math.random() * ( max - min );
	};

	var randomi = function(a, b) 
	{
		return Math.floor(Math.random() * (b-a+1) + a);
	};

    function flower(x, y, context) {
        this._context = context;
        this._vertices = null;
        this._x = x;
        this._y = y;
        this._flower = generateFlower();
        var TWO_PI = 2 * Math.PI;
        this._iterations = 0;
        this._maxiterations = 200;
        this.types = {
            "wave-green": function (that) {
                this._context.fillStyle = that.colorPrimary;
                var radius = Math.abs(that.x_0);
                this._context.beginPath();
                var angleStep = TWO_PI / 150;
                this._context.moveTo(radius * Math.cos(0.0), radius * Math.sin(0.0));
                for (var angle = 0.0; angle < TWO_PI; angle += angleStep) {
                    var rad = radius +
                        that.params[0] * Math.sin(angle * that.params[1]);
                    this._context.lineTo(rad * Math.cos(angle), rad * Math.sin(angle));
                };
                this._context.lineTo(radius * Math.cos(0.0), radius * Math.sin(0.0));
                this._context.fill();
            },
            "wave-red": function (that) {
                this._context.fillStyle = that.colorSecondary;
                var radius = Math.abs(that.x_0);
                this._context.beginPath();
                var angleStep = TWO_PI / 140;
                this._context.moveTo(radius * Math.cos(0.0), radius * Math.sin(0.0));
                for (var angle = 0.0; angle < TWO_PI; angle += angleStep) {
                    var rad = radius +
                        that.params[0] * Math.sin(angle * that.params[1]);
                    this._context.lineTo(rad * Math.cos(angle), rad * Math.sin(angle));
                };
                this._context.lineTo(radius * Math.cos(0.0), radius * Math.sin(0.0));
                this._context.fill();
            }
        };

        function generateFlower() {
            var flower = [];
            var previousRadius = 0.0;
            while (previousRadius <= 1.0) {
                previousRadius += random(0.1, 0.2);
                if (previousRadius > 1.0) break;
                var colorPrimary = 'rgb(' +
                    randomi(120, 208) + ',' +
                    randomi(36, 74) + ',' +
                    randomi(40, 88) + ')';
                var colorSecondary = 'rgb(' +
                    randomi(41, 120) + ',' +
                    randomi(105, 180) + ',' +
                    randomi(41, 120) + ')';
                var params = [random(.7, 1.05), randomi(4, 12), random(8, 8), random(0.5, 2)];
                var iter = 0;
                flower.unshift({
                    radius: previousRadius,
                    colorPrimary: colorPrimary,
                    colorSecondary: colorSecondary,
                    type: random(['wave-red', 'wave-green']),
                    params: params,
                    x_0: random(0.5, 0.2),
                    x_1: 0.2,
                    iter: iter
                });
            }
            return flower;
        }
        // this._garden.animation.updates(this, this.update);
        // this._garden.animation.draws(this, this.draw);
    }

    flower.prototype.draw = function () {
        this._context.save();
        this._context.translate(this._x, this._y);
        this._context.scale(5, 7);
        for (var j = 0; j < this._flower.length; ++j) {
            this.types[this._flower[j].type].bind(this)(this._flower[j]);
        }
        this._context.restore();
    };
    
    flower.prototype.update = function () {
        if (this._iterations >= this._maxiterations) {
            console.log("this.iterations = " + this._iterations + " this.maxiter= " + this._maxiterations);
            return;
        } else {
            this._iterations++;
        }
        if (this._iterations % 5 === 0) {
            for (var j = 0; j < this._flower.length; ++j) {
                var dt = 0.05;
                var _l = this._flower[j];
                var _v = (_l.x_0 - _l.x_1) / dt;
                var _f = 0.8;
                var r = Math.abs(_l.x_0);
                if (r !== 0) {
                    _f += _l.params[2] * (_l.radius - r) * _l.x_0 / (r) + _l.params[3] * (-_v);
                }
                var x = 2 * _l.x_0 - _l.x_1 + _f * dt * dt;
                _l.x_1 = _l.x_0;
                _l.x_0 = x;
            }
        }
    };
    
    function flower_gen(x,y,context) {
    	return new flower(x,y,context)
    }

    return { flower:flower_gen };
})();