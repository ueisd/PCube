const { DataTypes, Model, Sequelize } = require('sequelize');
const Op = Sequelize.Op;


export default class ExpenseAccount extends Model {
    public static initModel(sequelize){
        ExpenseAccount.init(
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
                modelName: 'ExpenseAccount'
            }

        );

        ExpenseAccount.isNameUnique = (name, id) => {
            return ExpenseAccount.findAll({
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

        ExpenseAccount.deleteById = (id) => {
            return ExpenseAccount.destroy({
                where: {
                    id: id
                }
            });
        }
    }
};