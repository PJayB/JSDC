import java.net.*;
import java.io.*;

public class JNClientConnection 
{

	private Socket _socket;
	private DataInputStream _reader;
	private DataOutputStream _writer;
	
	public JNClientConnection(Socket s)
	{
		_socket = s;
		try
		{
			_reader = new DataInputStream(s.getInputStream());
			_writer = new DataOutputStream(s.getOutputStream());
		}
		catch (IOException e)
		{
		}
	}
	
	public String getRemoteIP()
	{
		InetAddress na = _socket.getInetAddress();
		if (na != null)
		{
			return na.getHostAddress();
		}
		return "";
	}
	
	public int getPort()
	{
		return _socket.getPort();
	}
	
	public boolean isConnected()
	{
		return _socket.isConnected();
	}
	
	public int available() throws IOException
	{
		return _reader.available();
	}
	
	public void close()
	{
		try
		{
			_socket.close();
		}			
		catch (IOException e)
		{
		}
	}
	
	public DataInputStream getInputStream()
	{
		return _reader;
	}
	
	public DataOutputStream getOutputStream()
	{
		return _writer;
	}
}
