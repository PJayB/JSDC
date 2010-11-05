import java.applet.Applet;
import java.awt.*;
import java.net.*;
import java.io.IOException;

public class JNApplet extends Applet {

	private JNServer _server = null;

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void init() {

	}

	public void stop() {
		closeServer();
	}

	public void closeServer() {
		if (_server != null) {
			_server.close();
			_server = null;
		}
	}

	public JNServer listen(int port) {
		closeServer();

		_server = new JNServer(port);

		return _server;
	}

	public JNClientConnection connect(String address, int port) {
		try {
			Socket s = new Socket(address, port);

			return new JNClientConnection(s);
		} catch (IOException e) {
			return null;
		}
	}

	public void paint(Graphics g) {
	}
}
