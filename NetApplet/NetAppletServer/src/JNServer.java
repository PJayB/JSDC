import java.applet.Applet;
import java.io.*;
import java.net.*;
import javax.swing.*;
import java.awt.*; 

public class JNServer extends Applet implements Runnable {

	private ServerSocket _server;
	private Thread _listenerThread;
	
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
			try
			{
				Socket new_client = _server.accept();
				
				DataOutputStream ps = new DataOutputStream(new_client.getOutputStream());
								
				ps.writeChars("Hi, client!");
				
				new_client.close();
			}
			catch (IOException e)
			{
			}
		}
	}
}
