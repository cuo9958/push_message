import Router from "@koa/router";
import { BeError, BeSuccess } from "../util/response";
import { PushMessage } from "../service/push";
import { TokenAuth } from "../middleware/auth";

const router = new Router();

//发送消息
router.post("/:token", TokenAuth, async function (ctx) {
    const { token } = ctx.params;
    const { id } = ctx.query;
    try {
        if (!id) throw new Error("通道不存在");
        await PushMessage(token, id, ctx.request.body);
        ctx.body = BeSuccess();
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});

export default router.routes();
