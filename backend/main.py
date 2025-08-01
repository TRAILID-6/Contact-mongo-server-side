from flask import request, jsonify
from config import app, contacts_col, cache
from bson import ObjectId, errors
from pymongo.errors import PyMongoError


# Helper function to convert ObjectId to string for JSON serialization
def convert_objectid(data):
    if data and "_id" in data:
        data["_id"] = str(data["_id"])
    return data


@app.route("/contacts", methods=["GET"])
@cache.cached(timeout=None)  # The cache will now persist indefinitely
def get_contacts():
    print("Fetching contacts from the cache...")
    contacts = contacts_col.find()
    json_contacts = [convert_objectid(contact) for contact in contacts]
    return jsonify({"contacts": json_contacts})


@app.route("/create_contact", methods=["POST"])
def create_contact():
    data = request.json
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")

    if not first_name or not last_name or not email:
        return (
            jsonify({"message": "You must include a first name, last name and email"}),
            400,
        )

    # Check if a contact with the same email already exists
    if contacts_col.find_one({"email": email}):
        return jsonify({"message": "A user with that email already exists"}), 409

    new_contact = {
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
    }

    try:
        contacts_col.insert_one(new_contact)
        cache.clear()  # Clears the cache after a new contact is created
    except PyMongoError as e:
        return jsonify({"message": str(e)}), 500

    return jsonify({"message": "User created!"}), 201


@app.route("/update_contact/<string:user_id>", methods=["PATCH"])
def update_contact(user_id):
    try:
        object_id = ObjectId(user_id)
    except errors.InvalidId:
        return jsonify({"message": "Invalid user ID"}), 400

    contact = contacts_col.find_one({"_id": object_id})
    if not contact:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    update_data = {}
    if "firstName" in data:
        update_data["firstName"] = data["firstName"]
    if "lastName" in data:
        update_data["lastName"] = data["lastName"]
    if "email" in data:
        update_data["email"] = data["email"]

    if update_data:
        try:
            contacts_col.update_one({"_id": object_id}, {"$set": update_data})
            cache.clear()  # Clears the cache after an update
        except PyMongoError as e:
            return jsonify({"message": str(e)}), 500
        return jsonify({"message": "User updated."}), 200

    return jsonify({"message": "No data to update"}), 400


@app.route("/delete_contact/<string:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    try:
        object_id = ObjectId(user_id)
    except errors.InvalidId:
        return jsonify({"message": "Invalid user ID"}), 400

    result = contacts_col.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        return jsonify({"message": "User not found"}), 404

    cache.clear()  # Clears the cache after a deletion
    return jsonify({"message": "User deleted!"}), 200


if __name__ == "__main__":
    app.run(debug=True)
