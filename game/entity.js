/*
	Copyright � Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

// Initialize an entity from a template
// Do not call this yourself.
function entity_create(e, t)
{
	e.health = t.health === undefined ? -1 : t.health;
	e.velocity = [0,0];
	e.sprite = t.sprite;
	e.init   = t.init;
	e.update = t.update;
	e.damage = t.damage;
	e.touch	 = t.touch;
	e.active = false;
	e.visible= true;
	e.radius = t.radius;

	if ( e.init != null )
	{
		e.init();
	}
}

function entity_touch(toucher, touchee)
{
	if (touchee.touch !== undefined && touchee.touch != null)
	{
		return touchee.touch(toucher);
	}
	
	return false;
}

function entity_findTouches(source, movement)
{
	var origin = source.pos;
	var radius = source.radius;
	
	var new_pp = [origin[0] + movement[0], origin[1] + movement[1]];

	for (var i = 0; i < entities.length; ++i)
	{
		var e = entities[i];
		if ( e == source || !e.visible )
		{
			continue;
		}
		
		var delta = vec2_sub(new_pp, e.pos);
		
		// How far are we from the entity?
		var dsq = vec2_dot(delta, delta);
		if ( dsq > e.radius * e.radius )
		{
			continue;
		}
		
		entity_touch(source, e);
	}
}

// Clip movement
function entity_clipMovement(source, movement, radius_ep)
{
	var origin = source.pos;
	var radius = source.radius;
	
	var new_pp = [origin[0] + movement[0], origin[1] + movement[1]];

	hit = false;
	for (var i = 0; i < entities.length; ++i)
	{
		var e = entities[i];
		if ( e == source || !e.active || !e.visible )
		{
			continue;
		}
		
		var delta = vec2_sub(new_pp, e.pos);
		
		// How far are we from the entity?
		var dsq = vec2_dot(delta, delta);
		if ( dsq > e.radius * e.radius )
		{
			continue;
		}
		
		// normalize it
		var distance = Math.sqrt(dsq);
		delta = vec2_scale( delta, 1 / distance );
		
		var shift = e.radius - distance;
		
		// shift the movement vector back some
		movement[0] += delta[0] * (shift + radius_ep);
		movement[1] += delta[1] * (shift + radius_ep);
		
		hit = true;
	}
	
	return hit;
}

// Call this from your update function.
function entity_update(e, dt)
{
	if ( !e.active || e.active === undefined )
	{
		return;
	}
	
	if ( e.velocity === undefined )
	{
		return;
	}
	
	if ( vec2_dot(e.velocity, e.velocity) <= 0.0001 )
	{
		return;
	}
	
	var movement = e.velocity.slice(0);

	movement[0] *= dt;
	movement[1] *= dt;
	
	entity_findTouches(e, movement);

	var radius_ep = 0.0001;
	
	var a = true, b = true;
	var iterations = 10;
	while ( (a || b) && iterations-- )
	{
		a = level_clipMovement(e.pos, movement, e.radius, radius_ep);
		b = entity_clipMovement(e, movement, radius_ep);
	}

	e.pos[0] += movement[0]; 
	e.pos[1] += movement[1];
}

function entity_hurt(from, e, dmg)
{
	if ( e.damage !== undefined && e.damage != null && e.active )
	{
		return e.damage(from, dmg);
	}
	
	return false;
}

function entity_heal(from, e, dmg)
{
	entity_hurt(from, e, -dmg);
}

function entity_die(e, killer)
{
	e.velocity = [0,0];
	e.active = false;
	e.killer = killer;
}

function entity_canSeeTarget(e, e_fov, target)
{
	if ( !target.active || !target.visible)
	{
		return false;
	}
	
	// where's the player right now? can we see them?
	var player_delta = vec2_sub( target.pos, e.pos );
	var player_distance = vec2_len( player_delta );
	player_delta = vec2_scale( player_delta, 1.0 / player_distance );
	
	// is the player in front of us? (some arbitrary cutoff)
	var can_see_player = false;
	
	var player_angle = vec2_dot(e.dir, player_delta);
	if ( !target.isDead && player_angle > e_fov )
	{
		can_see_player = true;
	}

	if ( can_see_player )
	{
		var player_location = level_castRay(e.pos, player_delta);
		for ( var i = 0; i < player_location.length; ++i )
		{
			// we hit something. is it between us and the player?
			if ( player_location[i].dist < player_distance )
			{
				can_see_player = false;
			}
		}
	}
	
	return can_see_player;
}

function entity_attack(source, dmg, max_distance)
{
	var v = source.dir;
	
	var e_to_dmg = null;
	var dist = max_distance;
	var alert_dist = 20;
	
	// find the distance to the wall in front of us
	var r = level_castRay(source.pos, v);
	if ( r != null && r.length > 0 )
	{
		dist = r[0].dist;
	}
	
	// now find any enemies closer than that			
	for ( var i = 0; i < entities.length; ++i )
	{
		var e = entities[i];
		
		if ( e == source || !e.visible || !e.active )
		{
			continue;
		}
		
		if ( e.damage !== undefined && e.damage != null && e.active )
		{
			var d = vec2_sub(e.pos, source.pos);
			var d_len = vec2_len(d);
			if ( d_len == 0 )
			{
				dist = 0;
				e_to_dmg = e;
				break;
			}
			
			if ( d_len > dist )
			{
				continue;
			}
			
			if ( d_len < alert_dist )
			{
				ai_alert(e, source);
			}
			
			d = vec2_scale(d, 1 / d_len);
			
			var offset = d_len * (1 - vec2_dot(d, v));
			
			if ( offset < 0.1 ) 
			{
				// the entity is within the gun's aim
				e_to_dmg = e;
				dist = d_len;
			}
		}
	}
	
	if ( e_to_dmg != null )
	{
		return entity_hurt(source, e_to_dmg, dmg);
	}
	
	return false;
}


