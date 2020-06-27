activity_insert_schema = {
    "type": "object",
    "required": ["name"],
    "properties": {
        "name": {"type": "string", "minLength": 1, "maxLength": 250},
    },
    "additionalProperties": False
}

activity_update_schema = {
    "type": "object",
    "required": ["name", "id", "new_name"],
    "properties": {
        "name": {"type": "string", "minLength": 1, "maxLength": 250},
        "new_name": {"type": "string", "minLength": 1, "maxLength": 250},
        "id": {"type": "integer"}
    },
    "additionalProperties": False
}