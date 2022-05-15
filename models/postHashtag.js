const Sequelize = require('sequelize');

module.exports = class PostHahsTag extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
  
      hashtagid: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      postid: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
     
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci',
    });
  }

  static associate(db) {    
    db.PostHahsTag.belongsToMany(db.Post, { 
      through: 'postid' 
    });
  }
};
