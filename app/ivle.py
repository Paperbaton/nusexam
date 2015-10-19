from app import app

import requests

IVLE_APIKEY = app.config['IVLE_APIKEY']
IVLE_TIMEOUT = 60


def get_user_id(token):
    request = requests.get(
        'https://ivle.nus.edu.sg/api/Lapi.svc/Profile_View?APIKey=%s&AuthToken=%s' % (IVLE_APIKEY, token),
        timeout=IVLE_TIMEOUT)
    data = request.json()['Results'][0]
    return data['UserID']


def get_ivle_login_url(callback_url):
    return "https://ivle.nus.edu.sg/api/login/?apikey=%s&url=%s" % (IVLE_APIKEY, callback_url)


def get_modules_list(token):
    request = requests.get(
        'https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=%s&AuthToken=%s&Duration=0&IncludeAllInfo=false' % (
            IVLE_APIKEY, token), timeout=IVLE_TIMEOUT)
    if request.json()['Comments'] == 'Invalid login!':
        raise Exception()  # TODO
    # modules_list = []
    # for module in request.json()['Results']:
    #     modules_list.append({x: module[x] for x in ['CourseCode', 'ID', 'CourseName']})
    # for module in modules_list:
    #     module['CourseName'] = titlecase(module['CourseName'])
    def parse_code(code):
        return code.split('/')[0].strip()

    return sorted(list(set([parse_code(x['CourseCode']) for x in request.json()['Results']])))
