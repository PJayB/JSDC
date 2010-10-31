/*
	Copyright © Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/


var ai_stateTable =
{
	"idle"	: { anim: "idle",	nextState: "idle" },
	"hunt"	: { anim: "walk",	nextState: "hunt" },
	"attack": { anim: "shoot",	nextState: "hunt" },
	"die"	: { anim: "die",	nextState: "dead" },
	"dead"	: { anim: "dead",	nextState: "dead" },
	"pain"	: { anim: "pain",	nextState: "hunt" },
};

var ai_moveSpeed = 6;
var ai_attackThreshold = 2; // will stop walking, always attack
var ai_maxHealth = 2;

function ai_init()
{
	this.health = Math.ceil(Math.random() * ai_maxHealth);
	ai_switchState( this, "idle" );
	this.active = true;
}

function ai_kill(e)
{
	if ( e.state !== undefined )
	{
		ai_switchState(e, "die", "dead");
		e.health = 0;
	}
	e.active = false;
}

function ai_alert(e)
{
	if ( e.state !== undefined )
	{
		ai_switchState(e, "hunt", "hunt");
	}
}

function ai_takeDamage(d)
{
	// if we're dead... stay dead?
	if ( this.state == "dead" )
	{
		return;
	}

	// if we weren't aware of the player, double the damage!
	if ( this.state == "idle" )
	{
		d *= 2;
	}
	
	// take it away from our health and change our state
	this.health -= d;
	
	// if we're already in the pain state, or dying, continue that animation
	if ( this.state == "pain" || this.state == "die" )
	{
		return;
	}
	
	// die or play the pain anim?
	if ( this.health < 0 )
	{
		ai_kill(this);
	}
	else
	{
		ai_switchState(this, "pain", "hunt");
	}
}

function ai_update(dt)
{
	// if we're dead or dying, just update
	if ( this.state == "die" || this.state == "dead" )
	{
		ai_updateCurrentState(this, dt);
		return;
	}
	
	// where's the player right now? can we see them?
	var player_delta = vec2_sub(player_pos, this.pos);
	var player_distance = vec2_len( player_delta );
	player_delta = vec2_scale( player_delta, 1.0 / player_distance );
	
	// get our angle and direction in the world
	if ( this.dir === undefined )
	{
		// select a random direction to face in
		this.dir = vec2_fromAngle(Math.random() * (Math.PI * 2));
	}
	
	// is the player in front of us? (some arbitrary cutoff)
	var can_see_player = false;
	
	var player_angle = vec2_dot(this.dir, player_delta);
	if ( player_angle > 0.4 )
	{
		can_see_player = true;
	}

	if ( can_see_player )
	{
		var player_location = level_castRay(this.pos, player_delta);
		for ( var i = 0; i < player_location.length; ++i )
		{
			// we hit something. is it between us and the player?
			if ( player_location[i].dist < player_distance )
			{
				can_see_player = false;
			}
		}
	}
	
	// if we can see them, then alert!
	if ( can_see_player && this.state == "idle" )
	{
		// switch to a new state
		ai_switchState(this, "hunt", "hunt");
	}
	
	// if we're hunting, occasionally shoot stuff
	if ( this.state == "hunt" )
	{
		// continue doing what we're doing or fire?
		// if we're close enough, fire our gun
		var attack = (player_distance <= ai_attackThreshold || Math.random() < 1.0 / player_distance);
		if ( can_see_player && attack )
		{
			// switch to a new state!
			ai_switchState(this, "attack", this.state);
		}
		else if (player_distance > ai_attackThreshold)
		{
			// move towards the player
			var movement = [player_delta[0] * ai_moveSpeed * dt,
							player_delta[1] * ai_moveSpeed * dt];
							
			level_clipMovement(this.pos, movement, player_radius);
			
			this.pos[0] += movement[0];
			this.pos[1] += movement[1];
		}
		
		this.dir = player_delta;
	}

	// if we're done with our current state, switch back to an old state or loop?
	ai_updateCurrentState(this, dt);
}

function ai_switchState(e, new_state_name, next_state_name)
{
	var new_state = ai_stateTable[new_state_name];
	
	if ( next_state_name == null || next_state_name === undefined )
	{
		next_state_name = new_state.nextState;
	}
	
	e.state = new_state_name;
	e.nextState = next_state_name;
	e.stateTime = 0;
	
	var anim_array = e.sprite.anims[new_state.anim];
	if ( anim_array === undefined || anim_array == null || anim_array.length == 0 )
	{
		e.currentAnim = null;
	}
	else
	{
		var a_idx = random_int(anim_array.length);
		e.currentAnim = anim_array[a_idx];
	}
}

function ai_updateCurrentState(e, dt)
{
	e.stateTime += dt;
	
	var currentFrameTime = Math.floor(e.stateTime * e.sprite.fps);
	
	var anim = e.currentAnim;
	var expired = false;
	if ( anim === undefined || anim == null || currentFrameTime >= anim.length)
	{
		expired = true;
	}
	
	// if the state has expired, switch to the next state
	if ( expired )
	{
		ai_switchState(e, e.nextState);
	}
	else
	{
		e.currentFrame = anim[currentFrameTime];
	}
}
