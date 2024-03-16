from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import oracledb
from sqlalchemy.pool import NullPool
from sqlalchemy import create_engine, Column, Integer, String, Numeric, TIMESTAMP, ForeignKey

app = Flask(__name__)

# Assuming your database credentials and connection string are correct
un = 'DEVELOPER'  # Database username
pw = 'AngeleeRiosRamon1999!'  # Database password
dsn = "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=gd51c296542b64f_version3_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"

# Create a pool of database connections
pool = oracledb.create_pool(user=un, password=pw, dsn=dsn)

# Configure SQLAlchemy for Flask with the Oracle database
app.config['SQLALCHEMY_DATABASE_URI'] = f'oracle+oracledb://{un}:{pw}@{dsn}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': pool.acquire,
    'poolclass': NullPool
}
app.config['SQLALCHEMY_ECHO'] = True  # Consider turning off in production

# Initialize the database with the app
db = SQLAlchemy(app)

# Assuming the User class is defined in this script or imported from another module
# For simplicity, I'll assume it's defined here as per your provided schema

class User(db.Model):
    __tablename__ = 'USERS'
    ID = db.Column(db.Integer, primary_key=True)
    NAME = db.Column(db.String(255))
    HASHED_PASSWORD = db.Column(db.String(255))

# The simple test to calculate the number of users in the database
def test_db_connectivity():
    try:
        num_users = db.session.query(User).count()
        print(f"Number of users in the database: {num_users}")
    except oracledb.exceptions.OperationalError as e:
        print(f"An error occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    with app.app_context():
        test_db_connectivity()
