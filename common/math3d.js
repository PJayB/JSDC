/*
	Copyright © Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

function vec3_clone(v)
{
	return [v[0], v[1], v[2]];
}

function vec3_add(a, b)
{
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function vec3_sub(a, b)
{
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function vec3_scale(a, b)
{
	return [a[0] * b, a[1] * b, a[2] * b];
}

function vec3_dot(a, b)
{
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function vec3_len(vec)
{
	return Math.sqrt(vec3_dot(vec, vec));
}

function vec3_cross(a, b)
{
	var v =
	[
		a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0]
	];
	return v;
}

function vec3_normalize(vec)
{
	var len = 1.0 / vec3_len(vec);
	var v =
	[
		vec[0] * len,
		vec[1] * len,
		vec[2] * len
	];
	return v;
}

function vec4_standardize(vec)
{
	var w = (vec[3] === 0) ? 1.0 : vec[3];
	var v = 
	[
		vec[0] / w,
		vec[1] / w,
		vec[2] / w,
		1.0
	]
	return v;
}
function mat4_vec3_mul(M, v)
{
	var v =
	[
		v[0] * M[ 0] + v[1] * M[ 4] + v[2] * M[ 8] + M[12],
		v[0] * M[ 1] + v[1] * M[ 5] + v[2] * M[ 9] + M[13],
		v[0] * M[ 2] + v[1] * M[ 6] + v[2] * M[10] + M[14],
		v[0] * M[ 3] + v[1] * M[ 7] + v[2] * M[11] + M[15],
	];
	return v;
}

function mat4_vec4_mul(M, v)
{
	var v =
	[
		v[0] * M[ 0] + v[1] * M[ 4] + v[2] * M[ 8] + v[3] * M[12],
		v[0] * M[ 1] + v[1] * M[ 5] + v[2] * M[ 9] + v[3] * M[13],
		v[0] * M[ 2] + v[1] * M[ 6] + v[2] * M[10] + v[3] * M[14],
		v[0] * M[ 3] + v[1] * M[ 7] + v[2] * M[11] + v[3] * M[15],
	];
	return v;
}

function mat4_dir3_mul(M, v)
{
	var v =
	[
		v[0] * M[ 0] + v[1] * M[ 4] + v[2] * M[ 8],
		v[0] * M[ 1] + v[1] * M[ 5] + v[2] * M[ 9],
		v[0] * M[ 2] + v[1] * M[ 6] + v[2] * M[10]
	];
	return v;
}

function mat4_mat4_mul(A, B)
{
	var M = 
	[
		B[ 0] * A[ 0] + B[ 1] * A[ 4] + B[ 2] * A[ 8] + B[ 3] * A[12],
		B[ 0] * A[ 1] + B[ 1] * A[ 5] + B[ 2] * A[ 9] + B[ 3] * A[13],
		B[ 0] * A[ 2] + B[ 1] * A[ 6] + B[ 2] * A[10] + B[ 3] * A[14],
		B[ 0] * A[ 3] + B[ 1] * A[ 7] + B[ 2] * A[11] + B[ 3] * A[15],
	
		B[ 4] * A[ 0] + B[ 5] * A[ 4] + B[ 6] * A[ 8] + B[ 7] * A[12],
		B[ 4] * A[ 1] + B[ 5] * A[ 5] + B[ 6] * A[ 9] + B[ 7] * A[13],
		B[ 4] * A[ 2] + B[ 5] * A[ 6] + B[ 6] * A[10] + B[ 7] * A[14],
		B[ 4] * A[ 3] + B[ 5] * A[ 7] + B[ 6] * A[11] + B[ 7] * A[15],
	
		B[ 8] * A[ 0] + B[ 9] * A[ 4] + B[10] * A[ 8] + B[11] * A[12],
		B[ 8] * A[ 1] + B[ 9] * A[ 5] + B[10] * A[ 9] + B[11] * A[13],
		B[ 8] * A[ 2] + B[ 9] * A[ 6] + B[10] * A[10] + B[11] * A[14],
		B[ 8] * A[ 3] + B[ 9] * A[ 7] + B[10] * A[11] + B[11] * A[15],
	
		B[12] * A[ 0] + B[13] * A[ 4] + B[14] * A[ 8] + B[15] * A[12],
		B[12] * A[ 1] + B[13] * A[ 5] + B[14] * A[ 9] + B[15] * A[13],
		B[12] * A[ 2] + B[13] * A[ 6] + B[14] * A[10] + B[15] * A[14],
		B[12] * A[ 3] + B[13] * A[ 7] + B[14] * A[11] + B[15] * A[15]
	];
	
	return M;
}

function mat4_identity()
{
	var M =
	[
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	return M;
}

function mat4_rotate(angle, x, y, z)
{
	var c = Math.cos(-angle);
	var s = Math.sin(-angle);
		
	var M = 
	[
		x * x * (1 - c) + c,
		x * y * (1 - c) - z * s,
		x * z * (1 - c) + y * s,
		0,
		
		y * x * (1 - c) + z * s,
		y * y * (1 - c) + c,
		y * z * (1 - c) - x * s,
		0,
		
		x * z * (1 - c) - y * s,
		y * z * (1 - c) + x * s,
		z * z * (1 - c) + c,
		0,
	
		0,
		0,
		0,
		1
	];
	
	return M;
}

function mat4_perspective(fovy, aspect, near, far)
{
	var f = 1.0 / Math.tan(fovy / 2.0);
	
	var c = (far + near)/(near - far);
	var d = (2 * far * near)/(near - far);
	
	var M =
	[	 
		f / aspect,
		0,
		0,
		0,
	
		0,
		f,
		0,
		0,
	
		0,
		0,
		c,
		-1,
	
		0,
		0,
		d,	
		0
	];
	
	return M;
}

function mat4_lookAt(eyeX, eyeY, eyeZ, centreX, centreY, centreZ, upX, upY, upZ)
{
	var f = vec3_normalize([centreX - eyeX, centreY - eyeY, centreZ - eyeZ]);
	
	var eye = [eyeX, eyeY, eyeZ];

	var s = vec3_cross( f, [upX, upY, upZ] );
	var u = vec3_cross( s, f );

	var M =
	[
		s[0],
		u[0],
		-f[0],
		0,
		
		s[1],
		u[1],
		-f[1],
		0,
		
		s[2],
		u[2],
		-f[2],
		0,

		-vec3_dot(eye, s),
		-vec3_dot(eye, u),
		 vec3_dot(eye, f),
		1
	];
	
	return M;
}

