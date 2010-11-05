import java.applet.Applet;
import java.io.*;
import java.net.*;

import javax.swing.*;
import java.awt.*; 
import java.util.*;

public class JNServer extends Applet implements Runnable {

	private ServerSocket _server;
	private Thread _listenerThread;
	private Collection<Socket> _clients;
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void init()
	{
		try
		{
			_server = new ServerSocket(44444);
		}
		catch (IOException e)
		{
			// failed to start :(
		}
		
		if (_server != null)
		{
			_listenerThread = new Thread(this);
			_listenerThread.start();
		}
	}
	
	public void stop()
	{
		if ( _listenerThread != null )
		{
			_listenerThread.stop();
		}
		
		Iterator<Socket> i = _clients.iterator();
		while (i.hasNext())
		{
			try
			{
				i.next().close();
			}
			catch (IOException e)
			{
			}
		}
		
		try
		{
			if (_server != null) { _server.close(); }
		}
		catch (IOException e)
		{
			
		}
	}
	
	public void paint(Graphics g)
	{
		if (_server != null)
		{
			g.drawString("Server started.", 0, 20);
		}
		else
		{
			g.drawString("Server failed to initialize.", 0, 20);
		}
	}
	
	public void run()
	{
		// poll for new connections
		while (true)
		{
			synchronize(_clients)
			{
				try
				{
					Socket new_client = _server.accept();
					
					_clients.add(new_client);
				}
				catch (IOException e)
				{
				}
			{
		}
	}
}
