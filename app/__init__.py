from flask import Flask
from flask_restful import Api
from flask.ext.compress import Compress

app = Flask(__name__)
api = Api(app, prefix='/api')

app.config.from_object('config')

from app import views

Compress(app)
