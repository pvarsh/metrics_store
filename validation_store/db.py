import os

import psycopg2
import psycopg2.extras

TABLE_NAME = 'validation_reports'
INSERT_QUERY_TEMPLATE = "INSERT INTO {} (type, subtype, report, uploaded_by, writeup) VALUES (%s, %s, %s, %s, %s) RETURNING ID".format(TABLE_NAME)

ENV_VARIABLES = {
    'host': '',
    'port': '',
    'user': '',
    'database': '',
    'password': '',
}

def dsn():
    """Produces the datasource name as configured by environment variables."""

    def _make_dsn():
        connection_params = {key: os.environ[val] for key, val in ENV_VARIABLES.items()}
        return 'postgresql://{user}:{password}@{host}:{port}/{database}'.format(**connection_params)

    return _make_dsn()


def insert_report(report_component, report_type, report, uploaded_by, writeup):
    with psycopg2.connect(dsn()) as connection:
        with connection.cursor() as cursor:
            cursor.execute(INSERT_QUERY_TEMPLATE, (report_component, report_type, report, uploaded_by, writeup))
            new_id = cursor.fetchone()[0]
            return new_id


def list_reports():
    query = "SELECT * FROM {}".format(TABLE_NAME)
    with psycopg2.connect(dsn()) as connection:
        with connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute(query)
            return [dict(item) for item in cursor.fetchall()]


def get_report(id_):
    query = "SELECT * FROM {} WHERE id = %s".format(TABLE_NAME)
    with psycopg2.connect(dsn()) as connection:
        with connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute(query, (id_,))
            report = cursor.fetchone()
            return dict(report)
