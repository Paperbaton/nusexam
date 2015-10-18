from flask import Flask
from flask_restful import Api

app = Flask(__name__)
api = Api(app, prefix='/api')

app.config.from_object('config')

from app import views
