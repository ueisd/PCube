const bcrypt = require('bcrypt');


exports.initSchemas = async (sequelize) => {

    const schemasFiles = ['./user.model', './role.model'];

    for(fileName of schemasFiles) {
        await require(fileName).initModel(sequelize);
    }

    const User = sequelize.models.User;
    const Role = sequelize.models.Role;

    

    Role.hasMany(User);
    User.belongsTo(Role);
    

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

    let test = await User.bulkCreate([
        { 
            email: 'A', 
            firstName: 'monsieur',
            lastName: 'zeta',
            password: bcrypt.hashSync('a', bcrypt.genSaltSync(8)),
            RoleId: admin.id
        },
        { 
            email: 'PM', 
            firstName: 'monsieur',
            lastName: 'yota',
            password: bcrypt.hashSync('pm', bcrypt.genSaltSync(8)),
            RoleId: pm.id
        },
        { 
            email: 'M', 
            firstName: 'monsieur',
            lastName: 'xeta',
            password: bcrypt.hashSync('m', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Taylor@Rosales.com', 
            firstName: 'Taylor',
            lastName: 'Rosales',
            password: bcrypt.hashSync('taylor', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
        { 
            email: 'Annabel@Fischer', 
            firstName: 'Annabel',
            lastName: 'Fischer',
            password: bcrypt.hashSync('annabel', bcrypt.genSaltSync(8)),
            RoleId: membre.id
        },
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

    //await membre.setUsers([jane]);

    //console.log(await membre.hasUser(jane));
      
}