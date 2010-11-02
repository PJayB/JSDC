/*
	Copyright � Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

var materials = 
{	
	"whitewall"	: { name : "wall_dc.jpg"		},
	"red"		: { name : "#FF0000"			},
	"green"		: { name : "#00FF00"			},
	"blue"		: { name : "#0000FF"			},
	"white"		: { name : "#FFFFFF"			},
	"window"	: { name : "wall_window.png",	alpha : true, shade : true },
	"roughstone": { name : "roughstone.jpg"	    }
};

var sprites =
{	
	"guard" :
	{
		images : ["guard.png", "guard_back.png"],
		scale : 0.85,
		fCount: 13,
		fps   : 4,
		anims :
		{
			"idle" : [[0]],
			"walk" : [[1,2,3,4]],
			"shoot": [[11,12]],
			"die"  : [[5,6,7,8]],
			"dead" : [[10]],
			"pain" : [[5], [9]]
		}
	}
};		

function static_update(dt)
{
	this.currentTime += dt;
	this.currentFrame = wrap( Math.floor(this.currentTime * this.sprite.fps), 0, this.sprite.fCount );
}
		
var entity_templates =
{
//	"guard"		: { sprite : sprites["guard"],	   init : null,	update : static_update,		damage: null }		
	"guard"		: { sprite : sprites["guard"],	   init : ai_init,	update : ai_update,		damage: ai_takeDamage }		
};

function ray_direction(rayTheta)
{
	return vec2_fromAngle(rayTheta);
}

function get_line_normal_away_from_p(p0, p1, p)
{
	var dx = p1[0] - p0[0];
	var dy = p1[1] - p0[1];
	var len = Math.sqrt(dx*dx + dy*dy);
	
	var n = [dy / len, -dx / len];
	
	var tx = p[0] - p0[0];
	var ty = p[1] - p0[1];
	if ( (tx * n[0] + ty * n[1]) > 0 )
	{
		n[0] = -n[0]; n[1] = -n[1];
	}
	
	return n;
}

function intersectionSort(a, b)
{
	return a.dist - b.dist;
}

function level_castRay(rayOrigin, rd)
{			
	// calculate the gradient of the ray
	var rd_m = rd[1] / rd[0];
	
	results = [];
	
	// intersect it with the line segments of the level
	for ( var i = 0; i < map.length; ++i )
	{
		var map_seg = map[i];
	
		// calculate the gradient of the line segment
		var p0 = [map_seg[0], map_seg[1]];
		var p1 = [map_seg[2], map_seg[3]];
		var st = intersect2_ray_lineseg(rayOrigin, rd, p0, p1);
		if ( st != null )
		{
			var s = st[0];
			var t = st[1];
			if ( s >= 0 && 
				 t >= 0 && 
				 t <= 1 )
			{
				var pd = vec2_sub(p1, p0);
				var len = vec2_len(pd);
				
				var n = [pd[1] / len, -pd[0] / len];
				
				var u_offset = (map_seg[6] === undefined) ? 0.0 : map_seg[6];
				var u = ( t * len + u_offset ) / map_seg[4];
				
				// dot n with ray, make sure we're pointing the right way
				if ( n[0] * rd[0] + n[1] * rd[1] > 0 )
				{
					n[0] = -n[0]; n[1] = -n[1];
				}
				
				results[results.length] = 
				{
					dist : s,
					height : map_seg[4],
					material : map_seg[5],
					u : u,
					normal : n
				};
			}
		}
	}
	
	// sort the results
	results.sort(intersectionSort);
	
	return results;
}

function level_clipMovement(origin, movement, radius)
{
	var radius_ep = 0.0001;

	var hit = true;
	while ( hit )
	{
		var new_pp = [origin[0] + movement[0], origin[1] + movement[1]];

		hit = false;
		for (var i = 0; i < map.length; ++i)
		{
			var wall = map[i];
			
			var w0 = [wall[0], wall[1]];
			var w1 = [wall[2], wall[3]];
			var pp_n = get_line_normal_away_from_p(w0, w1, origin);

			var p0 = [wall[0] - pp_n[0] * radius, wall[1] - pp_n[1] * radius];
			var p1 = [wall[2] - pp_n[0] * radius, wall[3] - pp_n[1] * radius];
			var n = get_line_normal_away_from_p(p0, p1, new_pp);
			
			// If we're still on the correct side of the wall, don't bother
			if ( vec2_dot(pp_n, n) > 0 )
			{
				continue;
			}
			
			// Looks like we ended up on the other side. Move us out of the wall.
			
			var st = intersect2_ray_lineseg(new_pp, n, p0, p1);
			
			if ( st != null && 
				 st[0] >= 0 && 
				 st[1] >= -0.001 &&
				 st[1] <= 1.001 )
			{
				// shift the movement vector back some
				movement[0] += n[0] * (st[0] + radius_ep);
				movement[1] += n[1] * (st[0] + radius_ep);
				
				hit = true;
			}
		}
	}
}

function level_init()
{
}
