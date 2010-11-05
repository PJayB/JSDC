import java.io.*;
import java.net.*;
import java.util.*;

public class JNServer implements Runnable {

	private ServerSocket _server;
	private Thread _listenerThread;
	private Collection<JNClientConnection> _clients;

	protected JNServer(ServerSocket s) {
		_server = s;

		//_listenerThread = new Thread(this);
		//_listenerThread.start();
	}

	protected void finalize() {
		close();
	}

	public boolean isBound() {
		return _server != null && _server.isBound();
	}

	public void removeClient(JNClientConnection client) {
		synchronized (_clients)
		{
			client.close();
			_clients.remove(client);
		}
	}

	public void removeDeadClients() {
		synchronized (_clients)
		{
			// Check if any clients dropped
			Iterator<JNClientConnection> i = _clients.iterator();
			while (i.hasNext()) {
				JNClientConnection client = i.next();

				if (!client.isConnected()) {
					// Dropped
					removeClient(client);
				}
			}
		}
	}

	public String getLocalIP() {
		return _server.getInetAddress().getHostAddress();
	}

	public int getLocalPort() {
		return _server.getLocalPort();
	}

	public JNClientConnection[] getClients() {
		synchronized (_clients)
		{
			return (JNClientConnection[]) _clients.toArray();
		}
	}

	public int getClientCount() {
		synchronized (_clients)
		{
			return _clients.size();
		}
	}

	public void close() {
		if (_listenerThread != null) {
			_listenerThread.stop();
		}

		Iterator<JNClientConnection> i = _clients.iterator();
		while (i.hasNext()) {
			i.next().close();
		}

		_clients.clear();

		try {
			if (_server != null) {
				_server.close();
			}
		} catch (IOException e) {

		}
	}

	public void run() {
		// poll for new connections
		while (true) {
			synchronized (_clients)
			{
				try {
					Socket new_client = _server.accept();

					_clients.add(new JNClientConnection(new_client));
				} catch (IOException e) {
				}
			}
		}
	}
}
