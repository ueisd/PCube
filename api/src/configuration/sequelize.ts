var nconf = require('nconf');
const { Sequelize } = require('sequelize');

let sequelizeInst = undefined;

export const getSequelize = () => {
    if(sequelizeInst) return sequelizeInst;
    sequelizeInst = new Sequelize(
        nconf.get("database_db"), 
        nconf.get("database_user"), 
        nconf.get("database_password"), 
        {
            "host": nconf.get("database_host"),
            "dialect" : 'mysql'
        }
    );
    return sequelizeInst;
}