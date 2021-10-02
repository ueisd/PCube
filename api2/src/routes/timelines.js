const router = require('express').Router();
const { isLoggedIn } = require('../guards/isLoggedIn.guard');
const { Timeline } = require('../models/timeline.model');



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

    Timeline.getAllFromReqParams(params)
    .then(response => {
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