from flask import Flask, jsonify, request
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy
from datetime import datetime
import sys

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
    space = db.Column(db.String(10), nullable=False, default="amarino")
    title = db.Column(db.String(64), nullable=False)
    story = db.Column(db.String(2048), nullable=False)
    happiness_level = db.Column(db.Integer, nullable=False)
    like_count = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    def __init__(self, title, story, happiness_level):
        self.title = title
        self.story = story
        self.happiness_level = happiness_level

    # TODO 1: add all of the columns for the other table attributes

base_url = '/api'

# index
# loads all smiles given a space, count parameter and order_by parameter 
# if the count param is specified and doesn't equal all limit by the count
# if the order_by param is specified order by param otherwise load by updated_at desc
# return JSON
@app.route(base_url + '/smiles', methods=["GET"])
def index():
    space = request.args.get('space', None) 
    count = request.args.get('count', None)
    order_by = request.args.get('order_by', None)
    errors = ""
    if space is None:
        errors += "Must provide space"

    elif space != "amarino":
        errors += "Invalid space provided"

    if count is None:
        count = 10

    if order_by is None:
        order_by = "created_at"

    if errors != "":
        return errors, 500
    
    query = Smile.query.all() # store the results of your query here    
    # TODO 2: set the column which you are ordering on (if it exists)    
    # TODO 3: limit the number of posts based on the count (if it exists)  
    result = []
    for row in query:
        result.append(
            row_to_obj(row) # you must call this function to properly format 
        )

    return jsonify({"status": 1, "smiles": result})


@app.route(base_url + '/smiles', methods=["POST"])
def create():
    print(request.get_json(), file=sys.stderr)
    smile = Smile(**request.get_json())
    #data = request.get_json()
    #smile = Smile(data["title"], data["story"], data["happiness_level"])
    errors = ""
    if smile is None:
        return "JSON object cannot be empty", 500

    if smile.title is None:
        errors += "Smile object does not contain a \"title\"\n"

    if smile.story is None:
        errors += "Smile object does not contain a \"story\"\n"

    if smile.happiness_level is None:
        errors += "Smile object does not contain a \"happiness_level\"\n"

    if errors != "" :
        return errors, 500

    print("Past Conditionals", file=sys.stderr)
    db.session.add(smile)
    #Pushes new smile to database
    db.session.commit()
    db.session.refresh(smile)

    return jsonify({"status": 1, "smile": row_to_obj(smile)}), 200


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
