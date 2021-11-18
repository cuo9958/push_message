import { Model, DataTypes } from "sequelize";
import db from "../db//mysql";

class User extends Model {
    id: number;
    username: string;
    pwd: string;
    nickname: string;
    headimg: string;
    token: string;
}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(50),
            defaultValue: "",
            comment: "用户名",
        },
        pwd: {
            type: DataTypes.STRING(50),
            defaultValue: "",
            comment: "密码",
        },
        email: {
            type: DataTypes.STRING(50),
            defaultValue: "",
            comment: "用注册的邮箱",
        },
        nickname: {
            type: DataTypes.STRING(20),
            defaultValue: "",
            comment: "昵称",
        },
        headimg: {
            type: DataTypes.STRING(100),
            defaultValue: "",
            comment: "头像",
        },
        level: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            comment: "用户等级",
        },
        token: {
            type: DataTypes.STRING(40),
            defaultValue: "",
            comment: "接口token",
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            comment: "状态，1，正常，0封禁",
        },
    },
    {
        sequelize: db,
        freezeTableName: true,
        tableName: "t_user",
        indexes: [
            {
                unique: true,
                fields: ["username"],
            },
            {
                fields: ["username", "pwd"],
            },
            {
                fields: ["token"],
            },
        ],
    }
);

//强制初始化数据库
// User.sync({ force: true });

export default {
    insert: function (model: any) {
        return User.create(model);
    },
    get: function (id: number) {
        return User.findOne({
            where: {
                id,
            },
        });
    },
    findOne(username: string, pwd: string) {
        return User.findOne({ where: { username, pwd } });
    },
    findByUsername(username: string) {
        return User.findOne({ where: { username } });
    },
    findByToken(token: string) {
        return User.findOne({ where: { token } });
    },
    findExist(username: string) {
        return User.findOne({
            where: { username },
            attributes: ["username"],
        });
    },
    update(data: any, username: string) {
        return User.update(data, { where: { username } });
    },
};
