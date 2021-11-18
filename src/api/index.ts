import Router from "@koa/router";
import { GetTemplateList, PostTemplateMessage } from "../service/wechat";
import { BeError, BeSuccess } from "../util/response";

const router = new Router();

router.all("/", async function (ctx) {
    try {
        const data = await GetTemplateList();
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});
router.get("/post", async function (ctx) {
    try {
        const data = await PostTemplateMessage(
            "oj0a51eg9abBfVE9gB0p1DUyiHv8",
            "vIazlZEuoD02nmkt21a8U8GF-NtVnoXZMMMZg7o843g",
            {
                first: "警告⚠️！",
                system: "名称",
                time: "2021-11-02",
                account: 22,
                remark: "测试使用的信息",
            },
            "http://bxiaob.top"
        );
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});

export default router.routes();
