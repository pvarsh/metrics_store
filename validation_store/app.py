import collections
import json

import simplejson
import flask
from flask.ext.navigation import Navigation

import db

app = flask.Flask(__name__)
nav = Navigation(app)

nav.Bar('top', [
    nav.Item('Home', 'index'),
    nav.Item('Upload', 'upload_file'),
    nav.Item('Reports', 'list_reports'),
])


@app.route('/')
def index():
    return flask.render_template('index.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if flask.request.method == 'POST':
        f = flask.request.files['validation_report']
        uploaded_by = flask.request.form.get('uploaded_by')
        writeup = flask.request.form.get('writeup')
        x = f.read()
        x_obj = json.loads(x)
        report_type = x_obj['type']
        report_subtype = x_obj['subtype']
        dump = simplejson.dumps(x_obj, ignore_nan=True)

        new_id = db.insert_report(report_type, report_subtype, dump, uploaded_by, writeup)
        return flask.redirect(flask.url_for('get_report', report_id=new_id))

    if flask.request.method == 'GET':
        return flask.render_template('upload_file.html')


@app.route('/reports', methods=['GET', 'POST'])
def list_reports():
    if flask.request.method == 'GET':
        reports = db.list_reports()
        return flask.render_template('reports.html', reports=reports)
    if flask.request.method == 'POST':
        report_ids = flask.request.form.get('report_ids_to_compare')
        return flask.redirect(flask.url_for('compare_reports', ids=report_ids))



@app.route('/reports/<int:report_id>')
def get_report(report_id):
    report = db.get_report(report_id)
    scripts = {
        'cell_level': 'cell_report.js',
        'column_level': 'column_report.js',
    }
    script = scripts[report['subtype']]
    return flask.render_template('report.html', report=report, script=script)

@app.route('/compare')
def compare_reports():
    report_ids = [int(id_) for id_ in flask.request.args.get('ids').split(',')]
    return flask.render_template('compare.html', report_ids=report_ids, script='compare.js')

@app.route('/api/compare')
def api_compare_reports():
    report_ids = flask.request.args.get('ids').split(',')
    classes = collections.defaultdict(lambda: collections.defaultdict(list))
    for report_id in report_ids:
        report = db.get_report(report_id)
        for binary_metrics in report['report']['binary_metrics']:
            run_summary = {
                'created_at': report['report'].get('created_at'),
                'uploaded_by': report.get('uploaded_by'),
                'config_version': 'fake_config',
                'metrics': {
                    metric: binary_metrics.get(metric)
                    for metric in
                    ['accuracy', 'precision', 'recall', 'f1_score']
                }
             }
            classes[binary_metrics['class']]['validation_runs'].append(run_summary)
    return flask.jsonify([{'class': class_name, 'validationRuns': foo['validation_runs']} for class_name, foo in classes.items()])

@app.route('/api/reports/<int:report_id>')
def api_get_report(report_id):
    return flask.jsonify(db.get_report(report_id))
