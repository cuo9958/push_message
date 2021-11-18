import Router from "@koa/router";
import { BeError, BeSuccess } from "../util/response";
import { AppAuth } from "../middleware/auth";
import { GetModularList, AddModular, DelModular } from "../service/topic";
import { GetAPIToken, ReGetAPIToken } from "../service/user";

const router = new Router();

//通道列表
router.get("/passageway", AppAuth, async function (ctx) {
    const { pageindex } = ctx.query;
    const { username } = ctx.headers;
    try {
        const data = await GetModularList(username, pageindex);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});
//添加一条新的消息通道
router.post("/add_passageway", AppAuth, async function (ctx) {
    const { type, name, v1, v2, v3, v4 } = ctx.request.body;
    const { username } = ctx.headers;
    try {
        const data = await AddModular(username, parseInt(type), name, v1, v2, v3, v4);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});
router.get("/get_token", AppAuth, async function (ctx) {
    const { username } = ctx.headers;
    try {
        const data = await GetAPIToken(username);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});
router.post("/get_token", AppAuth, async function (ctx) {
    const { username } = ctx.headers;
    try {
        const data = await ReGetAPIToken(username);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});

router.post("/del_passageway", AppAuth, async function (ctx) {
    const { id } = ctx.request.body;
    const { username } = ctx.headers;
    try {
        const data = await DelModular(username, id * 1);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});

export default router.routes();
