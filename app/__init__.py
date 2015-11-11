from flask import Flask
from flask.ext.compress import Compress
from flask.ext.openid import OpenID
from flask_restful import Api

app = Flask(__name__)
api = Api(app, prefix='/api')

app.config.from_object('config')

oid = OpenID(app, '/tmp/nusexam_oid/', safe_roots=[])

from app import views

Compress(app)
