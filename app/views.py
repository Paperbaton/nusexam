from app import app, api, storage, ivle

from flask import session, abort, redirect, url_for, request, render_template, get_flashed_messages, flash
from flask_restful import Resource


class Module(Resource):
    def get(self, module_code):
        return storage.file_data.get(module_code, [])


class ModuleList(Resource):
    def get(self):
        return storage.modules


class MyModules(Resource):
    def get(self):
        if not session.get('user_id', ''):
            abort(403)
        return ivle.get_modules_list(session['token'])


class LoginStatus(Resource):
    def get(self):
        user_id = session.get('user_id', '')
        return {'login': bool(user_id), 'user_id': user_id}


api.add_resource(Module, '/module/<string:module_code>')
api.add_resource(ModuleList, '/all_modules')
api.add_resource(MyModules, '/my_modules')
api.add_resource(LoginStatus, '/login_status')


@app.route("/")
def landing():
    return render_template('landing.html')


@app.route("/box/")
def base():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('base.html')


@app.route("/link/<module_code>")
def link(module_code):
    url = url_for('base') + '#/module/' + module_code
    if 'user_id' not in session:
        flash(url)
        return redirect(url_for('login'))
    else:
        return redirect(url)


@app.route("/login/")
def login():
    return redirect(ivle.get_ivle_login_url(url_for('login_callback', _external=True)))  # , _scheme='https'


@app.route("/login/callback/")
def login_callback():
    session['token'] = request.args.get('token', '')
    session['user_id'] = ivle.get_user_id(session['token'])
    redirect_urls = get_flashed_messages()
    return redirect(redirect_urls[0] if len(redirect_urls) > 0 else url_for('base'))


@app.route("/logout/")
def logout():
    session.pop('token', '')
    session.pop('user_id', '')
    return redirect(url_for('landing'))


@app.route('/file/<string:file_name>')
def get_file(file_name):
    if not session.get('user_id', ''):
        abort(403)
    return redirect(storage.get_presigned_url(file_name))
