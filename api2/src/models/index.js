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

    console.log(membre);
    const jane = await User.create({ 
        email: 'baba@gmail.com', 
        firstName: 'monsieur',
        lastName: 'zeta',
        password: bcrypt.hashSync('gggrrrr11111111', bcrypt.genSaltSync(8)),
        RoleId: admin.id
    });

    //await membre.setUsers([jane]);

    console.log(await membre.hasUser(jane));
      
}