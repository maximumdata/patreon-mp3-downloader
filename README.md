# patreon-mp3-downloader

This module is for downloading every mp3 file from a patreon rss feed.

It's currently in an alpha state and functions for my specific use case very well, and other use cases with a bit of force.
The next update will offer a better options object to control various aspects to your liking.
Right now, it will just download every audio/mpeg type file in the rss feed to the current directory.

You'll need to get your individual rss link from the patreon campaign's website
(patreon.com -> sidebar under 'Memberships' -> individual campaign -> Membership tab -> quick links -> 'Listen on other podcast apps')

### example usage

```
import getRssItems from 'patreon-mp3-downloader';

const items = await getRssItems('https://www.patreon.com/rss/PATREONCAMPAIGN?auth=PATREON_PROVIDED_AUTH_TOKEN_STRING');

// this will be an array of Item objects, that has a title and a url
// as well as a download() method that you can use to trigger the download of
// and individual file.
console.log(items);

// since you have an array of objects that each contains it's own download method,
// you are free to download them as you like.

// download the latest item in the rss feed:
await items[0].download();

// download each item in sequence, starting with the latest, prepending a number to the file name:
let counter = items.length;
for (const item of items) {
    console.log(`downloading ${counter} - ${item.fileName}`);
    await item.download(`${counter} - `);
    counter--;
}

// download every item in the feed at once (do not recommend for larger feeds):
await Promise.all(items.map(i => await i.download()))

// you could also chunk the array with lodash, and Promise.all each chunk:
import _ from 'lodash';
const chunks = _.chunk(items, 5);
for (const chunk of chunks) {
    await Promise.all(chunk.map(i => await i.download()));
}
```

Again, a more user-friendly interface with the above methods built in is coming in the next update.

<sub>made with 💖 and 🍺</sub>
