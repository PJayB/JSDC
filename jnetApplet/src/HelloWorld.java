import java.io.*;
import java.net.*;
import javax.swing.*;

public class HelloWorld extends JApplet
{
	/**
	 * 
	 */
	private static final long	serialVersionUID	= 1L;
	private static ServerSocket _serverSocket;
	private static Socket _serverToClient;
	private static Socket _clientToServer;
	
    private static JTextArea _log;
    
    public HelloWorld()
    {
    	_log = new JTextArea(200,100);
        _log.setText("Hello World\n");
        getContentPane().add(_log);
    }
    
    public static void log(String s)
    {
    	_log.setText( _log.getText() + s + '\n' );
    }

    private static void closeSocket(Socket s)
	{
		try
		{
			if ( s != null ) s.close();
		}
		catch (IOException e)
		{
			
		}
	}
	
	private static void closeServer(ServerSocket s)
	{
		try
		{
			if ( s != null ) s.close();
		}
		catch (IOException e)
		{
			
		}
	}
	
	/**
	 * @param args
	 */
	public static void doNetworkTest(String data)
	{
		_serverSocket = null;
		_serverToClient = null;
		_clientToServer = null;
		
		try
		{
			_serverSocket = new ServerSocket(44444);
			_clientToServer = new Socket("localhost", 44444);
			
			_serverToClient = _serverSocket.accept();
			
			BufferedReader _clientRecv = new BufferedReader(new InputStreamReader(_clientToServer.getInputStream()));
			BufferedReader _serverRecv = new BufferedReader(new InputStreamReader(_serverToClient.getInputStream()));
			
			PrintStream _clientSend = new PrintStream(_clientToServer.getOutputStream());
			PrintStream _serverSend = new PrintStream(_serverToClient.getOutputStream());
			
			_clientSend.print("Client: " + data + "\n");
			
			String responseLine;
            while ((responseLine = _serverRecv.readLine()) != null)
            {
            	System.out.println(responseLine);
            	if ( !_serverRecv.ready() ) break;
            }
			
        	_serverSend.print("Server: Thanks, client!\n");
        	 
        	while ((responseLine = _clientRecv.readLine()) != null)
            {
            	System.out.println(responseLine);
            	if ( !_clientRecv.ready() ) break;
            }
            
            System.out.println("Fin.");

			_serverSend.close();
			_clientSend.close();
			_serverRecv.close();
			_clientRecv.close();
		}
		catch(IOException e)
		{
			System.out.println(e);
		}
		finally
		{	
			closeSocket( _serverToClient );
			closeSocket( _clientToServer );
			closeServer( _serverSocket );
		}
	}

}
