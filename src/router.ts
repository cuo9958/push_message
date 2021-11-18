import Router from "@koa/router";

import wechat from "./api/wechat";
import user from "./api/user";
import topic from "./api/topic";
import push from "./api/push";
import test from "./api";

const router = new Router();

//对外提供的接口
router.use("/api_node/wechat", wechat);
router.use("/api_node/user", user);
router.use("/api_node/topic", topic);
router.use("/api/push", push);
router.use("/api/test", test);

export default router;
