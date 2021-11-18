import { Model, DataTypes } from "sequelize";
import db from "../db//mysql";

class Topic extends Model {}
Topic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uid: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: "用户id",
        },
        name: {
            type: DataTypes.STRING(20),
            defaultValue: "",
            comment: "主题名称",
        },
        ids: {
            type: DataTypes.STRING(100),
            defaultValue: "",
            comment: "通道id",
        },
        val: {
            type: DataTypes.TEXT,
            defaultValue: "",
            comment: "通道内容",
        },
    },
    {
        sequelize: db,
        freezeTableName: true,
        tableName: "t_topic",
    }
);

//强制初始化数据库
Topic.sync({ force: true });

export default {
    insert: function (model: any) {
        return Topic.create(model);
    },
    get: function (id: number) {
        return Topic.findOne({
            where: {
                id,
            },
        });
    },
};
