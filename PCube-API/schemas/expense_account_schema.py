expense_account_insert_schema = {
    "type": "object",
    "required": ["name", "parent_name"],
    "properties": {
        "name": {"type": "string", "minLength": 1, "maxLength": 250},
        "parent_name": {"type": "string", "minLength": 1, "maxLength": 250},
    },
    "additionalProperties": False
}