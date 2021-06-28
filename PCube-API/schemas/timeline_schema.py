timeline_insert_schema = {
    "type": "array",
    "required": ["day_of_week", "punch_in", "punch_out", "project_id",
                    "expense_account_id", "activity_id", "user_id"],
    "id": {"type": "integer"},
    "day_of_week": {
        "type": "string", "pattern": "[0-9]{4}-[0-9]{2}-[0-9]{2}"},
    "punch_in": {
        "type": "string", "pattern": "([1-2][0-9]|[0-9]):[0-9]{2}"},
    "punch_out": {
        "type": "string", "pattern": "([1-2][0-9]|[0-9]):[0-9]{2}"},
    "project_id": {
        "type": "integer"},
    "expense_account_id": {
        "type": "integer"},
    "activity_id": {
        "type": "integer"},
    "user_id": {
        "type": "integer"},
    "additionalProperties": True
}

timelines_update_schema = {
    "type": "array",
    "required": ["id", "day_of_week", "punch_in", "punch_out", "project_id",
                 "expense_account_id", "activity_id", "user_id"],
    "properties": {
        "id": {
            "type": "integer"},
        "day_of_week": {
            "type": "string", "pattern": "[0-9]{4}-[0-9]{2}-[0-9]{2}"},
        "punch_in": {
            "type": "string", "pattern": "([1-2][0-9]|[0-9]):[0-9]{2}"},
        "punch_out": {
            "type": "string", "pattern": "([1-2][0-9]|[0-9]):[0-9]{2}"},
        "project_id": {
            "type": "integer"},
        "expense_account_id": {
            "type": "integer"},
        "activity_id": {
            "type": "integer"},
        "user_id": {
            "type": "integer"}
    },
    "additionalProperties": True
}

timelines_delete_schema = {
    "type": "array",
    "items": {
        "type": "integer"
    }
}

## @todo supprimer
timeline_delete_schema = {
    "type": "object",
    "required": ["id", "day_of_week", "punch_in", "punch_out"],
    "properties": {
        "id": {
            "type": "integer"},
        "day_of_week": {
            "type": "string", "pattern": "[0-9]{4}-[0-9]{2}-[0-9]{2}"},
        "punch_in": {
            "type": "string", "pattern": "([1-2][0-9]|[0-9]):[0-9]{2}"},
        "punch_out": {
            "type": "string", "pattern": "([1-2][0-9]|[0-9]):[0-9]{2}"}
    },
    "additionalProperties": False
}
