from os import path, urandom


BASE_DIRECTORY = path.abspath(path.dirname(__file__))
DEBUG = True
SECRET_KEY = urandom(64)
IVLE_APIKEY = ''

AWS_KEY = ''
AWS_SECRET = ''
AWS_REGION = 'ap-southeast-1'
AWS_S3_BUCKET = 'nusexam'
