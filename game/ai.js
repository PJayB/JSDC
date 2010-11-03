/*
	Copyright � Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/


// Hurt the player on frame 2
function ai_attackUpdate(entity, frame)
{
	if ( frame == 1 && entity.target != null )
	{
		if ( Math.random() < 0.7 && entity.target.damage !== undefined )
		{
			entity_attack(entity, 1, 50);
		}
	}
}

var ai_stateTable =
{
	"idle"	: { anim: "idle",	nextState: "idle" },
	"hunt"	: { anim: "walk",	nextState: "hunt" },
	"attack": { anim: "shoot",	nextState: "hunt", frameUpdate: ai_attackUpdate },
	"die"	: { anim: "die",	nextState: "dead" },
	"dead"	: { anim: "dead",	nextState: "dead" },
	"pain"	: { anim: "pain",	nextState: "hunt" }
};

var ai_moveSpeed = 6;
var ai_attackThreshold = 2; // will stop walking, always attack
var ai_maxHealth = 2;
var ai_fov = 0.4;

function ai_init()
{
	if ( this.dir === undefined )
	{
		// select a random direction to face in
		this.dir = vec2_fromAngle(Math.random() * (Math.PI * 2));
	}
	
	this.target = null;
	this.startHealth = Math.ceil(Math.random() * ai_maxHealth);
	this.prevHealth = this.startHealth;
	this.health = this.startHealth;
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
	
	entity_die(e);
}

function ai_alert(e, from)
{
	if ( (e.state !== undefined) && 
	     (e.target == null || e.target === undefined) &&
	     (from.isPlayer) )
	{
		e.target = from;
		ai_switchState(e, "hunt", "hunt");
	}
}

function ai_touch(other)
{
	if ( other.isPlayer )
	{
		ai_alert(this, other);
	}
	
	return true;
}

function ai_takeDamage(from, d)
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
		this.target = from;
		ai_switchState(this, "pain", "hunt");
	}
}

function ai_checkForAlert(e, target)
{
	// if we can see them, then alert!
	if ( entity_canSeeTarget(e, ai_fov, target) && e.state == "idle" )
	{
		// switch to a new state
		ai_alert(e, target);
		return true;
	}
	
	return false;
}

function ai_update(dt)
{
	// clear our velocity
	this.velocity = [0,0];
	
	// if we're dead or dying, just update
	if ( this.state == "die" || this.state == "dead" )
	{
		ai_updateCurrentState(this, dt);
		return;
	}
	
	// Check for alerted state
	ai_checkForAlert(this, local_player);
	
	// if we're hunting, occasionally shoot stuff
	if ( this.state == "hunt" )
	{
		// if the player died, stop hunting
		if ( !this.target.active || !this.target.visible )
		{
			this.target = null;
			ai_switchState(this, "idle");
		}
		else
		{
			// Is the target visible?
			var can_see_player = entity_canSeeTarget(this, ai_fov, this.target);
			
			// Distance and direction to target
			var target_dir = vec2_sub( this.target.pos, this.pos );
			var target_dist = vec2_len( target_dir );
			target_dir = vec2_scale( target_dir, 1 / target_dist );
		
			// continue doing what we're doing or fire?
			// if we're close enough, fire our gun
			// oh, but give the player a bit of time to leg it, too
			var attack = (this.stateTime > 0.5 && (target_dist <= ai_attackThreshold || Math.random() < 1.0 / target_dist));
			if ( can_see_player && attack )
			{
				// switch to a new state!
				ai_switchState(this, "attack", this.state);
			}
			else if (target_dist > ai_attackThreshold)
			{
				// move towards the player
				this.velocity = [target_dir[0] * ai_moveSpeed,
								 target_dir[1] * ai_moveSpeed];
			}
			
			this.dir = target_dir;
		}
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
	
	if ( new_state_name != e.state )
	{
		e.stateTime = 0;
	}
	
	e.state = new_state_name;
	e.nextState = next_state_name;
	e.stateLoopTime = 0;
	
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

function ai_stateUpdate(e, t)
{
	var state = ai_stateTable[e.state];
	
	if ( state.frameUpdate !== undefined && state.frameUpdate != null )
	{
		state.frameUpdate(e, t);
	}
}

function ai_updateCurrentState(e, dt)
{
	e.stateTime += dt;
	e.stateLoopTime += dt;
	
	var currentFrameTime = Math.floor(e.stateLoopTime * e.sprite.fps);
	
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
		if ( e.prevFrame != e.currentFrame )
		{
			ai_stateUpdate(e, currentFrameTime);
		}
		e.prevFrame = e.currentFrame;
	}
	
	// Update the entity's position and shit
	entity_update(e, dt);
}
