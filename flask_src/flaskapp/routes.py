import secrets
import os
from flask import render_template, flash, redirect, url_for, redirect, request, abort, jsonify
from flaskapp import app
from flaskapp.models import User


@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html', title='Home')


@app.route('/about')
def about():
    return render_template('about.html', title="About")


# API trials with sample data
# Ref: https://programminghistorian.org/en/lessons/creating-apis-with-python-and-flask
sample_data = [
        {'id': 0,
         'title': 'A Fire Upon the Deep',
         'author': 'Vernor Vinge',
         'first_sentence': 'The coldsleep itself was dreamless.',
         'year_published': '1992'},
        {'id': 1,
         'title': 'The Ones Who Walk Away From Omelas',
         'author': 'Ursula K. Le Guin',
         'first_sentence': 'With a clamor of bells that set the swallows soaring, ' +
                           'the Festival of Summer came to the city Omelas, bright-towered by the sea.',
         'published': '1973'},
        {'id': 2,
         'title': 'Dhalgren',
         'author': 'Samuel R. Delany',
         'first_sentence': 'to wound the autumnal city.',
         'published': '1975'}
    ]


@app.route('/api/v1/resources/test/all', methods=['GET'])
def api_test_all():
    return jsonify(sample_data)


@app.route('/api/v1/resources/test', methods=['GET'])
def api_test_select():
    if 'id' in request.args:  # if id was specified in request arguments
        req_id = int(request.args['id'])  # type conversion (str to int)
    else:
        return "No id provided. Specify an id by appending \"?id=x\" to the end of your URL"

    results = []
    for item in sample_data:
        if item['id'] == req_id:
            results.append(item)

    return jsonify(results)
