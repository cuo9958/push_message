/**
 * 服务启动的动作
 */
import fs from "fs";

export let app_name = "";
const app_path = process.cwd() + "/aid";

//写应用名称
function setApplication() {
    app_name = "name_" + Date.now() + "_" + Math.round(Math.random() * 1000);
    fs.writeFileSync(app_path, app_name, { encoding: "utf8" });
}

//初始化应用
async function init() {
    try {
        fs.statSync(app_path);
        const data = fs.readFileSync(app_path, { encoding: "utf8" });
        app_name = data;
    } catch (error) {
        console.log("应用初始化");
        setApplication();
    }
}
init();
