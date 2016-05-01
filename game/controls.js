/*
	Copyright � Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

var key_w = 87;
var key_a = 65;
var key_s = 83;
var key_d = 68;
var key_up = 38;
var key_left = 37;
var key_down = 40;
var key_right = 39;

var last_x = 0;
var last_y = 0;
var mouse_x = 0;
var mouse_y = 0;
var rotation_x = 0;
var rotation_y = 0;

var movement_keys = [];

function controls_mouseMove(_mouse_x, _mouse_y, sensitivity)
{
	mouse_x = _mouse_x;
	mouse_y = _mouse_y;
	
	var delta_x = (mouse_x - last_x);
	var delta_y = (mouse_y - last_y);
	
	if ( delta_x < 100 && delta_y < 100 )
	{
		rotation_x += delta_x * sensitivity;
		rotation_y += delta_y * sensitivity;
	}
	
	last_x = mouse_x;
	last_y = mouse_y;
}

function getKey(event)
{
	return parseInt((event.which) ? event.which : event.keyCode);
}

function controls_keyDown(event)
{
	movement_keys[getKey(event)] = true;
}

function controls_keyUp(event)
{
	movement_keys[getKey(event)] = false;
}

function controls_init(control_entity)
{
	rotation_x = vec2_toAngle(control_entity.dir);
}

function controls_update(dt, control_entity)
{
	var movement = [0,0];
	
	var ms = 7.5;
	var rs = 2.0;
	
	var forward = ray_direction(rotation_x);
	var right   = ray_direction(rotation_x + Math.PI * 0.5);
	
	if ( movement_keys[key_w] || movement_keys[key_up]) 
	{ 
		movement[0] += forward[0]; movement[1] += forward[1]; 
	}
	if ( movement_keys[key_s] || movement_keys[key_down] ) 
	{ 
		movement[0] -= forward[0]; movement[1] -= forward[1]; 
	}

	if ( movement_keys[key_a] ) { movement[0] -= right[0]; movement[1] -= right[1]; }
	if ( movement_keys[key_d] ) { movement[0] += right[0]; movement[1] += right[1]; }
	if ( movement_keys[key_left] ) { rotation_x -= dt * rs; }
	if ( movement_keys[key_right] ) { rotation_x += dt * rs; }
	
	if ( movement[0] != 0 && movement[1] != 0 )
	{
		d = Math.sqrt( movement[0] * movement[0] + movement[1] * movement[1] );
		movement[0] /= d;
		movement[1] /= d;
	}
	
	control_entity.dir = vec2_fromAngle(rotation_x);
	control_entity.velocity[0] = movement[0] * ms;
	control_entity.velocity[1] = movement[1] * ms;
}
