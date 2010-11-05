import java.applet.Applet;
import java.awt.*;
import java.net.*;
import java.util.Collection;
import java.util.Iterator;
import java.io.IOException;

public class JNApplet extends Applet {

	private Collection<JNServer> _servers;
	private Collection<JNClientConnection> _clients;

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void init() {
	}

	public void stop() {
		
		Iterator<JNServer> s = _servers.iterator();
		while (s.hasNext())
		{
			JNServer server = s.next();
			server.close();
		}
		
		_servers.clear();
		
		Iterator<JNClientConnection> i = _clients.iterator();
		while (i.hasNext())
		{
			JNClientConnection client = i.next();
			client.close();
		}
		
		_clients.clear();
	}

	public JNServer listen(int port) {
		synchronized(_servers)
		{
			try {
				ServerSocket s = new ServerSocket(port);
				
				JNServer server = new JNServer(s);
				_servers.add(server);
	
				return server;
			} catch (IOException e) {
				return null;
			}
		}
	}

	public JNClientConnection connect(String address, int port) {
		synchronized(_clients)
		{
			try {
				Socket s = new Socket(address, port);
				
				JNClientConnection client = new JNClientConnection(s);
				_clients.add(client);
	
				return client;
			} catch (IOException e) {
				return null;
			}
		}
	}

	public void paint(Graphics g) {
	}
	
	// Public API for servers:
	
	public String getLocalIP()
	{
		try
		{
			return InetAddress.getLocalHost().getHostAddress();
		}
		catch (UnknownHostException e)
		{
			return "(unknown)";
		}
	}
	
	public boolean isConnected(JNServer server)
	{
		return server.isBound();
	}
	
	public JNClientConnection[] getClients(JNServer server)
	{
		return server.getClients();
	}
	
	public int getClientCount(JNServer server)
	{
		return server.getClientCount();
	}
	
	public void close(JNServer server)
	{
		// Close the server
		synchronized(_servers)
		{
			server.close();
			_servers.remove(server);
		}
	}
	
	// Public API for clients:
	
	public String getRemoteIP(JNClientConnection client)
	{
		return client.getRemoteIP();
	}
	
	public int getRemotePort(JNClientConnection client)
	{
		return client.getRemotePort();
	}
	
	public int readBytes(JNClientConnection client, byte[] buf)
	{
		try
		{
			return client.getInputStream().read(buf);
		}
		catch (IOException e)
		{
			return 0;
		}
	}
	
	public void writeBytes(JNClientConnection client, byte[] buf)
	{
		try
		{
			client.getOutputStream().write(buf);
		}
		catch (IOException e)
		{
		}
	}
	
	public boolean isConnected(JNClientConnection client)
	{
		return client.isConnected();
	}
	
	public void close(JNClientConnection client)
	{
		// Close the server
		synchronized(_clients)
		{
			client.close();
			_clients.remove(client);
		}
	}
}
