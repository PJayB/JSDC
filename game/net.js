
var _net_api = null;
var _net_server = null;
var _net_client = null;

var _net_port = 44444;

function net_disconnect()
{	
	if ( _net_api == null )
	{
		return;
	}
	
	if (_net_server != null)
	{
		try { _net_api.close(_net_server); } catch(e) {}
		_net_server = null;
	}
	
	if (_net_client != null)
	{
		try { _net_api.close(_net_client); } catch(e) {}
		_net_client = null;
	}
	
	_net_api = null;
}

function net_connect(applet, host)
{
	net_disconnect();
	_net_api = applet;
	
	if ( applet == null )
	{
		return false;
	}
	
	try
	{
		_net_client = applet.connect(host, _net_port);
		log("Connected to " + _net_api.getRemoteIP(_net_client) + ":" + _net_api.getRemotePort(_net_client));
	}
	catch (e)
	{
		log("Failed to connect to " + host + ":" + _net_port + ".");
	}
}

function net_startServer(applet)
{
	net_disconnect();
	_net_api = applet;
	
	if ( applet == null )
	{
		return false;
	}
	
	log("This computer's address is: " + applet.getLocalIP() );
	
	try
	{
		_net_server = applet.listen(_net_port);
	}
	catch (e)
	{
		log("Error trying to start server: " + e.message);
	}

	if ( _net_server == null )
	{
		log("Failed to start server on port " + _net_port + ".");
		return false;
	}
	
	log("Server started on port " + _net_port);
	
	return net_connect(applet, "localhost");
}

function net_update()
{
	if (_net_api == null || _net_client == null)
	{
		return;
	}
	
	// Check for disconnection
	if (!_net_api.isConnected(_net_client))
	{
		// connection dropped
		log("Connection dropped.");
		net_disconnect();
		return;
	}
	
	if (_net_server != null)
	{
		// Receive any news.
		
		
		// Broadcast it.
		
	}
	
	// Any news from the server today?

}
