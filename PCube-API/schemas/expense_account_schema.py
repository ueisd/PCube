expense_account_insert_schema = {
    "type": "object",
    "required": ["name", "parent_name"],
    "properties": {
        "name": {"type": "string", "minLength": 1, "maxLength": 250},
        "parent_name": {"type": "string", "minLength": 1, "maxLength": 250},
    },
    "additionalProperties": False
}

expense_account_update_schema = {
    "type": "object",
    "required": ["id", "name", "parent_id"],
    "properties": {
        "id": {"type": "integer"},
        "name": {"type": "string", "minLength": 1, "maxLength": 250},
        "parent_id": {"type": "integer"},
    },
    "additionalProperties": False
}

expense_account_delete_schema = {
    "type": "object",
    "required": ["id", "name"],
    "properties": {
        "id": {"type": "integer"},
        "name": {"type": "string", "minLength": 1, "maxLength": 250},
    },
    "additionalProperties": False
}
