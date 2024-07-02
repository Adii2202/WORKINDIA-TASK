module.exports = (sequelize, DataTypes) => {
  "Newsshorts",
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publish_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      actual_content_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      upvote: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      downvote: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    };
};
