const { DataTypes, Model } = require('sequelize');

class Role extends Model {};

module.exports.Role = Role;

module.exports.initModel = function(sequelize) {
    
    Role.init(
        {
            id: {
                type : DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }, 
            name: {
                type : DataTypes.STRING,
            },
            accessLevel: {
                type : DataTypes.INTEGER,
            }
        }, {
            indexes: [
                {unique:true, fields:['id']},
            ],
            sequelize,
            modelName: 'Role'
        }
        
    );
    return Role;
}