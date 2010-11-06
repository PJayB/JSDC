
var _net_api = null;
var _net_server = null;
var _net_client = null;

var _net_port = 44444;

function net_init(applet)
{
	_net_api = applet;
}

function net_closeServer()
{	
	if ( _net_api == null )
	{
		return;
	}
	
	if (_net_server != null)
	{
		try { _net_server.close(); } catch(e) {}
		_net_server = null;
	}
}

function net_disconnectClient()
{	
	if ( _net_api == null )
	{
		return;
	}
	
	if (_net_client != null)
	{
		try { _net_client.close(); } catch(e) {}
		_net_client = null;
	}
}

function net_connect(host)
{
	if ( _net_api == null )
	{
		return false;
	}
	
	net_disconnectClient();
	
	try
	{
		_net_client = _net_api.connect(host, _net_port);
		log("Connected to " + _net_client.getRemoteIP(_net_client) + ":" + _net_client.getRemotePort(_net_client));
	}
	catch (e)
	{
		log("Failed to connect to " + host + ":" + _net_port + ". (" + e.message + ")");
	}
}

function net_startServer()
{
	if ( _net_api == null )
	{
		return false;
	}
	
	net_disconnectClient();
	net_closeServer();
	
	log("This computer's address is: " + _net_api.getLocalIP() );
	
	try
	{
		_net_server = _net_api.listen(_net_port);
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
	
	return net_connect("localhost");
}

function net_update()
{
	if (_net_api == null || _net_client == null)
	{
		return;
	}
	
	// Check for disconnection
	if (!_net_client.isConnected())
	{
		// connection dropped
		log("Connection dropped.");
		net_disconnectClient();
		return;
	}
	
	if (_net_server != null)
	{
		// Receive any news.
		
		
		// Broadcast it.
		
	}
	
	// Any news from the server today?

}
