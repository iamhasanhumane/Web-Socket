from flask import Flask, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = "aFYHJ9]7C$=v"
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def home():
    return "Flask Web Socket is Running!"


# Listening for my_event from the frontend
@socketio.on("my_event")
def handleMessage(msg):
    print("Message from React: " + msg)  # Print the message received from React
    emit(
        "my_event_response", f"Message From Flask: {msg}"
    )  # Send the response back to React


@socketio.on("my_number")
def handleNumber(number):
    print("Number received from Number:", number)
    emit("my_event_number", f"Number From Flask: {number}")


@socketio.on("connect")
def connect():
    """event listener for when client connects to the server"""
    print(request.sid)
    print("client has connected")
    emit("my_connection", f"We are connected flask -> React")


# Run the Flask app
if __name__ == "__main__":
    socketio.run(app, host="localhost", port=5000, debug=True)
