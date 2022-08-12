import { DataTypes, Model, Op } from "sequelize";

export default class Project extends Model {
    public static initModel(sequelize){
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
    }

    public static deleteById(id) {
        return Project.destroy({
            where: {
                id: id
            }
        });
    }

    public static isNameUnique(name, id) {
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
}