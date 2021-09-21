var nconf = require('nconf');
const { execQuery, execQueryNoDB } = require('../database');
const Importer = require('mysql-import');


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

// @todo transformer en promesse 
exports.ensureTablesArePopulated = async (filesName) => {
    
    tables = await execQuery("show tables");
    return new Promise((resolve, reject) => {
        if(tables.length == 0) {
            console.log("Importer les schémas et les données dans la BD");
            const importer = new Importer({
                host: nconf.get("database_host"), 
                user: nconf.get("database_user"),
                password: nconf.get("database_password"), 
                database: nconf.get("database_db")
            });
    
            importer.onProgress(progress=>{
                var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
                console.log(`${percent}% Completed`);
            });
            importer.import(filesName)
            .then(() => {
                var files_imported = importer.getImported();
                console.log(`${files_imported.length} fichiers SQL importés.`);
                importer.disconnect(graceful=true);
                resolve("tables créées et populées");
            }).catch(err => reject(err));
        } else 
            resolve("tables créées et populées");
    })
}