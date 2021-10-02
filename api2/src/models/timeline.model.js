const { DataTypes, Model, Sequelize } = require('sequelize');
const Op = Sequelize.Op;

class Timeline extends Model {};

module.exports.Timeline = Timeline;

module.exports.initModel = function(sequelize) {


    
    Timeline.init(
        {
            id: {
                type : DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            punchIn : {
                type : DataTypes.BIGINT
            },
            punchOut : {
                type : DataTypes.BIGINT
            },
        }, {
            indexes: [
                {unique:true, fields:['id']},
            ],
            sequelize,
            modelName: 'Timeline'
        }
        
    );
    return Timeline;
}