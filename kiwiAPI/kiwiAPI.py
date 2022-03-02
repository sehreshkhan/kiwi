import flask
from flask_cors import CORS
import json
from flask import jsonify, request
import psycopg2 
import os

dbconn = {'database': "kiwi",
          'user': "kiwi",
          'port': "5432",
          'password': "kiwi"}

app = flask.Flask(__name__)
CORS(app, support_credentials=True, resources={r"/*": {"origins": "*"}})
app.config["DEBUG"] = True

@app.route('/post_permission/<data>', methods=['POST'])
def post_data(data):
    res = insert_permission(data)
    return jsonify({"step": "1"})

@app.route('/remove_permission/<data>', methods=['Delete'])
def remove_data(data):
    res = remove_permission(data)
    return jsonify({"step": "1"})

@app.route('/doors', methods=['GET'])
def get_doors():
    all_doors = get_all_doors()
    response = jsonify(all_doors)
    return response

@app.route('/doors/<id>', methods=['GET'])
def get_door(id):
    door = get_door_by_id(id)
    door_users =get_users_by_door_id(id) 
    other_users= get_users_not_by_door_id(id)
    response = jsonify({"door": door, "permitted_users": door_users, "other_users":other_users})
    return response

@app.route('/doors/users/<id>', methods=['GET'])
def get_door_users(id):
    door_users= get_users_by_door_id(id)
    response = jsonify(door_users)
    return response



pg_conn = psycopg2.connect(**dbconn)
pg_cur = pg_conn.cursor()

def get_all_doors():
    sql = """SELECT d.id, d.name, d.installation_time, a.*
            FROM doors d
            INNER JOIN addresses a
            ON d.id = a.id
            """
    pg_cur.execute(sql)
    data = pg_cur.fetchall()
    return data

def get_door_by_id(id):
    sql = """SELECT d.*, a.*
            FROM doors d
            INNER JOIN addresses a
            ON d.id = a.id
            where d.id="""+id
    pg_cur.execute(sql)
    data = pg_cur.fetchall()
    return data

def get_users_by_door_id(id):
    sql = """SELECT u.*
            FROM doors d, user_door_permissions dp, users u
            where d.id = dp.door_id AND u.id = dp.user_id
            AND d.id="""+id
    pg_cur.execute(sql)
    data = pg_cur.fetchall()
    return data

def get_users_not_by_door_id(id):
    sql = """select u.* from users u 
            where u.id <> ALL (SELECT u.id
            FROM doors d, user_door_permissions dp, users u
            where d.id = dp.door_id AND dp.user_id =u.id
            AND d.id="""+id+")"
    pg_cur.execute(sql)
    data = pg_cur.fetchall()
    return data

def insert_permission(data):
    params = data.split(',')
    sql = """INSERT INTO user_door_permissions (user_id, door_id, creation_time)
            VALUES ("""+params[0]+", "+ params[1]+", TIMESTAMP '"+ params[2]+"')"
    pg_cur.execute(sql)
    res = pg_conn.commit()
    return res

def remove_permission(data):
    params = data.split(',')
    sql = """delete from user_door_permissions 
            where user_id =""" +params[0]+"AND door_id="+params[1]         
    print(type(data))
    print(sql)
    pg_cur.execute(sql)
    res = pg_conn.commit()
    return res

if __name__ == '__main__':
    app.run(host=os.getenv("app_host"), port="5000")