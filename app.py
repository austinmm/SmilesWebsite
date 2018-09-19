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
    space = db.Column(db.String(128), nullable=False, default="amarino")
    title = db.Column(db.String(64), nullable=False)
    story = db.Column(db.String(2048), nullable=False)
    happiness_level = db.Column(db.Integer, nullable=False)
    like_count = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    def __init__(self, title, story, happiness_level, space="amarino"):
        self.title = title
        self.story = story
        self.happiness_level = happiness_level
        self.space = space

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
    order_by = request.args.get('order_by', None)
    count = request.args.get('count', None)

    if count is None:
        count = len(db.session.query(Smile).all())
    else:
        count = int(count)
    if order_by is None:
        order_by = ""
    if space is None:
        space = ""

    if order_by == "created_at":
        query = Smile.query.filter_by(space=space).order_by(Smile.created_at.desc()).limit(count)

    elif order_by == "updated_at":
        query = Smile.query.filter_by(space=space).order_by(Smile.updated_at.desc()).limit(count)
    
    elif order_by == "title":
        query = Smile.query.filter_by(space=space).order_by(Smile.title).limit(count)
    
    elif order_by == "story":
        query = Smile.query.filter_by(space=space).order_by(Smile.story).limit(count)

    elif order_by == "space":
        query = Smile.query.filter_by(space=space).order_by(Smile.space).limit(count)
    
    elif order_by == "happiness_level":
        query = Smile.query.filter_by(space=space).order_by(Smile.happiness_level).limit(count)
    
    elif order_by == "like_count":
        query = Smile.query.filter_by(space=space).order_by(Smile.like_count.desc()).limit(count)
    
    else:
        query = Smile.query.filter_by(space=space).order_by(Smile.id).limit(count) # store the results of your query here
    # TODO 2: set the column which you are ordering on (if it exists)    
    # TODO 3: limit the number of posts based on the count (if it exists)  
    result = []
    for row in query:
        result.append(
            row_to_obj(row) # you must call this function to properly format 
        )

    return jsonify({"status": 1, "smiles": result})



# create
# creates a smile given the params
@app.route(base_url + '/smiles', methods=["POST"])
def create():
    smile = Smile(**request.get_json())
    errors = ""
    if smile is None:
        return "Invalid smile object provided", 500

    if (smile.title is None) or (len(smile.title) > 64):
        errors += "Invalid Smile \"title\" provided\n"

    if (smile.story is None) or (len(smile.story) > 2048):
        errors += "Invalid Smile \"story\" provided\n"

    if (smile.happiness_level is None) or (happiness_level > 3) or (happiness_level < 1):
        errors += "Invalid Smile \"happiness_level\" provided\n"

    if errors != "" :
        return errors, 500

    db.session.add(smile)
    #Pushes new smile to database
    db.session.commit()
    #Grabs Smile object with values populated from database, i.e. updated_at, created_at, id
    db.session.refresh(smile)

    return jsonify({"status": 1, "smile": row_to_obj(smile)}), 200


#shows a smile given the id as a value in the URL
@app.route(base_url + '/smiles/<int:id>', methods=["GET"])
def show(id):
    if id is None:
        return "Invalid id provided", 500
    row = Smile.query.filter_by(id=id).first()
    if row is None:
        return "Unable to find smile with an id of " + id, 500
    return jsonify({"smile": row_to_obj(row), "status": 1}), 200


# deletes all smiles in that space
@app.route(base_url + "/smiles", methods=["DELETE"])
def delete():
    space =  request.args['space']
    if (space is None) or (len(space) > 128):
        return "Invalid smile space provided", 500
    
    smiles = Smile.query.filter_by(space=space).all()
    if smiles is None:
        return "Unable to find smiles within space " + space, 500

    for smile in smiles:
        db.session.delete(smile)
    db.session.commit()
    return  "Successfully deleted all smiles within space " + space, 200


#updates the like value of a smile given an ID and increments the count by 1
@app.route(base_url + "/smiles/<int:id>/like", methods=["POST"])
def like(id):
    smile = Smile.query.filter_by(id=id).first()
    if smile is None:
        return "Unable to find smile with an id of " + id, 500
    smile.like_count+=1
    db.session.commit()
    return jsonify({"smile":row_to_obj(smile), "status":1}), 200


#converts a Smile object to a json object
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
    #db.create_all() # creates the tables you've provided
    app.run()       # runs the Flask application  

if __name__ == '__main__':
    main()
