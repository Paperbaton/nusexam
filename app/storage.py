import json

from boto3.session import Session
from app import app

AWS_KEY = app.config['AWS_KEY']
AWS_SECRET = app.config['AWS_SECRET']
AWS_REGION = app.config['AWS_REGION']
AWS_S3_BUCKET = app.config['AWS_S3_BUCKET']

session = Session(aws_access_key_id=AWS_KEY, aws_secret_access_key=AWS_SECRET, region_name=AWS_REGION)

s3 = session.client('s3')


def get_presigned_url(file_name):
    return s3.generate_presigned_url('get_object', {'Bucket': AWS_S3_BUCKET, 'Key': file_name})


with open('modules.json', 'r') as f:
    modules = json.load(f)

with open('file_data.json', 'r') as f:
    file_data = json.load(f)
