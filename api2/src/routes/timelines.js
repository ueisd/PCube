const router = require('express').Router();
const { isLoggedIn } = require('../guards/isLoggedIn.guard');
const { Timeline } = require('../models/timeline.model');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;


router.put('/', isLoggedIn, async (req, res)  => {
    let timelines = req.body.timelines;
    try {
        for(let timeline of timelines) {
            await Timeline.update(timeline, {
                where: {
                    id: timeline.id
                }
            });
        }
        res.json(timelines);
    } catch (err) {
        res.status(401).json('error: ' + err);
    }
});

router.post('/', isLoggedIn, (req, res) => {
    let timelines = req.body.timelines;
    Timeline.bulkCreate(timelines)
    .then(response => {
        res.json(response);
    })
    .catch(err => {
        res.status(401).json('error: ' + err);
    });
});

router.post('/getLines', isLoggedIn, (req, res) => {
    let params = req.body;
    console.log('getLines');
    console.log(params);

    

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


    Timeline.findAll({
        where: whereClauses,
        raw: true 
    })
    .then(response => {
        //console.log(response);
        res.json(response);
    })
    .catch(err => {
        res.status(401).json('error: ' + err);
    });
});

router.delete('/', isLoggedIn, (req, res) => {
    let numbers = req.body;
    console.log(numbers);
    Timeline.destroy({
        where: {
            id: numbers
        }
    }).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(401).json('error' + err);
    })
});

module.exports = router;