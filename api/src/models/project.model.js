const { DataTypes, Model, Sequelize } = require('sequelize');
const Op = Sequelize.Op;

class Project extends Model {};

module.exports.Project = Project;

module.exports.initModel = function(sequelize) {

    Project.deleteById = (id) => {
        return Project.destroy({
            where: {
              id: id
            }
        });
    }

    Project.isNameUnique = (name, id) => {
        return Project.findAll({
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

    Project.init(
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
            modelName: 'Project'
        }
        
    );
    return Project;
}