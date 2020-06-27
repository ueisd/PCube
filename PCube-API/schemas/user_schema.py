user_insert_schema = {
    "type": "object",
    "required": ["first_name", "last_name", "email", "role_id", "password", "password_confirmed"],
    "properties": {
        "first_name": {"type": "string", "minLength": 1, "maxLength": 250},
        "last_name": {"type": "string", "minLength": 1, "maxLength": 250},
        "email": {"type": "string", "format": "email"},
        "role_id": {"type": "integer"},
        "password": {"type": "string", "minLength": 1, "maxLength": 250},
        "password_confirmed": {"type": "string", "minLength": 1, "maxLength": 250}
    },
    "additionalProperties": False
}

user_update_schema = {
    "type": "object",
    "required": ["id", "email", "first_name", "last_name", "new_email", "role_id"],
    "properties": {
        "id": {"type": "integer"},
        "first_name": {"type": "string", "minLength": 1, "maxLength": 250},
        "last_name": {"type": "string", "minLength": 1, "maxLength": 250},
        "role_id": {"type": "integer"},
        "email": {"type": "string", "format": "email"},
        "new_email": {"type": "string", "format": "email"}
    },
    "additionalProperties": False
}

user_password_update= {
    "type": "object",
    "required": ["id", "email", "new_password"],
    "properties": {
        "id": {"type": "int"},
        "email": {"type": "string", "pattern" : r"/[a-z0-9\._%+!$&*=^|~#%{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,22})/"},
        "new_password": {"type": "string", "minLength": 1, "maxLength": 120},
    },
    "additionalProperties": False
}