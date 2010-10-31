/*
	Copyright © Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

var hex_table = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ];

function frac(i)
{
	return i - Math.floor(i);
}

function lerp(a, b, x)
{
	return a + (b - a) * x;
}

function mod(a, b)
{
	return (a >= 0 ) ? a % b : (a % b + Math.abs(b)) % b;
}

function wrap(n, a, b)
{
	return a + mod(n - a, b - a);
}
		
function random_int(range)
{
	return Math.floor(Math.random() * range);
}

function int_to_hex(i)
{
	i = parseInt(i);
	var hi = (i & 0xF0) >> 4;
	var lo = (i & 0x0F);
	return hex_table[hi] +
		   hex_table[lo];
}

