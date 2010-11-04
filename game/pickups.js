/*
	Copyright � Peter J. B. Lewis 2010
	
	www.pjblewis.com / me@pjblewis.com
	
	If you use this document, please leave this credit in place.
	Thanks.
*/

function healthPack_touch(entity)
{
	if( entity.health !== undefined && entity.active == true && entity.isPlayer )
	{
		if ( entity.health < entity.startHealth )
		{
			entity_heal(this, entity, Math.min(5, entity.startHealth - entity.health));
			this.visible = false;
			entity_die(this);
		}
	}
}

