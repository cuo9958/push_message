import Router from "@koa/router";
import { BeError, BeSuccess } from "../util/response";
import { AddUser, LoginUser } from "../service/user";
import { AppAuth } from "../middleware/auth";

const router = new Router();

//注册
router.post("/reg", async function (ctx) {
    const { username, pwd, email } = ctx.request.body;
    try {
        const data = await AddUser(username, pwd, email);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});

router.post("/login", async function (ctx) {
    const { username, pwd } = ctx.request.body;
    const { deviceid } = ctx.headers;
    try {
        const data = await LoginUser(username, pwd, deviceid);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});

router.get("/check", AppAuth, async function (ctx) {
    ctx.body = BeSuccess();
});

export default router.routes();
