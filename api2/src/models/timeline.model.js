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

    Timeline.getAllFromReqParams = (params) => {
        let projectsIds = params.projects;
        let activitysIds = params.activitys;
        let usersIds = params.users;

        let whereClauses = {};

        if(projectsIds.length > 0)
            whereClauses.ProjectId = projectsIds;
        if(activitysIds.length > 0)
            whereClauses.ActivityId = activitysIds;
        if(usersIds.length > 0 )
            whereClauses.UserId = usersIds;

        if(params.debut) {
            whereClauses.punchIn = {[Op.gte]: params.debut}
        }
        if(params.fin) {
            whereClauses.punchOut = {[Op.lte]: params.fin}
        }

        return Timeline.findAll({
            where: whereClauses,
            raw: true 
        })
    }
    return Timeline;
}