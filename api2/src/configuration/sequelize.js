var nconf = require('nconf');
const { Sequelize } = require('sequelize');

var sequelize = undefined;

exports.getSequelize = () => {
    if(sequelize) return sequelize;
    var sequelize = new Sequelize(
        nconf.get("database_db"), 
        nconf.get("database_user"), 
        nconf.get("database_password"), 
        {
            "host": nconf.get("database_host"),
            "dialect" : 'mysql'
        }
    );
    return sequelize;
}