const axios = require("axios");
const data = {
    title: "测试的表头",
    content: "测试的默认内容",
    data: {
        name: "名称",
        number: 200,
        productType: "娃娃机",
        expDate: "2021-01-02",
        remark: "这个地方应该是备注",
    },
    email: "",
    sms: "",
};
axios.post("http://127.0.0.1:8082/api/push/5de35dfe-f555-40d7-b69c-7e994c22be3e?id=3", data).then((res) => {
    console.log(res.data);
});
