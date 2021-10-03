const { DataTypes, Model, Sequelize } = require('sequelize');
const Op = Sequelize.Op;

class Activity extends Model {};

module.exports.Activity = Activity;

module.exports.initModel = function(sequelize) {

    Activity.deleteById = (id) => {
        return Activity.destroy({
            where: {
              id: id
            }
        });
    }

    Activity.isNameUnique = (name, id) => {
        return Activity.findAll({
            where: {
                [Op.and] : [
                {
                    id: {
                    [Op.ne]: id,
                    }
                },
                {name: name}
                ] 
            },
            raw: true 
        });
    }
    
    Activity.init(
        {
            id: {
                type : DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }, 
            name: {
                type : DataTypes.STRING,
            },
        }, {
            indexes: [
                {unique:true, fields:['id']},
            ],
            sequelize,
            modelName: 'Activity'
        }
        
    );
    return Activity;
}