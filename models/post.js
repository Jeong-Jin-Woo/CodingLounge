const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      post_title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      code_content: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      question_content: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      post_img: {
        type: Sequelize.TEXT('medium'),
        allowNull: true,
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
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  }
};
