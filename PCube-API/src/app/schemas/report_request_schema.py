report_request_schema = {
    "type": "object",
    "required": [],
    "properties": {
        "projects": {
            "type": "array",
            "items": {"type": "integer"}
        },
        "activitys": {
            "type": "array",
            "items": {"type": "integer"}
        },
        "users": {
            "type": "array",
            "items": {"type": "integer"}
        },
        "dateDebut": {"type": "string", "maxLength": 250},
        "dateFin": {"type": "string", "maxLength": 250},
    },
    "additionalProperties": False
}
