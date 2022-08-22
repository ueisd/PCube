"use strict";

const moment = require("moment-timezone");

import User from "../entitiesFamilies/User/entities/User";
import Role from "../entitiesFamilies/User/entities/role";
import Activity from "../entitiesFamilies/Activity/entities/Activity";

import ProjectDatabaseGateway from "../entitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway";
import ActivityDatabaseGateway from "../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway";
import UserDatabaseGateway from "../entitiesFamilies/User/databaseGateway/UserDatabaseGateway";
import ExpenseAccountDatabaseGateway from "../entitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway";

import Timeline from "./timeline.model";

exports.initSchemas = async (
  sequelize,
  userDbGateway: UserDatabaseGateway,
  activityDbGateway: ActivityDatabaseGateway,
  projectDbGateway: ProjectDatabaseGateway,
  expenseAccountDBGateway: ExpenseAccountDatabaseGateway
) => {
  Timeline.initModel(sequelize);

  const UserModel = sequelize.models.User;
  const ActivityModel = sequelize.models.Activity;
  const ProjectModel = sequelize.models.Project;
  const ExpenseAccountModel = sequelize.models.ExpenseAccount;
  const TimelineModel = sequelize.models.Timeline;

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

  const membre = await userDbGateway.createRole(
    new Role({
      name: "membre",
      accessLevel: 3,
    })
  );
  const pm = await userDbGateway.createRole(
    new Role({
      name: "product manager",
      accessLevel: 2,
    })
  );
  const admin = await userDbGateway.createRole(
    new Role({
      name: "admin",
      accessLevel: 1,
    })
  );

  console.log(`3`.repeat(100));

  const jane = await userDbGateway.createUser(
    new User({
      email: "baba@gmail.com",
      firstName: "monsieur",
      lastName: "zeta",
      password: "gggrrrr11111111",
      role: admin,
    })
  );

  console.log("6".repeat(100));
  console.log(JSON.stringify(jane, null, 2));

  let usersLs: any = {};
  usersLs.Nadmin = await userDbGateway.createUser(
    new User({
      email: "A",
      firstName: "monsieur",
      lastName: "zeta",
      password: "a",
      role: admin,
    })
  );

  console.log(`4`.repeat(100));

  usersLs.NprojectManager = await userDbGateway.createUser(
    new User({
      email: "PM",
      firstName: "monsieur",
      lastName: "yota",
      password: "pm",
      role: pm,
    })
  );

  usersLs.Nmember = await userDbGateway.createUser(
    new User({
      email: "M",
      firstName: "monsieur",
      lastName: "xeta",
      password: "m",
      role: membre,
    })
  );

  usersLs.NtaylorRosales = await userDbGateway.createUser(
    new User({
      email: "Taylor@Rosales.com",
      firstName: "Taylor",
      lastName: "Rosales",
      password: "taylor",
      role: membre,
    })
  );

  usersLs.NannabelFischer = await userDbGateway.createUser(
    new User({
      email: "Annabel@Fischer",
      firstName: "Annabel",
      lastName: "Fischer",
      password: "annabel",
      role: membre.id,
    })
  );

  usersLs.NAnnaHammon = await userDbGateway.createUser(
    new User({
      email: "Anya@Hammond.com",
      firstName: "Anya",
      lastName: "Hammond",
      password: "anya",
      role: membre,
    })
  );

  usersLs.NNellieThornton = await userDbGateway.createUser(
    new User({
      email: "Nellie@Thornton.com",
      firstName: "Nellie",
      lastName: "Thornton",
      password: "nellie",
      role: membre,
    })
  );

  usersLs.NKimberleyKeller = await userDbGateway.createUser(
    new User({
      email: "Kimberley@Keller.com",
      firstName: "Kimberley",
      lastName: "Keller",
      password: "kimberly",
      role: membre,
    })
  );

  let users = await userDbGateway.createUsers([
    new User({
      email: "Kane@Nod.com",
      firstName: "Kane",
      lastName: "Nod",
      password: "kane",
      role: admin,
    }),
    new User({
      email: "Redmond@Boyle.com",
      firstName: "Redmond",
      lastName: "Boyle",
      password: "redmond",
      role: admin,
    }),
    new User({
      email: "Kirce@James.ca",
      firstName: "Kirce",
      lastName: "James",
      password: "kirce",
      role: pm,
    }),
    new User({
      email: "Kilian@Qatar.ca",
      firstName: "Kilian",
      lastName: "Qatar",
      password: "kilian",
      role: pm,
    }),
    new User({
      email: "Louise",
      firstName: "Louise",
      lastName: "Strickland",
      password: "louise",
      role: membre,
    }),
    new User({
      email: "Sebastian@Merrill.qc",
      firstName: "Sebastian",
      lastName: "Merrill",
      password: "louise",
      role: membre,
    }),
    new User({
      email: "Edwin@Phillips.ai",
      firstName: "Edwin",
      lastName: "Phillips",
      password: "edwin",
      role: pm,
    }),
    new User({
      email: "Darren@Vargas.li",
      firstName: "Darren",
      lastName: "Vargas",
      password: "darren",
      role: admin,
    }),
    new User({
      email: "James@Mccormick.com",
      firstName: "James",
      lastName: "Mccormick",
      password: "james",
      role: membre,
    }),
    new User({
      email: "Georgie@Nelson.qc",
      firstName: "Georgie",
      lastName: "Nelson",
      password: "georgie",
      role: membre,
    }),
    new User({
      email: "Roosevelt@Bradford.eu",
      firstName: "Roosevelt",
      lastName: "Bradford",
      password: "roosevelt",
      role: membre,
    }),
    new User({
      email: "Marcel@Wilcox.ku",
      firstName: "Marcel",
      lastName: "Wilcox",
      password: "marcel",
      role: membre,
    }),
  ]);

  console.log("E".repeat(100));
  console.log(JSON.stringify({ users }, null, 2));

  let activites: any = {};

  activites.NjourneeSavon2013 = await activityDbGateway.createActivity(
    new Activity({
      name: "Journée promotionelle des savons - 2013-04-05",
    })
  );
  activites.NsouperDu20120405 = await activityDbGateway.createActivity(
    new Activity({
      name: "Souper de financement médieval - 2012-04-05",
    })
  );
  activites.NsouperBenefice2015 = await activityDbGateway.createActivity(
    new Activity({
      name: "Souper benefice halloween - 2015-10-29",
    })
  );
  activites.NdejeunerBenefice2014 = await activityDbGateway.createActivity(
    new Activity({
      name: "Déjeuner bénéfice - 2014-10-08",
    })
  );
  activites.NvoyageHaïti = await activityDbGateway.createActivity(
    new Activity({
      name: "Voyage humanitaire en Haïti été 2012",
    })
  );

  let projets: any = {};
  projets.NstageHumanitaires = await projectDbGateway.createProject({
    name: "Stage humanitaire",
  });
  projets.NstageHaiti = await projectDbGateway.createProject({
    name: "Stage humanitaire - Haïti",
  });
  projets.NstageHaiti2012 = await projectDbGateway.createProject({
    name: "Stage Haïti 2012",
  });
  projets.NstageHaiti2013 = await projectDbGateway.createProject({
    name: "Stage Haïti 2013",
  });
  projets.NstageRD = await projectDbGateway.createProject({
    name: "Stage - République dominicaine",
  });
  projets.NstageRD2009 = await projectDbGateway.createProject({
    name: "Stage - République dominicaine 2009",
  });
  projets.NsoupePopulaire = await projectDbGateway.createProject({
    name: "Soupe populaire",
  });

  projets.NFonctionnementGeneral = await projectDbGateway.createProject({
    name: "Fonctionnement général de l'organisme",
  });

  await projectDbGateway.addSubProjectsToProject(projets.NstageRD, [
    projets.NstageRD2009,
  ]);

  await projectDbGateway.addSubProjectsToProject(projets.NstageRD, [
    projets.NstageRD2009,
  ]);

  await projectDbGateway.addSubProjectsToProject(projets.NstageHumanitaires, [
    projets.NstageHaiti,
    projets.NstageRD,
  ]);

  await projectDbGateway.addSubProjectsToProject(projets.NstageHaiti, [
    projets.NstageHaiti2012,
    projets.NstageHaiti2013,
  ]);

  // await projets.NmarketingVeloJeunesse2018.setProjects([
  //   projets.NactiviteMarketing5juin,
  // ]);

  let ea: any = {};

  ea.Nadministration = await expenseAccountDBGateway.createExpenseAccount({
    name: "administration",
  });

  ea.Ncomptabilite = await expenseAccountDBGateway.createExpenseAccount({
    name: "comptabilité",
  });

  ea.NactiviteFinancement = await expenseAccountDBGateway.createExpenseAccount({
    name: "Activité de financement",
  });

  ea.Nrestauration = await expenseAccountDBGateway.createExpenseAccount({
    name: "restauration",
  });

  ea.Ncuisine = await expenseAccountDBGateway.createExpenseAccount({
    name: "restauration",
  });

  ea.NpreparationSalle = await expenseAccountDBGateway.createExpenseAccount({
    name: "Préparation de la salle",
  });

  ea.NventesProduits = await expenseAccountDBGateway.createExpenseAccount({
    name: "ventes de produits",
  });

  ea.Nmarketing = await expenseAccountDBGateway.createExpenseAccount({
    name: "marketing",
  });

  //await ea.Nadministration.setExpenseAccounts([ea.Nadmin2018]);
  await expenseAccountDBGateway.addSubExpenseAccounts(ea.Nrestauration, [
    ea.Ncuisine,
    ea.NpreparationSalle,
  ]);

  await expenseAccountDBGateway.addSubExpenseAccounts(ea.Nadministration, [
    ea.Nmarketing,
    ea.Ncomptabilite,
  ]);

  await expenseAccountDBGateway.addSubExpenseAccounts(ea.NactiviteFinancement, [
    ea.Nrestauration,
    ea.NventesProduits,
  ]);

  let punch = fetchPunchTzNY("2020-07-01", "08:00", "12:00");
  let tl1 = await Timeline.create({
    punchIn: punch.punchIn,
    punchOut: punch.punchOut,
    ProjectId: projets.NstageHumanitaires.id,
    ExpenseAccountId: ea.Nadministration.id,
    ActivityId: activites.NjourneeSavon2013.id,
    UserId: usersLs.Nadmin.id,
  });
  //
  // punch = fetchPunchTzNY("2020-07-01", "13:00", "17:00");
  // let tl2 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Nadministration.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NprojectManager.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-02", "08:00", "12:00");
  // let tl3 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Nadministration.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.Nmember.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-03", "06:00", "12:00");
  // let tl4 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Nadministration.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NannabelFischer.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-03", "16:00", "18:00");
  // let tl5 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Nadministration.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NannabelFischer.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-05", "08:00", "12:00");
  // let tl6 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Nadministration.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NannabelFischer.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-01", "08:00", "12:00");
  // let tl7 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Nmarketing.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NannabelFischer.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-01", "13:00", "17:00");
  // let tl8 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Nmarketing.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NannabelFischer.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-02", "08:00", "12:00");
  // let tl9 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Nmarketing.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NannabelFischer.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-03", "06:00", "12:00");
  // let tl10 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Nadministration.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NannabelFischer.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-03", "16:00", "16:01");
  // let tl11 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Ncomptabilite.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NannabelFischer.id,
  // });
  //
  // punch = fetchPunchTzNY("2020-07-05", "08:00", "08:01");
  // let tl12 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHumanitaires.id,
  //   ExpenseAccountId: ea.Ncomptabilite.id,
  //   ActivityId: activites.NjourneeSavon2013.id,
  //   UserId: usersLs.NannabelFischer.id,
  // });
  //
  // punch = fetchPunchTzNY("2012-07-05", "14:00", "21:43");
  // let tl13 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHaiti2012.id,
  //   ExpenseAccountId: ea.Nrestauration.id,
  //   ActivityId: activites.NsouperBenefice2015.id,
  //   UserId: usersLs.NtaylorRosales.id,
  // });
  //
  // punch = fetchPunchTzNY("2012-07-20", "13:00", "21:43");
  // let tl14 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageRD2009.id,
  //   ExpenseAccountId: ea.Ncuisine.id,
  //   ActivityId: activites.NsouperDu20120405.id,
  //   UserId: usersLs.NNellieThornton.id,
  // });
  //
  // punch = fetchPunchTzNY("2012-07-20", "13:00", "14:51");
  // let tl15 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageRD2009.id,
  //   ExpenseAccountId: ea.NpreparationSalle.id,
  //   ActivityId: activites.NsouperDu20120405.id,
  //   UserId: usersLs.Nadmin.id,
  // });
  //
  // punch = fetchPunchTzNY("2012-07-20", "14:51", "19:51");
  // let tl16 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageRD2009.id,
  //   ExpenseAccountId: ea.Ncuisine.id,
  //   ActivityId: activites.NsouperDu20120405.id,
  //   UserId: usersLs.Nadmin.id,
  // });
  //
  // punch = fetchPunchTzNY("2015-07-20", "16:40", "19:51");
  // let tl17 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NFonctionnementGeneral.id,
  //   ExpenseAccountId: ea.Ncomptabilite.id,
  //   UserId: usersLs.Nadmin.id,
  // });
  //
  // punch = fetchPunchTzNY("2015-07-27", "16:00", "21:05");
  // let tl18 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NFonctionnementGeneral.id,
  //   ExpenseAccountId: ea.Ncomptabilite.id,
  //   UserId: usersLs.Nadmin.id,
  // });
  //
  // punch = fetchPunchTzNY("2015-08-20", "16:00", "21:05");
  // let tl19 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHaiti2012.id,
  //   ExpenseAccountId: ea.NventesProduits.id,
  //   UserId: usersLs.NtaylorRosales.id,
  // });
  //
  // punch = fetchPunchTzNY("2015-08-20", "18:00", "19:05");
  // let tl20 = await Timeline.create({
  //   punchIn: punch.punchIn,
  //   punchOut: punch.punchOut,
  //   ProjectId: projets.NstageHaiti2012.id,
  //   ExpenseAccountId: ea.NventesProduits.id,
  //   UserId: usersLs.NKimberleyKeller.id,
  // });

  const res = await userDbGateway.findAllUsersEager();

  console.log("5".repeat(100));
  console.log(res);
};

function fetchPunchTzNY(day, h1, h2) {
  let timezone = "America/New_York";
  let a = moment.tz(day + " " + h1, timezone);
  let b = moment.tz(day + " " + h2, timezone);
  return {
    punchIn: a.unix(),
    punchOut: b.unix(),
  };
}
