import java.applet.Applet;
import java.io.*;
import java.net.*;
import javax.swing.*;
import java.awt.*; 

public class JNClient extends Applet {

	private Socket _socket;
	private BufferedReader _recv;

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void init()
	{
		try
		{
			_socket = new Socket("localhost", 44444);
			_recv = new BufferedReader(new InputStreamReader(_socket.getInputStream()));
		}
		catch (IOException e)
		{
			
		}
	}
	
	public void stop()
	{
		try
		{
			if ( _socket != null ) _socket.close();
		}
		catch (IOException e)
		{
		}
	}
	
	public void paint(Graphics g)
	{
		if (_socket != null)
		{
			g.drawString("Client started.", 0, 0);
		}
		else
		{
			g.drawString("Client failed to connect.", 0, 0);
		}
		
		try
		{
			if (_recv.ready())
			{
				String r = _recv.readLine();
				g.drawString(r, 0, 20);
			}
		}
		catch(IOException e)
		{
		}
	}
}
