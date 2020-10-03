"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const request_1 = __importDefault(require("request"));
const Config_1 = require("./Config");
class TrakteerID {
    constructor() { }
    got(username) {
        return new Promise((resolve, reject) => {
            request_1.default({
                url: Config_1.baseURL + username,
                headers: {
                    "user-agent": Config_1.userAgent
                }
            }, (error, res, data) => {
                if (error) {
                    reject(error);
                }
                if (res.statusCode != 200) {
                    reject(`${res.statusCode} ${res.statusMessage}`);
                }
                const $ = cheerio_1.load(data);
                if ($("h1").text().trim().includes("404")) {
                    reject("Username not found");
                }
                else if ($("h1").text().trim().includes("Halaman creator ini tidak aktif")) {
                    reject("That creator is not active");
                }
                else {
                    let result = [];
                    const author = $("[class=\"username\"]").text().trim();
                    $("[class=\"feed-list\"]").each((i, el) => {
                        result.push(`${$(el).find("[class=\"caption\"]").text().trim()}`);
                    });
                    const arrayT = result[0].split(author).filter(x => x !== "").map(x => x + author);
                    resolve({
                        feeds: arrayT,
                        author: {
                            username: author,
                            bio: $("[class=\"status text-pre-line text-break pt-15\"]").text().trim(),
                            tag: $("[class=\"mb-5\"]").text().trim()
                        },
                        copyright: "hansputera (hanif dwy putra s)"
                    });
                }
            });
        });
    }
}
exports.default = TrakteerID;
