const { execQueryNoDB } = require('../database');


function isDatabaseInResult(dbName, results) {
    if (!results) return false;
    for (let value of results)
        if(dbName === Object.values(value)[0]) return true;
    return false;
}


exports.ensureDBIsCreated = async (dbName) => {
    databases = await execQueryNoDB(`SHOW DATABASES LIKE '${dbName}'`)
    if(!isDatabaseInResult(dbName, databases)) {
        result = await execQueryNoDB(`CREATE DATABASE ${dbName}`)
        return "DB céée!";
    } else
        return "db existante";
}