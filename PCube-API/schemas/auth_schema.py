auth_login_schema = {
    "type": "object",
    "required": ["email", "password"],
    "properties": {
        "email": {"type": "string", "format": "email"},
        "password": {"type": "string", "minLength": 1, "maxLength": 250}
    },
    "additionalProperties": False
}