/*
	Copyright � Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

var player_startHealth = 10;

var player_defaultHeight = 1.2;
var player_deadHeight = 0.2;
var player_isDead = false;

var player_maxBullets = 50;
var player_startBullets = 30;

var player_damageFade = 0;

function player_init()
{
	this.startHealth = player_startHealth;
	this.health = this.startHealth;
	this.prevHealth = this.startHealth;
	this.viewHeight = player_defaultHeight;
	this.ammo = player_startBullets;
	this.isDead = false;
	this.active = true;
	this.isPlayer = true;
	this.damageFade = 0;
	this.healFade = 0;
	this.ammoFade = 0;
}

function player_takeDamage(from, dmg)
{
	this.health -= dmg;
	
	if ( dmg > 0 )
	{
		this.damageFade = Math.min( 1.0, this.damageFade + dmg );
	}
	else
	{
		this.healFade = Math.min( 1.0, this.healFade - dmg );
	}
	
	if ( this.health <= 0 )
	{
		this.isDead = true;
		// scream?
		//player_die();
		
		entity_die(this, from);
	}
	
	return this.isDead;
}

function player_touch(other)
{
	return true;
}

function player_update(dt)
{
	this.prevHealth = this.health;
	
	// if dead, don't move
	if ( this.isDead )
	{
		this.damageFade = 1.0;
		
		// drop down to our deadheight
		this.viewHeight = Math.max(player_deadHeight, this.viewHeight - dt * 2);
		
		// look at our killer
		if (this.killer !== undefined && this.killer != null)
		{
		    this.dir = vec2_normalize(vec2_sub(this.killer.pos, this.pos));
		}
	
		entity_update(this, dt);
	
		return;
	}

	var damage_fade = 0;
	if (this.health < 3)
	{
	    damage_fade = (2 - this.health) * 0.5;
	}

	this.damageFade = Math.max(damage_fade, this.damageFade - dt * 4);
	this.healFade = Math.max(0.0, this.healFade - dt * 4);
	this.ammoFade = Math.max(0.0, this.ammoFade - dt * 4);
	
	if ( this.health > this.startHealth )
	{
		this.health = Math.max( this.startHealth, this.health - dt );
	}
	
	if ( this.ammo > player_maxBullets )
	{
		this.ammo = player_maxBullets;
	}
	
	entity_update(this, dt);
}
