from flask import Flask, jsonify, request
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy

import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlalchemy-demo.db'

db = sqlalchemy.SQLAlchemy(app)
#create new smile 
#u = User(username='john', email='john@example.com')
#db.session.add(u)
#db.session.commit()

class Smile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    space = db.Column(db.String, primary_key=False)
    title = db.Column(db.String, primary_key=False)
    story = db.Column(db.String, primary_key=False)
    happiness_level = db.Column(db.Integer, primary_key=False)
    like_count = db.Column(db.Integer, primary_key=False)
    created_at = db.Column(db.Float, primary_key=False)
    updated_at = db.Column(db.String, primary_key=False)
    # TODO 1: add all of the columns for the other table attributes

base_url = '/api/'

# index
# loads all smiles given a space, count parameter and order_by parameter 
# if the count param is specified and doesn't equal all limit by the count
# if the order_by param is specified order by param otherwise load by updated_at desc
# return JSON
@app.route(base_url + 'smiles')
def index():
    space = request.args.get('space', None) 
    count = reques.args.get('count', None)
    order_by = request.args.get('order_by', None)

    if space is None:
        return "Must provide space", 500
    if count is None:
        return "Must provide count", 500
    if order_by is None:
        order_by = 'created_at'
    
    query = Smile.query.all() # store the results of your query here 
    
    # TODO 2: set the column which you are ordering on (if it exists)
    
    # TODO 3: limit the number of posts based on the count (if it exists)

    
    result = []
    for row in query:
        result.append(
            row_to_obj(row) # you must call this function to properly format 
        )

    return jsonify({"status": 1, "smiles": result})

@app.route(base_url + 'smiles/create')
def create(data):
    #data = request.args.post('data', None) 

    
    #query = Smile.query.all() # store the results of your query here 
    
    # TODO 2: set the column which you are ordering on (if it exists)
    
    # TODO 3: limit the number of posts based on the count (if it exists)
    for smile in data:
        print(smile.title)

    return jsonify({"status": 1, "smiles": data})


# show
# loads a smile given the id as a value in the URL

# TODO 4: create the route for show


# create
# creates a smile given the params

# TODO 5: create the route for create


# delete_smiles
# delete given an space
# delete all smiles in that space

# TODO 6: create the route for delete_smiles


# post_like
# loads a smile given an ID and increments the count by 1

# TODO 7: create the route for post_like 


def row_to_obj(row):
    row = {
            "id": row.id,
            "space": row.space,
            "title": row.title,
            "story": row.story,
            "happiness_level": row.happiness_level,
            "like_count": row.like_count,
            "created_at": row.created_at,
            "updated_at": row.updated_at
        }

    return row

  
def main():
    db.create_all() # creates the tables you've provided
    app.run()       # runs the Flask application  

if __name__ == '__main__':
    main()
