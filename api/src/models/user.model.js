const { DataTypes, Model, Sequelize } = require('sequelize');
const Op = Sequelize.Op;

class User extends Model { }


module.exports.User = User;

module.exports.initModel = function(sequelize) {

    User.isEmailUnique = (email, id) => {
      return User.findAll({
        where: {
          [Op.and] : [
            {
              id: {
                [Op.ne]: id,
              }
            },
            {email: email}
          ] 
        },
        raw: true 
      })
    }

    User.deleteById = (id) => {
      return User.destroy({
        where: {
          id: id
        }
      });
    }

    User.findAllEager = () => {
      return User.findAll(
        {
          order: [
            ['createdAt', 'DESC']
          ],
          include: [{
            model: sequelize.models.Role,
          }],
          raw: true
        }
      );
    }

    User.findUserByEmail = (email) => {
      return User.findAll(
        {
          where: {
              email: email
          },
          include: [{
            model: sequelize.models.Role,
          }],
          raw: true
        }
      )
    }

    User.findUserById = (id) => {
      return User.findByPk (
        id,
        {
          include: [{
            model: sequelize.models.Role,
          }],
          raw: true
        }
      )
    }

    User.init({
      id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type : DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      }, //@todo on pourait supprimer le salt?
      isActive: { //@todo voir ce que ça fait..
        type: DataTypes.BOOLEAN
      },
      /*role: {
        type : DataTypes.INTEGER,
        references: {
          model: sequelize.models.Role,
          key: 'id'
        }
      }*/
    }, {
      indexes: [
        {unique:true, fields:['id']},
        {unique:true, fields:['email']},
      ],
      sequelize, 
      modelName: 'User'
    });
}