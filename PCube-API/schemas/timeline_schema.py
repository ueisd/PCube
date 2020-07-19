timeline_insert_schema = {
    "type": "object",
    "required": ["timelines"],
    "properties": {
        "timelines": {
            "type": "array",
            "required": ["day_of_week", "punch_in", "punch_out", "project_id",
                         "accounting_time_category_id", "activity_id",
                         "user_id"],
            "id": {"type": "integer"},
            "day_of_week": {
                "type": "string", "pattern": "[0-9]{4}-[0-9]{2}-[0-9]{2}"},
            "punch_in": {
                "type": "string", "pattern": "([1-2][0-9]|[0-9]):[0-9]{2}"},
            "punch_out": {
                "type": "string", "pattern": "([1-2][0-9]|[0-9]):[0-9]{2}"},
            "project_id": {
                "type": "integer"},
            "accounting_time_category_id": {
                "type": "integer"},
            "activity_id": {
                "type": "integer"},
            "user_id": {
                "type": "integer"}
        }
    },
    "additionalProperties": False
}

timeline_update_schema = {
    "type": "object",
    "required": ["id", "day_of_week", "punch_in", "punch_out", "project_id",
                 "accounting_time_category_id", "activity_id", "user_id"],
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
        "accounting_time_category_id": {
            "type": "integer"},
        "activity_id": {
            "type": "integer"},
        "user_id": {
            "type": "integer"}
    },
    "additionalProperties": False
}

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
