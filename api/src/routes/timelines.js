const router = require('express').Router();
const { isLoggedIn } = require('../guards/isLoggedIn.guard');
const { Timeline } = require('../models/timeline.model');
const { ExpenseAccount } = require('../models/expense-account.model');
const { ReportLine } = require('../models/report-line.model');


router.post('/report', isLoggedIn, async (req, res) => {
    let params = req.body;

    try {
        let lines = await Timeline.getReportFromReqRarams(params);
        lines = lines.map(
            item => ReportLine.fetchFromTimelineEagerResponse(item)
        );

        let expenses = await ExpenseAccount.findAll({raw: true});
        expenses = expenses.map(
            item => ReportLine.fetchFromExpenseAccountResponse(item)
        );
        
        for(let item of lines) {
            let lRes = expenses.find(l => item.id === l.id);
            if(lRes) lRes.summline = item.summline;
        }
        res.json(expenses);
    } catch (err) {
        res.status(401).json('error: ' + err);
    }
});

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
    Timeline.getAllFromReqParams(req.body)
    .then(response => {
        res.json(response);
    })
    .catch(err => {
        res.status(401).json('error: ' + err);
    });
});

router.delete('/', isLoggedIn, (req, res) => {
    let numbers = req.body;
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