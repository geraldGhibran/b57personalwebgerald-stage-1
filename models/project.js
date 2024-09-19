"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user);
    }
  }
  project.init(
    {
      projectName: DataTypes.STRING,
      description: DataTypes.STRING,
      technologies: DataTypes.ARRAY(DataTypes.STRING),
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      image: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "project",
    }
  );
  return project;
};
