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

var player_localPos = [0,0];
var player_pos = [0,0];
var player_radius = 0.5;

var player_startHealth = 10;
var player_health = player_startHealth;
var player_prevHealth = player_health;

var player_viewHeight = 1.2;
var player_deadHeight = 0.2;
var player_isDead = false;

function player_init()
{
	player_health = player_startHealth;
	player_prevHealth = player_health;
	player_viewHeight = 1.2;
	player_isDead = false;
}

function player_hurt(dmg)
{
	player_health -= dmg;
	
	if ( player_health <= 0 )
	{
		player_isDead = true;
		// scream?
		//player_die();
	}
	
	return player_isDead;
}

function player_mouseMove(_mouse_x, _mouse_y, sensitivity)
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

function player_keyDown(event)
{
	movement_keys[getKey(event)] = true;
}

function player_keyUp(event)
{
	movement_keys[getKey(event)] = false;
}

function player_update(dt)
{
	player_prevHealth = player_health;
	
	// if dead, don't move
	if ( player_isDead )
	{
		// drop down to our deadheight
		player_viewHeight = Math.max(player_deadHeight, player_viewHeight - dt * 2);
		
		// look at our killer
		
	
		return;
	}

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
	
	movement[0] *= ms * dt;
	movement[1] *= ms * dt;
	
	level_clipMovement(player_pos, movement, player_radius);

	player_pos[0] += movement[0]; player_pos[1] += movement[1];
	player_localPos[0] += vec2_dot(right,   movement);
	player_localPos[1] += vec2_dot(forward, movement);
}
