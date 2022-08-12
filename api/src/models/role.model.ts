const { DataTypes, Model } = require('sequelize');

export default class Role extends Model {

    public static initModel(sequelize){
        Role.init({
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
                { unique:true, fields:['id'] },
            ],
            sequelize,
            modelName: 'Role'
        });
    }
}
