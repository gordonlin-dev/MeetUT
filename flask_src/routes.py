import secrets
import os
from flask import render_template, flash, redirect, url_for, redirect, request, abort
import app


@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html', title='Home')


@app.route('/about')
def about():
    return render_template('about.html', title="About")
