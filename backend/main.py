from functools import wraps  # Facilitates the use of decorators.
import jwt  # Facilitates encoding, decoding, and validation of JWT tokens.
import os  # Provides a way of using operating system dependent functionality.
from flask import Flask, jsonify, request, abort
from flask_cors import CORS  # Allows handling Cross Origin Resource Sharing (CORS), making cross-origin AJAX possible.


# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)  # Apply CORS to the entire app for handling browser security restrictions in web applications.

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'fallback_secret_key_for_development')

# Authentication Decorator Function
# This decorator is used to ensure that routes are accessible only with a valid JWT token.
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        # Attempt to retrieve the JWT token from the Authorization header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        # If no token is found in the request, return an error response
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            # Decode the token using the secret key to validate it
            jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        except jwt.InvalidTokenError:
            # If token validation fails, return an invalid token error
            return jsonify({'message': 'Token is invalid!'}), 403

        # Proceed with the original function if the token is valid
        return f(*args, **kwargs)
    return decorated_function

# Utility Function to Get User ID from JWT Token
# This function extracts and returns the user ID from a provided JWT token.
def get_user_id_from_token(token):
    try:
        decoded_token = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return decoded_token.get("user_id")
    except jwt.ExpiredSignatureError:
        abort(401, 'Token has expired.')  # Handle expired token
    except jwt.InvalidTokenError:
        abort(401, 'Invalid token.')  # Handle invalid token