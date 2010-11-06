/*
	Copyright � Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

function entity_can_pickup_stuff(entity)
{
	return ( entity.health !== undefined && entity.active == true && entity.isPlayer );
}

function healthPack_touch(entity)
{
	if( entity_can_pickup_stuff(entity) )
	{
		if ( entity.health < entity.startHealth )
		{
			entity_heal(this, entity, Math.min(5, entity.startHealth - entity.health));
			this.visible = false;
			entity_die(this);
		}
	}
}

function bullets_touch(entity)
{
	if ( entity_can_pickup_stuff(entity) )
	{
		if ( entity.ammo_bullets !== undefined )
		{
			entity.ammo_bullets = Math.max( entity.ammo_bullets + 10, player_maxBullets );
		}
		else
		{
			entity.ammo_bullets = 10;
		}
	}
}
