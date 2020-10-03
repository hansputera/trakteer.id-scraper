import { load } from "cheerio";
import request from "request";
import { baseURL, userAgent } from "./Config";

export default class TrakteerID {
    constructor() {}

    got(username: string) {
        return new Promise((resolve, reject) => {
            request({
                url: baseURL + username,
                headers: {
                    "user-agent": userAgent
                }
            }, (error, res, data) => {
                if (error) {
                    reject(error);
                }
                if (res.statusCode != 200) {
                    reject(`${res.statusCode} ${res.statusMessage}`);
                }
                const $ = load(data);
                if ($("h1").text().trim().includes("404")) {
                    reject("Username not found");
                } else if ($("h1").text().trim().includes("Halaman creator ini tidak aktif")) {
                    reject("That creator is not active");
                } else {
                    let result: string[] = [];

                    const author = $("[class=\"username\"]").text().trim();

                    $("[class=\"feed-list\"]").each((i, el) => {
                        result.push(`${$(el).find("[class=\"caption\"]").text().trim()}`)
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