const { execQuery } = require('..');

exports.getAllActivitys = async () => execQuery("SELECT * FROM activity");
