/*
	Copyright © Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

function Rasterizer(width, height)
{
	this.depthBuffer = [];
	this.colourBuffer = [];
	this.cellSize = 12;
	this.width = width;
	this.height = height;
	this.aspect = width / height;
	this.channels = 4;
	this.pixelShader = null;
	
	this.getPixel = getPixel;
	this.fillPixel = fillPixel;
	this.makeIndex = makeIndex;
	this.clearColour = clearColour;
	this.clearDepth = clearDepth;
	this.drawTriangle = drawTriangle;
						
	this.clearColour(0, 0, 0, 0);
	this.clearDepth();
}

function getPixel(x, y)
{
	var i = this.makeIndex(x, y, this.channels);
	var c = [];
	for ( var j = 0; j < this.channels; ++j )
	{
		c[j] = this.colourBuffer[i+j];
	}
	return c;
}

function fillPixel(x, y, z, c)
{
	if ( x >= 0 && y >= 0 && x < this.width && y < this.height )
	{
		var d = this.makeIndex(x, y, 1);
		if ( z < this.depthBuffer[d] )
		{
			var i = d * this.channels;
			for ( var j = 0; j < this.channels && j < c.length; ++j )
			{
				this.colourBuffer[i+j] = c[j];
			}
			this.depthBuffer[d] = z;
		}
	}
}

function makeIndex(x, y, c)
{
	return (y * this.width + x) * c;
}

function clearColour(c)
{
	for (var i = 0; i < this.width * this.height * this.channels; i += this.channels)
	{
		for (var j = 0; j < this.channels; ++j)
		{
			if (c[j] === undefined) { this.colourBuffer[i+j] = 0; }
			else					{ this.colourBuffer[i+j] = c[j]; }
		}
	}
}

function clearDepth()
{
	for (var i = 0; i < this.width * this.height; i++)
	{
		this.depthBuffer[i] = 1.0;
	}
}

// Expects vertices in normalized clip space in the form [x, y, z, u, v];
function drawTriangle(v0, v1, v2)
{
	// sort the vertices
	var sorted_vs = __sortVertices(v0, v1, v2);
	if ( sorted_vs == null )
	{
		// clockwise winding. cull.
		return;
	}
	
	// create fragments
	var fragments =
	[
		__makeFragment(this, sorted_vs[0]),
		__makeFragment(this, sorted_vs[1]),
		__makeFragment(this, sorted_vs[2])
	];
	
	// draw
	if (fragments[0].y == fragments[1].y)
	{
		// flat bottomed
		__drawFlatBottomTri(this, fragments);
	}
	else if (fragments[1].y == fragments[2].y)
	{
		__drawFlatTopTri(this, fragments);
	}
	else
	{
		// Split
		__drawArbShapeTri(this, fragments);
	}
}

function __homoDivide(v)
{
	var w = (v[3] === 0) ? 1.0 : v[3];

	v[0] /= w;
	v[1] /= w;
	v[2] /= w;
}

function __sortVertices(v0, v1, v2)
{
	var vs = 
	[
		v0.slice(0),
		v1.slice(0),
		v2.slice(0)
	];
	
	__homoDivide(vs[0]);
	__homoDivide(vs[1]);
	__homoDivide(vs[2]);
	
	if ( vs[0][1] > vs[1][1] ) { var t = vs[0]; vs[0] = vs[1]; vs[1] = t; }
	if ( vs[1][1] > vs[2][1] ) { var t = vs[1]; vs[1] = vs[2]; vs[2] = t; }
	if ( vs[0][1] > vs[1][1] ) { var t = vs[0]; vs[0] = vs[1]; vs[1] = t; }
	
	return vs;
}

function __lerpInterpolants(a, b, bias)
{
	var interpolants = [];
	var numInterpolants = Math.min(a.length, b.length);
	for ( var i = 0; i < numInterpolants; ++i )
	{
		interpolants[i] = lerp(a[i], b[i], bias);
	}
	return interpolants;
}

function __cloneFragment()
{
	var frag =  
	{
		x : this.x, 
		y : this.y,
		z : this.z,
		w : this.w,
		interpolants : this.interpolants.slice(0),
		clone : this.clone
	};
	return frag;
}

function __splitFragment(f0, f1, y_coord)
{
	var bias = (y_coord - f0.y) / (f1.y - f0.y);
	
	var interpolants = __lerpInterpolants(f0.interpolants, f1.interpolants, bias);
	
	var frag =
	{
		x : lerp(f0.x, f1.x, bias),
		y : y_coord,
		z : lerp(f0.z, f1.z, bias),
		w : lerp(f0.w, f1.w, bias),
		interpolants : interpolants,
		clone : f0.clone
	};
	return frag;
}

function __makeFragment(rasterizer, v)
{
	var w = v[3];
	
	tx = (v[0] * 0.5 + 0.5) * (rasterizer.width - 1);
	ty = (v[1] * 0.5 + 0.5) * (rasterizer.height- 1);
	
	var interpolants = v.slice(4);
	for ( var i = 0; i < interpolants.length; ++i )
	{
		interpolants[i] /= w;
	}
	
	var frag = 
	{
		x : Math.floor(tx),
		y : Math.floor(ty),
		z : v[2],
		w : 1.0 / w,
		interpolants : interpolants,
		clone : __cloneFragment
	};
	return frag;
}

function __makeSteppingData(f0, f1)
{
	var line = 
	{
		x0 : Math.floor(f0.x),
		y0 : Math.floor(f0.y),
		x1 : Math.floor(f1.x),
		y1 : Math.floor(f1.y)
	};
	
	line.dx = line.x1 - line.x0;
	line.dy = line.y1 - line.y0;

	line.m = line.dx / line.dy;
	line.x_step = ( line.dx < 0 ) ? -1 : 1;
	line.y_step = ( line.dy < 0 ) ? -1 : 1;
	
	// invert negatives for y and m
	if ( line.dy < 0 ) { line.dy = -line.dy; }
	if ( line.m  < 0 ) { line.m  = -line.m;  }
	
	var bias = 1.0 / line.dy;
	
	// stepping depth
	line.depthStep = ( f1.z - f0.z ) * bias;
	line.wStep = ( f1.w - f0.w ) * bias;
	
	// stepping interpolants
	var numInterpolants = Math.min(f0.interpolants.length, f1.interpolants.length);
	line.interpolantSteps = [];
	for ( var i = 0; i < numInterpolants; ++i )
	{
		line.interpolantSteps[i] = (f1.interpolants[i] - f0.interpolants[i]) * bias;
	}

	return line;
}

function __sampleTexture(t, x, y)
{
	var m = [];
	y = t.height - y - 1;
	for ( var i = 0; i < t.channels; ++i )
	{
		m[i] = t.data[(y * t.width + x) * t.channels + i] / 255;
	}
	return m;
}

function tex2D(t, u, v)
{
	if ( t == null || t.data === undefined )
	{
		return [0, 0, 0, 0];
	}
	else
	{
		// sample it
		var tu = Math.floor(u * (t.width -1) + 0.5);// % (t.width );
		var tv = Math.floor(v * (t.height-1) + 0.5);// % (t.height);
		
		return __sampleTexture(t, tu, tv);
	}
}

function __writeFragment(rasterizer, x, y, z, interpolants)
{
	rasterizer.pixelShader(rasterizer, x, y, z, interpolants);
}

function __writeErrorFragment(rasterizer, x, y, z, interpolants)
{
    rasterizer.fillPixel(x, y, z, [x % 2, y % 2, z, 1]);
}

function __drawScanline(rasterizer, x, y, iWidth, f0, f1)
{
	if ( !iWidth ) { return; }
	
	// If the scanline is reversed, swap the interpolants
	var error = false;
	
	if ( iWidth < 0 ) 
	{ 
		error = true;
		var t = f0;
		f0 = f1;
		f1 = t;
		iWidth = -iWidth;
		x = x - iWidth + 1; 
	}
	
	var tStep = 1.0 / iWidth;
	var t = 0.0;
	
	var numInterpolants = Math.min(f0.interpolants.length, f1.interpolants.length);
	var interpolants = [];
	
	for ( var i = 0; i < iWidth; ++i )
	{
		var z  = lerp(f0.z, f1.z, t);
		var w  = lerp(f0.w, f1.w, t);
		
		for ( var j = 0; j < numInterpolants; ++j )
		{
			interpolants[j] = lerp(f0.interpolants[j], f1.interpolants[j], t) / w;
		}
		
		if ( error ) { __writeErrorFragment(rasterizer, x, y, z, interpolants); }
		else         { __writeFragment(rasterizer, x, y, z, interpolants); }

		t += tStep;
		x ++;
	}
}

function __drawFlatTri(rasterizer, fragments, drawDown)
{
	// Get the order to draw in
	var iTopIndex = ( drawDown ) ? 2 : 0;
	var iBottomIndex = ( drawDown ) ? 0 : 2;
	
	// Fill left and right with the initial values
	var leftFrag  = fragments[iTopIndex].clone();
	var rightFrag = fragments[1].clone();
	
	// Swap if they're on the wrong side!
	if ( leftFrag.x > rightFrag.x )
	{
	    var t = leftFrag;
	    leftFrag = rightFrag;
	    rightFrag = t;
	}
	
	// Get the start and end coords of the edges
	var leftLine  = __makeSteppingData( leftFrag , fragments[iBottomIndex] );
	var rightLine = __makeSteppingData( rightFrag, fragments[iBottomIndex] );

	// Iterate through the y axis for the left edge
	var scanlines = Math.floor( leftLine.dy );
	for ( var y = 0; y < scanlines; y++ )
	{
		// Get the scanline width from the x coords of the two lines
		var xl = Math.floor( leftLine.x0  + ( y * leftLine.m  ) * leftLine.x_step  );
		var xr = Math.floor( rightLine.x0 + ( y * rightLine.m ) * rightLine.x_step );

		// Get the coordinates that we should draw at
		var yDraw = Math.floor( leftLine.y0 ) + (( drawDown ) ? -y : y);

		// Draw this scanline
		__drawScanline( rasterizer,					// The context to draw to
						xl,							// The x coordinate to draw from
						yDraw,						// The base y coordinate
						(xr - xl) + 1,				// The width of the scanline
						leftFrag,					// The source fragment
						rightFrag );				// The destination fragment


		// Add the stepping depths
		leftFrag.z  += leftLine.depthStep;
		rightFrag.z += rightLine.depthStep;
		leftFrag.w  += leftLine.wStep;
		rightFrag.w += rightLine.wStep;

		// Add the interpolants
		for ( var i = 0; i < leftLine.interpolantSteps.length; ++i )
		{
			leftFrag.interpolants[i] += leftLine.interpolantSteps[i];
		}
		for ( var i = 0; i < rightLine.interpolantSteps.length; ++i )
		{
			rightFrag.interpolants[i] += rightLine.interpolantSteps[i];
		}
	}
}

function __drawFlatBottomTri(rasterizer, fragments)
{
	__drawFlatTri(rasterizer, fragments, 0);
}

function __drawFlatTopTri(rasterizer, fragments)
{
	__drawFlatTri(rasterizer, fragments, 1);
}

function __drawArbShapeTri(rasterizer, fragments)
{
	var top_fragments = [fragments[0], fragments[1], fragments[2]];
	var bottom_fragments = [fragments[0], fragments[1], fragments[2]];
	
	// Split on f1
	top_fragments[0] = __splitFragment(fragments[0], fragments[2], fragments[1].y);
	bottom_fragments[2] = top_fragments[0];
	
	__drawFlatBottomTri(rasterizer, top_fragments);
	__drawFlatTopTri(rasterizer, bottom_fragments);
}
