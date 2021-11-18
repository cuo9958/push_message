import { Model, DataTypes, Op } from "sequelize";
import db from "../db//mysql";

class Modular extends Model {
    name: string;
    type: number;
    v1: string;
    v2: string;
    v3: string;
    v4: string;
}
Modular.init(
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
            type: DataTypes.STRING(100),
            defaultValue: "",
            comment: "名称",
        },
        type: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            comment: "类型:0,微信，1邮件，2钉钉,3短信",
        },
        v1: {
            type: DataTypes.STRING(200),
            defaultValue: "",
            comment: "微信的openid,邮件地址,token参数",
        },
        v2: {
            type: DataTypes.STRING(200),
            defaultValue: "",
            comment: "备用",
        },
        v3: {
            type: DataTypes.STRING(100),
            defaultValue: "",
            comment: "备用",
        },
        v4: {
            type: DataTypes.STRING(100),
            defaultValue: "",
            comment: "备用",
        },
    },
    {
        sequelize: db,
        freezeTableName: true,
        tableName: "t_modular",
        indexes: [
            {
                fields: ["uid"],
            },
            {
                fields: ["id", "uid"],
            },
        ],
    }
);

//强制初始化数据库
// Modular.sync({ force: true });

export default {
    insert: function (model: any) {
        return Modular.create(model);
    },
    get: function (id: number) {
        return Modular.findOne({
            where: {
                id,
            },
        });
    },
    findList(uid: number, PageIndex = 0) {
        const PageSize = 20;
        const where = { uid };
        return Modular.findAndCountAll({
            where,
            limit: PageSize,
            offset: PageIndex * PageSize,
            order: [["updatedAt", "desc"]],
        });
    },
    findAll(uid, ids: string[]) {
        console.log(uid, ids);
        return Modular.findAll({
            where: {
                uid,
                id: {
                    [Op.in]: ids,
                },
            },
            attributes: ["name", "type", "v1", "v2", "v3", "v4"],
        });
    },
    del(id: number, uid: number) {
        return Modular.destroy({
            where: { id, uid },
        });
    },
};
