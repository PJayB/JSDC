/*
	Copyright © Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

function vec2_clone(v)
{
	return [v[0], v[1]];
}

function vec2_add(a, b)
{
	return [a[0] + b[0], a[1] + b[1]];
}

function vec2_sub(a, b)
{
	return [a[0] - b[0], a[1] - b[1]];
}

function vec2_scale(a, b)
{
	return [a[0] * b, a[1] * b];
}

function vec2_dot(a, b)
{
	return a[0] * b[0] + a[1] * b[1];
}

function vec2_len(vec)
{
	return Math.sqrt(vec2_dot(vec, vec));
}

function vec2_getNormal(vec)
{
	return [vec[1], -vec[0]];
}

function vec2_normalize(vec)
{
	var l = vec2_len(vec);
	return [vec[0] / l, vec[1] / l];
}

function vec2_toAngle(v)
{
	var pi2 = Math.PI * 2;
	var a = Math.atan2(v[1], v[0]) - Math.PI * 0.5;
	return wrap( pi2 - a, 0, pi2 );
}

function vec2_fromAngle(rayTheta)
{
	rayTheta %= Math.PI * 2.0;
	if ( rayTheta < 0 ) { rayTheta += Math.PI * 2.0; }
	
	// find the direction vector of the ray
	return [Math.sin(rayTheta), Math.cos(rayTheta)];
}

function intersect2_ray_lineseg(ro, rd, p0, p1)
{
	// calculate the gradient of the line segment
	var ls_dx = p1[0] - p0[0];
	var ls_dy = p1[1] - p0[1];
	var ls_m = ls_dy / ls_dx;
	
	var rd_m = rd[1] / rd[0];
	
	if ( rd_m != ls_m )
	{
		var d = rd[0] * ls_dy - rd[1] * ls_dx;
		if ( d != 0 )
		{
			var tmp_dx = ro[0] - p0[0];
			var tmp_dy = ro[1] - p0[1];
			var s = (tmp_dy * ls_dx - tmp_dx * ls_dy) / d;
			var t = (tmp_dy * rd[0] - tmp_dx * rd[1]) / d;
			return [s, t];
		}
	}
	
	return null;
}

