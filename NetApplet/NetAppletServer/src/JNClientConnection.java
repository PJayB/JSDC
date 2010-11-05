import java.net.*;
import java.io.*;

public class JNClientConnection {

	private Socket _socket;

	protected JNClientConnection(Socket s) {
		_socket = s;
	}

	protected void finalize() {
		close();
	}

	public String getRemoteIP() {
		InetAddress na = _socket.getInetAddress();
		if (na != null) {
			return na.getHostAddress();
		}
		return "";
	}

	public int getRemotePort() {
		return _socket.getPort();
	}

	public int getLocalPort() {
		return _socket.getLocalPort();
	}

	public boolean isConnected() {
		return _socket.isConnected();
	}

	public void close() {
		try {
			_socket.close();
		} catch (IOException e) {
		}
	}

	public InputStream getInputStream() throws IOException {
		return _socket.getInputStream();
	}

	public OutputStream getOutputStream() throws IOException {
		return _socket.getOutputStream();
	}
}
