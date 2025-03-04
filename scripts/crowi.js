"use strict";
// Description:
//
// Commands:
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WRITER_REGEXP = /@[a-zA-Z0-9_-]+/g;
const axios_1 = __importDefault(require("axios"));
module.exports = (robot) => {
    robot.hear(/getCrowi$/i, async (res) => {
        const crowiPagePath = process.env.CROWI_PAGE_PATH;
        const crowiToken = process.env.CROWI_ACCESS_TOKEN;
        if (crowiPagePath === undefined || crowiToken === undefined) {
            res.send("crowi envs are undefined");
            console.log("crowi envs are undefined");
            return;
        }
        const body = getCrowiPageBody({
            host: "wiki.trap.jp",
            pagePath: crowiPagePath,
            token: crowiToken,
        });
        res.send(body);
        console.log(body);
    });
};
function getCrowiPageBody({ host, pagePath, token }) {
    const encodedPath = encodeURI(pagePath);
    const options = {
        url: `https://${host}/_api/pages.get?access_token=${token}&path=${encodedPath}`,
        method: "GET",
    };
    (0, axios_1.default)(options)
        .then((res) => {
        const { data, status } = res;
        console.log(data);
        console.log(data.toString());
        console.log(status.toString());
        console.log(status);
        return data;
    })
        .catch((e) => {
        console.log(e.message);
        return e;
    });
    // const payload = JSON.parse(res.getContentText());
    // eslint-disable-next-line @typescript-eslint/dot-notation
}
