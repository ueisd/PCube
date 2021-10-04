const { DataTypes, Model, Sequelize } = require('sequelize');
const { ExpenseAccount } = require('../models/expense-account.model');
const Op = Sequelize.Op;

class Timeline extends Model {
    static fetchWhereClauseFromParams = (params) => {
        let whereClauses = {};

        let actyvitys = params.activitys;
        let activitysIds = (actyvitys.length > 0) ? actyvitys.map(
            activity => activity.id
        ) : []
        if(activitysIds.length > 0)
            whereClauses.ActivityId = activitysIds;

        let projects = params.projects;
        let projectsIds = (projects.length > 0) ? projects.map(
            project => project.id
        ) : []
        if(projectsIds.length > 0)
            whereClauses.ProjectId = projectsIds;


        let users = params.users;
        let usersIds = (users.length > 0) ? users.map(
            user => user.id
        ) : []
        if(usersIds.length > 0 )
            whereClauses.UserId = usersIds;

        if(params.debut)
            whereClauses.punchIn = {[Op.gte]: params.debut}

        if(params.fin)
            whereClauses.punchOut = {[Op.lte]: params.fin}
        
        return whereClauses;
    }
};

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

    Timeline.getReportFromReqRarams = (params) => {
        let whereClauses = Timeline.fetchWhereClauseFromParams(params);

        return Timeline.findAll({
            include: {
                model: ExpenseAccount,
                attributes: [
                    ['name', 'nom'],
                    ['id', 'id'],
                    ['ExpenseAccountId', 'parentId']
                ],
            },
            attributes: [
                [Sequelize.fn('sum', Sequelize.literal('punchOut - punchIn')), 'seconds'],
            ],
            group: ['ExpenseAccount.id'],
            where: whereClauses,
            raw: true 
        })
    }

    Timeline.getAllFromReqParams = (params) => {
        let whereClauses = Timeline.fetchWhereClauseFromParams(params);
        return Timeline.findAll({
            where: whereClauses,
            order: [
                ['id', 'DESC']
            ],
            raw: true
        });
    }
    return Timeline;
}