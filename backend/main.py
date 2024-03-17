from flask.views import MethodView
from models import db, User, Portfolio, PortfolioDetail # Import the database object from the models file.
from functools import wraps  # Facilitates the use of decorators.
import jwt  # Facilitates encoding, decoding, and validation of JWT tokens.
import os  # Provides a way of using operating system dependent functionality.
import bcrypt
import re  # Provides password hashing functions.
import oracledb  # Additional Oracle database integration, ensure correct import if repetitive.
from sqlalchemy.pool import NullPool  # Provides a NullPool implementation for SQLAlchemy.
from flask import Flask, jsonify, request, abort
from flask_cors import CORS  # Allows handling Cross Origin Resource Sharing (CORS), making cross-origin AJAX possible.
from flask.views import MethodView
from dotenv import load_dotenv
load_dotenv()  # This loads the env variables from .env file if present


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

# Database Credentials and Connection String
# These variables store the database name, password, and DSN (Data Source Name) for connecting to the Oracle database.
# It's highly recommended to manage sensitive data like name and passwords securely, for example, via environment variables.
un = 'DEVELOPER'  # Database name
pw = 'AngeleeRiosRamon1999!'  # Database password - consider using a more secure approach for production
dsn = "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=gd51c296542b64f_version3_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"

# Crear un pool de conexiones a la base de datos
pool = oracledb.create_pool(user=un, password=pw, dsn=dsn)

# Configuración de SQLAlchemy para Flask
app.config['SQLALCHEMY_DATABASE_URI'] = f'oracle+oracledb://{un}:{pw}@{dsn}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': pool.acquire,
    'poolclass': NullPool
}
app.config['SQLALCHEMY_ECHO'] = True  # cambiar en prod

# Inicializar la base de datos con la aplicación
db.init_app(app)

# Helper Functions
def hash_password(plain_text_password):
    """Hash a plaintext password using bcrypt."""
    return bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def is_password_valid(password):
    """Check if the provided password meets the application's complexity requirements."""
    return (len(password) >= 8 and re.search("[a-z]", password) and re.search("[A-Z]", password) 
            and re.search("[0-9]", password) and re.search("[!@#$%^&*(),.?\":{}|<>]", password))

@app.route('/handle_register', methods=['POST'])
def register():
    """Handle user registration."""
    try:
        name = request.json.get('name', '').strip()
        password = request.json.get('password', '')

        if not name or not password:
            return jsonify({"error": "NAME and password are required"}), 400

        if not is_password_valid(password):
            return jsonify({"error": "Password does not meet the complexity requirements"}), 400

        if User.query.filter_by(NAME=name).first():
            return jsonify({"error": "NAME already exists"}), 409

        hashed_password = hash_password(password)
        new_user = User(NAME=name, HASHED_PASSWORD=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        # Ideally, log this exception.
        return jsonify({"error": "An error occurred during registration"}), 500
    
@app.route('/handle_login', methods=['POST'])
def login():
    """Handle user login."""
    try:
        name = request.json.get('name', '').strip()
        password = request.json.get('password', '')

        if not name or not password:
            return jsonify({"error": "NAME and password are required"}), 400

        user = User.query.filter_by(NAME=name).first()
        if user is None or not bcrypt.checkpw(password.encode('utf-8'), user.HASHED_PASSWORD.encode('utf-8')):
            return jsonify({"error": "Invalid NAME or password"}), 401

        return jsonify({"message": "Login successful"}), 200
    except Exception as e:
        # Ideally, log this exception.
        return jsonify({"error": "An error occurred during login"}), 500


class UserPortfolioAPI(MethodView):
    """
    Fetches and returns the portfolio details for a specific user, including total value,
    return on investment (ROI), and details of each stock within the portfolio.
    """
    
    def get(self, user_id):
        """
        Retrieves portfolio information for a specified user ID.
        
        Args:
            user_id (int): The ID of the user whose portfolio information is being requested.
        
        Returns:
            A JSON response containing the portfolio details or an error message.
        """
        try:
            # Fetch the user's portfolio based on the user_id. Utilize eager loading of related entities.
            user_portfolio = Portfolio.query.options(db.joinedload(Portfolio.details)).filter_by(USERID=user_id).first()
            
            if not user_portfolio:
                return jsonify({"error": "Portfolio not found."}), 404

            # Compile details of each stock within the portfolio
            stocks_details = [
                {
                    "symbol": detail.TICKERSYMBOL,
                    "quantity": detail.QUANTITY,
                    "last_closing_price": detail.LASTCLOSINGPRICE,
                    "total_stock_value": detail.TOTALSTOCKVALUE
                }
                for detail in user_portfolio.details
            ]

            # Construct and return the aggregated data
            portfolio_data = {
                "total_portfolio_value": user_portfolio.TOTALPORTFOLIOVALUE,
                "roi": user_portfolio.TOTALROI,
                "stocks_details": stocks_details
            }

            return jsonify(portfolio_data)
        except Exception as e:
            # Log any errors encountered during the query.
            db.session.rollback()  # Ensure any failed transactions are rolled back
            app.logger.error(f"Error: {e}")
            return jsonify({"error": "An error occurred fetching portfolio details."}), 500

# Assuming you have a Flask app instance and have set up routing appropriately
# Example of how you might add the view to your app:
user_portfolio_view = UserPortfolioAPI.as_view('user_portfolio_api')
app.add_url_rule('/api/user/<int:user_id>/portfolio', view_func=user_portfolio_view, methods=['GET'])


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')  # Make 