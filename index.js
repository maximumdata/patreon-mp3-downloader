import Fs from 'fs'
import Https from 'https'
import { xml2js } from 'xml-js';
import fetch from 'node-fetch';

export async function downloadFile(url, targetFile, prepend = '') {
    return await new Promise((resolve, reject) => {
        Https.get(url, response => {
            const code = response.statusCode ?? 0

            if (code >= 400) {
                return reject(new Error(response.statusMessage))
            }

            // handle redirects
            if (code > 300 && code < 400 && !!response.headers.location) {
                return resolve(
                    downloadFile(response.headers.location, targetFile, prepend)
                )
            }

            // save the file to disk
            const fileWriter = Fs
                .createWriteStream(`./${prepend}${targetFile}`)
                .on('finish', () => {
                    resolve({})
                })

            response.pipe(fileWriter)
        }).on('error', error => {
            reject(error)
        })
    })
}

export class Item {
    constructor(item) {
        this.link = item.enclosure._attributes.url;
        const str = `${item.title._text.split(' ').join('_')}`;
        this.fileName = (str.replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, "")) + '.mp3';
    }

    async download(prepend = '') {
        await downloadFile(this.link, this.fileName, prepend);
    }
}

export default async function (url) {
    const response = await fetch(url);
    const body = await response.text();
    const result = xml2js(body, { compact: true, ignoreComment: true, alwaysChildren: true });
    const { rss: { channel: { item } } } = result;

    const audioItems = item.filter(i => {
        return i.enclosure._attributes.type === 'audio/mpeg';
    });

    return audioItems.map(i => new Item(i));
}
