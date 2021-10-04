const bcrypt = require('bcrypt');
var moment = require('moment-timezone');


exports.initSchemas = async (sequelize) => {

    const schemasFiles = [
        './user.model', 
        './role.model', 
        './activity.model',
        './project.model',
        './expense-account.model',
        './timeline.model'
    ];

    for(fileName of schemasFiles) {
        await require(fileName).initModel(sequelize);
    }

    const User = sequelize.models.User;
    const Role = sequelize.models.Role;
    const Activity = sequelize.models.Activity;
    const Project = sequelize.models.Project;
    const ExpenseAccount = sequelize.models.ExpenseAccount;
    const Timeline = sequelize.models.Timeline;

    // role
    Role.hasMany(User);
    User.belongsTo(Role);


    // project
    Project.hasMany(Project);
    Project.belongsTo(Project);

    
    // expense account
    ExpenseAccount.hasMany(ExpenseAccount);
    ExpenseAccount.belongsTo(ExpenseAccount);


    // timeline
    User.hasMany(Timeline);
    Timeline.belongsTo(User);

    Project.hasMany(Timeline);
    Timeline.belongsTo(Project);

    Activity.hasMany(Timeline);
    Timeline.belongsTo(Activity);
    
    ExpenseAccount.hasMany(Timeline);
    Timeline.belongsTo(ExpenseAccount);
    

    //@todo si prod on utilise alter
    await sequelize.sync({ force: true });

    const membre = await Role.create({ name: "membre",  accessLevel: 3});
    const pm = await Role.create({ name: "product manager",  accessLevel: 2});
    const admin = await Role.create({ name: "admin",  accessLevel: 1});

    /*const jane = await User.create({ 
        email: 'baba@gmail.com', 
        firstName: 'monsieur',
        lastName: 'zeta',
        password: bcrypt.hashSync('gggrrrr11111111', bcrypt.genSaltSync(8)),
        RoleId: admin.id
    });*/

    let usersLs = {};
    usersLs.Nadmin = await User.create({ 
        email: 'A', 
        firstName: 'monsieur',
        lastName: 'zeta',
        password: bcrypt.hashSync('a', bcrypt.genSaltSync(8)),
        RoleId: admin.id
    });

    usersLs.NprojectManager = await User.create({ 
        email: 'PM', 
        firstName: 'monsieur',
        lastName: 'yota',
        password: bcrypt.hashSync('pm', bcrypt.genSaltSync(8)),
        RoleId: pm.id
    });

    usersLs.Nmember = await User.create({ 
        email: 'M', 
        firstName: 'monsieur',
        lastName: 'xeta',
        password: bcrypt.hashSync('m', bcrypt.genSaltSync(8)),
        RoleId: membre.id
    });

    usersLs.NtaylorRosales = await User.create({ 
        email: 'Taylor@Rosales.com', 
        firstName: 'Taylor',
        lastName: 'Rosales',
        password: bcrypt.hashSync('taylor', bcrypt.genSaltSync(8)),
        RoleId: membre.id
    });

    usersLs.NannabelFischer = await User.create({ 
        email: 'Annabel@Fischer', 
        firstName: 'Annabel',
        lastName: 'Fischer',
        password: bcrypt.hashSync('annabel', bcrypt.genSaltSync(8)),
        RoleId: membre.id
    });

    let users = await User.bulkCreate([
        { 
            email: 'Anya@Hammond.com', 
            firstName: 'Anya',
            lastName: 'Hammond',
            password: bcrypt.hashSync('anya', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Nellie@Thornton.com', 
            firstName: 'Nellie',
            lastName: 'Thornton',
            password: bcrypt.hashSync('nellie', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Kimberley@Keller.com', 
            firstName: 'Kimberley',
            lastName: 'Keller',
            password: bcrypt.hashSync('kimberly', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Kane@Nod.com', 
            firstName: 'Kane',
            lastName: 'Nod',
            password: bcrypt.hashSync('kane', bcrypt.genSaltSync(8)),
            RoleId: admin.id
        },
        { 
            email: 'Redmond@Boyle.com', 
            firstName: 'Redmond',
            lastName: 'Boyle',
            password: bcrypt.hashSync('redmond', bcrypt.genSaltSync(8)),
            RoleId: admin.id
        },
        { 
            email: 'Kirce@James.ca', 
            firstName: 'Kirce',
            lastName: 'James',
            password: bcrypt.hashSync('kirce', bcrypt.genSaltSync(8)),
            RoleId: pm.id
        },
        { 
            email: 'Kilian@Qatar.ca', 
            firstName: 'Kilian',
            lastName: 'Qatar',
            password: bcrypt.hashSync('kilian', bcrypt.genSaltSync(8)),
            RoleId: pm.id
        },
        { 
            email: 'Louise', 
            firstName: 'Louise',
            lastName: 'Strickland',
            password: bcrypt.hashSync('louise', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Sebastian@Merrill.qc', 
            firstName: 'Sebastian',
            lastName: 'Merrill',
            password: bcrypt.hashSync('louise', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Edwin@Phillips.ai', 
            firstName: 'Edwin',
            lastName: 'Phillips',
            password: bcrypt.hashSync('edwin', bcrypt.genSaltSync(8)),
            RoleId: pm.id
        },
        { 
            email: 'Darren@Vargas.li', 
            firstName: 'Darren',
            lastName: 'Vargas',
            password: bcrypt.hashSync('darren', bcrypt.genSaltSync(8)),
            RoleId: admin.id
        },
        { 
            email: 'James@Mccormick.com', 
            firstName: 'James',
            lastName: 'Mccormick',
            password: bcrypt.hashSync('james', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Georgie@Nelson.qc', 
            firstName: 'Georgie',
            lastName: 'Nelson',
            password: bcrypt.hashSync('georgie', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Roosevelt@Bradford.eu', 
            firstName: 'Roosevelt',
            lastName: 'Bradford',
            password: bcrypt.hashSync('roosevelt', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Marcel@Wilcox.ku', 
            firstName: 'Marcel',
            lastName: 'Wilcox',
            password: bcrypt.hashSync('marcel', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
    ]);


    let activites = {};

    activites.NdistribProspectus = await Activity.create({
        name: 'Ditribution de prospectus'
    });
    activites.NappelMarketing = await Activity.create({
        name: 'Appel marketing'
    });
    activites.NpreparationMarketing = await Activity.create({
        name: 'Préparation marketing'
    });
    activites.NcommisALavente = await Activity.create({
        name: 'Commis à la vente'
    });
    activites.NorganisationEvenementielle = await Activity.create({
        name: 'Organisation événementielle'
    });

    let projets = {};
    projets.NprojetVeloJeunesse2018 = await Project.create(
        {name: "Vélo jeunesse 2018"}
    );
    projets.NmarketingVeloJeunesse2018 = await Project.create(
        {name: "Marketing vélo jeunesse 2018"}
    );
    projets.NadministrationVeloJeunesse = await Project.create(
        {name: "Administration - vélo jeunesse 2018"}
    );
    projets.NventesVeloJeunesse = await Project.create(
        {name: "Ventes - vélo jeunesse 2018"}
    );

    projets.NactiviteMarketing5juin = await Project.create(
        {name: "Marketing - 5 juin 2018"}
    );

    projets.NrefonteComptabilite = await Project.create(
        {name: "Refonte de la comptabilité"}
    );

    await projets.NprojetVeloJeunesse2018.setProjects([
        projets.NmarketingVeloJeunesse2018, 
        projets.NadministrationVeloJeunesse,
        projets.NventesVeloJeunesse
    ]);

    await projets.NmarketingVeloJeunesse2018.setProjects([
        projets.NactiviteMarketing5juin
    ]);


    let ea = {};

    ea.NadministrationEA = await ExpenseAccount.create(
        {name: "administration"}
    );

    ea.Nadmin2018EA = await ExpenseAccount.create(
        {name: "administration - 2018"}
    ); 

    ea.NmarketingEA = await ExpenseAccount.create(
        {name: "marketing"}
    ); 

    ea.Nmarketing2018EA = await ExpenseAccount.create(
        {name: "marketing - 2018"}
    ); 

    ea.NventesEA = await ExpenseAccount.create(
        {name: "ventes"}
    );

    ea.Nventes2018EA = await ExpenseAccount.create(
        {name: "ventes - 2018"}
    );


    await ea.NadministrationEA.setExpenseAccounts([ea.Nadmin2018EA]);

    await ea.NmarketingEA.setExpenseAccounts([ea.Nmarketing2018EA]);

    await ea.NventesEA.setExpenseAccounts([ea.Nventes2018EA]);


    //console.log(usersLs.Nadmin);
    let punch = fetchPunchTzNY('2020-07-01', '08:00', '12:00');
    let tl1 = await Timeline.create(
        {
            punchIn : punch.punchIn,
            punchOut : punch.punchOut,
            ProjectId : projets.NadministrationVeloJeunesse.id,
            ExpenseAccountId : ea.NadministrationEA.id,
            ActivityId : activites.NcommisALavente.id, 
            UserId: usersLs.Nadmin.id
        }
    );
        
    punch = fetchPunchTzNY('2020-07-01', '13:00', '17:00');
    let tl2 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.NadministrationEA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NprojectManager.id
    });
    
    punch = fetchPunchTzNY('2020-07-02', '08:00', '12:00');
    let tl3 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.NadministrationEA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.Nmember.id
    });
    
    punch = fetchPunchTzNY('2020-07-03', '06:00', '12:00')
    let tl4 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.NadministrationEA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-03', '16:00', '18:00');
    let tl5 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.NadministrationEA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NannabelFischer.id
    });
    
    punch = fetchPunchTzNY('2020-07-05', '08:00', '12:00')
    let tl6 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.NadministrationEA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-01', '08:00', '12:00');
    let tl7 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.NmarketingEA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-01', '13:00', '17:00');
    let tl8 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.NmarketingEA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NannabelFischer.id
    });
    
    punch = fetchPunchTzNY('2020-07-02', '08:00', '12:00')
    let tl9 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.NmarketingEA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-03', '06:00', '12:00');
    let tl10 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.NadministrationEA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-03', '16:00', '16:01');
    let tl11 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.Nventes2018EA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NannabelFischer.id
    });
    
    punch = fetchPunchTzNY('2020-07-05', '08:00', '08:01');
    let tl12 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NadministrationVeloJeunesse.id,
        ExpenseAccountId : ea.Nventes2018EA.id,
        ActivityId : activites.NcommisALavente.id, 
        UserId: usersLs.NannabelFischer.id
    }); // 3, 4, 2, 5

    //console.log('usersLs.NtaylorRosales');
    //console.log(usersLs.NtaylorRosales);
    
    //debut à 3, 4, 2, 17

    //await membre.setUsers([jane]);

    //console.log(await membre.hasUser(jane));
      
}

function fetchPunchTzNY(day, h1, h2) {
    let timezone = "America/New_York";
    let a = moment.tz(day + " " + h1, timezone);
    let b = moment.tz(day + " " + h2, timezone);
    return {
        punchIn: a.unix(),
        punchOut: b.unix()
    };
}