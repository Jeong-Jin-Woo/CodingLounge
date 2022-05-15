const Sequelize = require('sequelize');

module.exports = class PostHahsTag extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
  
      HashtagId: {
        type: Sequelize.CHAR(100),
        allowNull: false,
      },
      // postId: {
      //   type: Sequelize.CHAR(100),
      //   allowNull: false,
       
      // },
     
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'PostHashtag',
      tableName: 'posthashtag',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci',
    });
  }

  static associate(db) {    
    db.PostHashtag.belongsTo(db.Post, { 
      foreignKey:'PostId',targetKey:'id' 
    });
  
  }
  static associate(db) {    
    db.PostHashtag.belongsTo(db.Hashtag, { 
      foreignKey:'HashtagId',targetKey:'id'
    });
  
  }
  
};
