timeline_insert_schema = {
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