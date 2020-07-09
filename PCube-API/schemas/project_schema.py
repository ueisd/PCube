project_insert_schema = {
    "type": "object",
    "required": ["name", "parent_name"],
    "properties": {
        "name": {"type": "string", "minLength": 1, "maxLength": 250},
        "parent_name": {"type": "string", "minLength": 1, "maxLength": 250},
    },
    "additionalProperties": False
}

project_update_schema = {
    "type": "object",
    "required": ["id", "projectName", "parent_id"],
    "properties": {
        "id": {"type": "integer"},
        "projectName": {"type": "string", "minLength": 1, "maxLength": 250},
        "parent_id": {"type": "integer"},
    },
    "additionalProperties": True
}