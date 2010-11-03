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

var player_damageFade = 0;

function player_init()
{
	this.startHealth = player_startHealth;
	this.health = this.startHealth;
	this.prevHealth = this.startHealth;
	this.viewHeight = player_defaultHeight;
	this.isDead = false;
	this.active = true;
	this.isPlayer = true;
	this.damageFade = 0;
	this.healFade = 0;
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
		
		entity_die(this);
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
		
	
		entity_update(this, dt);
	
		return;
	}

	this.damageFade = Math.max(0.0, this.damageFade - dt * 4);
	this.healFade = Math.max(0.0, this.healFade - dt * 4);
	
	if ( this.health > this.startHealth )
	{
		this.health = Math.min( this.startHealth, this.health - dt );
	}
	
	entity_update(this, dt);
}
