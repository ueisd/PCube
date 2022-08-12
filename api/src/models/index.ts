"use strict";

const bcrypt = require('bcrypt');
const moment = require('moment-timezone');

import User from "./user.model";
import Role from "./role.model";
import Activity from "./activity.model";
import Project from "./project.model";
import ExpenseAccount from "./expense-account.model";
import Timeline from "./timeline.model";


exports.initSchemas = async (sequelize) => {


    const schemasFiles = [
        './user.model', 
        './role.model', 
        './activity.model',
        './project.model',
        './expense-account.model',
        './timeline.model'
    ];

    // for(let fileName of schemasFiles) {
    //     await require(fileName).initModel(sequelize);
    // }


    Role.initModel(sequelize);
    User.initModel(sequelize);
    Activity.initModel(sequelize);
    Project.initModel(sequelize);
    ExpenseAccount.initModel(sequelize);
    Timeline.initModel(sequelize);

    const RoleModel = sequelize.models.Role;
    const UserModel = sequelize.models.User;
    const ActivityModel = sequelize.models.Activity;
    const ProjectModel = sequelize.models.Project;
    const ExpenseAccountModel = sequelize.models.ExpenseAccount;
    const TimelineModel = sequelize.models.Timeline;


    // role
    RoleModel.hasMany(UserModel);
    UserModel.belongsTo(RoleModel);


    // project
    ProjectModel.hasMany(ProjectModel);
    ProjectModel.belongsTo(ProjectModel);

    
    // expense account
    ExpenseAccountModel.hasMany(ExpenseAccountModel);
    ExpenseAccountModel.belongsTo(ExpenseAccountModel);


    // timeline
    UserModel.hasMany(TimelineModel);
    TimelineModel.belongsTo(UserModel);

    ProjectModel.hasMany(TimelineModel);
    TimelineModel.belongsTo(ProjectModel);

    ActivityModel.hasMany(TimelineModel);
    TimelineModel.belongsTo(ActivityModel);
    
    ExpenseAccountModel.hasMany(TimelineModel);
    TimelineModel.belongsTo(ExpenseAccountModel);
    

    //@todo si prod on utilise alter

    console.log(`1`.repeat(100));
    await sequelize.sync({ force: true });
    console.log(`2`.repeat(100));

    const membre = await RoleModel.create({ name: "membre",  accessLevel: 3});
    const pm = await RoleModel.create({ name: "product manager",  accessLevel: 2});
    const admin = await RoleModel.create({ name: "admin",  accessLevel: 1});

    console.log(`3`.repeat(100));


    const jane = await User.create({
        email: 'baba@gmail.com',
        firstName: 'monsieur',
        lastName: 'zeta',
        password: bcrypt.hashSync('gggrrrr11111111', bcrypt.genSaltSync(8)),
        RoleId: admin.id
    });

    let usersLs: any = {};
    usersLs.Nadmin = await UserModel.create({
        email: 'A',
        firstName: 'monsieur',
        lastName: 'zeta',
        password: bcrypt.hashSync('a', bcrypt.genSaltSync(8)),
        RoleId: admin.id
    });

    console.log(`4`.repeat(100));

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

    usersLs.NAnnaHammon = await User.create({
        email: 'Anya@Hammond.com',
        firstName: 'Anya',
        lastName: 'Hammond',
        password: bcrypt.hashSync('anya', bcrypt.genSaltSync(8)),
        RoleId: membre.id
    });

    usersLs.NNellieThornton = await User.create({
        email: 'Nellie@Thornton.com',
        firstName: 'Nellie',
        lastName: 'Thornton',
        password: bcrypt.hashSync('nellie', bcrypt.genSaltSync(8)),
        RoleId: membre.id
    });

    usersLs.NKimberleyKeller = await User.create(        {
        email: 'Kimberley@Keller.com',
        firstName: 'Kimberley',
        lastName: 'Keller',
        password: bcrypt.hashSync('kimberly', bcrypt.genSaltSync(8)),
        RoleId: membre.id
    });

    let users = await User.bulkCreate([
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


    let activites:any = {};

    activites.NjourneeSavon2013 = await Activity.create({
        name: 'Journée promotionelle des savons - 2013-04-05'
    });
    activites.NsouperDu20120405 = await Activity.create({
        name: 'Souper de financement médieval - 2012-04-05'
    });
    activites.NsouperBenefice2015 = await Activity.create({
        name: 'Souper benefice halloween - 2015-10-29'
    });
    activites.NdejeunerBenefice2014 = await Activity.create({
        name: 'Déjeuner bénéfice - 2014-10-08'
    });
    activites.NvoyageHaïti = await Activity.create({
        name: 'Voyage humanitaire en Haïti été 2012'
    });


    let projets:any = {};
    projets.NstageHumanitaires = await Project.create(
        {name: "Stage humanitaire"}
    );
    projets.NstageHaiti = await Project.create(
        {name: "Stage humanitaire - Haïti"}
    );
    projets.NstageHaiti2012 = await Project.create(
        {name: "Stage Haïti 2012"}
    );
    projets.NstageHaiti2013 = await Project.create(
        {name: "Stage Haïti 2013"}
    );
    projets.NstageRD = await Project.create(
        {name: "Stage - République dominicaine"}
    );
    projets.NstageRD2009 = await Project.create(
        {name: "Stage - République dominicaine 2009"}
    );
    projets.NsoupePopulaire = await Project.create(
        {name: "Soupe populaire"}
    );

    projets.NFonctionnementGeneral = await Project.create(
        {name: "Fonctionnement général de l'organisme"}
    );

    await projets.NstageRD.setProjects([
        projets.NstageRD2009
    ])

    await projets.NstageHumanitaires.setProjects([
        projets.NstageHaiti, projets.NstageRD
    ]);

    await projets.NstageHaiti.setProjects([
        projets.NstageHaiti2012, projets.NstageHaiti2013
    ]);



    /*await projets.NmarketingVeloJeunesse2018.setProjects([
        projets.NactiviteMarketing5juin
    ]);*/


    let ea:any = {};

    ea.Nadministration = await ExpenseAccount.create(
        {name: "administration"}
    );

    ea.Ncomptabilite = await ExpenseAccount.create(
        {name: "comptabilité"}
    );

    ea.NactiviteFinancement = await ExpenseAccount.create(
        {name: "Activité de financement"}
    );

    ea.Nrestauration = await ExpenseAccount.create(
        {name: "restauration"}
    );

    ea.Ncuisine = await ExpenseAccount.create(
        {name: "cuisine"}
    );

    ea.NpreparationSalle = await ExpenseAccount.create(
        {name: "Préparation de la salle"}
    );


    ea.NventesProduits = await ExpenseAccount.create(
        {name: "ventes de produits"}
    );

    ea.Nmarketing = await ExpenseAccount.create(
        {name: "marketing"}
    );




    //await ea.Nadministration.setExpenseAccounts([ea.Nadmin2018]);
    await ea.Nrestauration.setExpenseAccounts([ea.Ncuisine, ea.NpreparationSalle]);
    await ea.Nadministration.setExpenseAccounts([ea.Nmarketing, ea.Ncomptabilite]);
    await ea.NactiviteFinancement.setExpenseAccounts([ea.Nrestauration, ea.NventesProduits]);


    let punch = fetchPunchTzNY('2020-07-01', '08:00', '12:00');
    let tl1 = await Timeline.create(
        {
            punchIn : punch.punchIn,
            punchOut : punch.punchOut,
            ProjectId : projets.NstageHumanitaires.id,
            ExpenseAccountId : ea.Nadministration.id,
            ActivityId : activites.NjourneeSavon2013.id,
            UserId: usersLs.Nadmin.id
        }
    );

    punch = fetchPunchTzNY('2020-07-01', '13:00', '17:00');
    let tl2 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Nadministration.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NprojectManager.id
    });

    punch = fetchPunchTzNY('2020-07-02', '08:00', '12:00');
    let tl3 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Nadministration.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.Nmember.id
    });

    punch = fetchPunchTzNY('2020-07-03', '06:00', '12:00')
    let tl4 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Nadministration.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-03', '16:00', '18:00');
    let tl5 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Nadministration.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-05', '08:00', '12:00')
    let tl6 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Nadministration.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-01', '08:00', '12:00');
    let tl7 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Nmarketing.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-01', '13:00', '17:00');
    let tl8 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Nmarketing.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-02', '08:00', '12:00')
    let tl9 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Nmarketing.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-03', '06:00', '12:00');
    let tl10 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Nadministration.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-03', '16:00', '16:01');
    let tl11 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Ncomptabilite.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2020-07-05', '08:00', '08:01');
    let tl12 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHumanitaires.id,
        ExpenseAccountId : ea.Ncomptabilite.id,
        ActivityId : activites.NjourneeSavon2013.id,
        UserId: usersLs.NannabelFischer.id
    });

    punch = fetchPunchTzNY('2012-07-05', '14:00', '21:43');
    let tl13 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHaiti2012.id,
        ExpenseAccountId : ea.Nrestauration.id,
        ActivityId : activites.NsouperBenefice2015.id,
        UserId: usersLs.NtaylorRosales.id
    });

    punch = fetchPunchTzNY('2012-07-20', '13:00', '21:43');
    let tl14 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageRD2009.id,
        ExpenseAccountId : ea.Ncuisine.id,
        ActivityId : activites.NsouperDu20120405.id,
        UserId: usersLs.NNellieThornton.id
    });

    punch = fetchPunchTzNY('2012-07-20', '13:00', '14:51');
    let tl15 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageRD2009.id,
        ExpenseAccountId : ea.NpreparationSalle.id,
        ActivityId : activites.NsouperDu20120405.id,
        UserId: usersLs.Nadmin.id
    });

    punch = fetchPunchTzNY('2012-07-20', '14:51', '19:51');
    let tl16 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageRD2009.id,
        ExpenseAccountId : ea.Ncuisine.id,
        ActivityId : activites.NsouperDu20120405.id,
        UserId: usersLs.Nadmin.id
    });

    punch = fetchPunchTzNY('2015-07-20', '16:40', '19:51');
    let tl17 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NFonctionnementGeneral.id,
        ExpenseAccountId : ea.Ncomptabilite.id,
        UserId: usersLs.Nadmin.id
    });

    punch = fetchPunchTzNY('2015-07-27', '16:00', '21:05');
    let tl18 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NFonctionnementGeneral.id,
        ExpenseAccountId : ea.Ncomptabilite.id,
        UserId: usersLs.Nadmin.id
    });

    punch = fetchPunchTzNY('2015-08-20', '16:00', '21:05');
    let tl19 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHaiti2012.id,
        ExpenseAccountId : ea.NventesProduits.id,
        UserId: usersLs.NtaylorRosales.id
    });

    punch = fetchPunchTzNY('2015-08-20', '18:00', '19:05');
    let tl20 = await Timeline.create({
        punchIn : punch.punchIn,
        punchOut : punch.punchOut,
        ProjectId : projets.NstageHaiti2012.id,
        ExpenseAccountId : ea.NventesProduits.id,
        UserId: usersLs.NKimberleyKeller.id
    });

    await membre.setUsers([jane]);

    console.log(await membre.hasUser(jane));
      
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