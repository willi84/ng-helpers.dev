const Feed = require('feed').Feed;
const { description } = require('../package.json');
const { getHelpers } = require('../lib/helpers');
const { writeFile } = require('fs').promises;
const { join } = require('path');
const { toSlug } = require('../lib/slug');

(async () => {
  const helpers = await getHelpers();
  try {
    const feed = new Feed({
      title: 'Tiny Helpers',
      description,
      id: 'https://ng-helpers.dev/',
      link: 'https://ng-helpers.dev/',
      language: 'en',
      image: 'http://example.com/image.png',
      favicon: 'https://ng-helpers.dev/favicon.ico',
      copyright: `All rights reserved ${new Date().getUTCFullYear()}, Stefan Judis`,
      generator: 'Feed for ng-helpers.dev', // optional, default = 'Feed for Node.js'
      feedLinks: {
        atom: 'https://ng-helpers.dev/feed.atom',
        rss: 'https://ng-helpers.dev/feed.xml'
      },
      author: {
        name: 'Stefan Judis',
        email: 'robert.dev@gmx.de',
        link: 'http://www.user.coffee'
      }
    });

    helpers
      .sort((a, b) => (new Date(a.addedAt) < new Date(b.addedAt) ? 1 : -1))
      .forEach(({ addedAt, name, desc, url }) => {
        feed.addItem({
          title: `New helper added: ${name} – ${desc}.`,
          id: toSlug(name),
          link: url,
          description: desc,
          content: `More tools! 🎉🎉🎉 "${name}" is available at ${url}`,
          date: new Date(addedAt),
          image: `https://ng-helpers.dev/screenshots/${toSlug(name)}@1.jpg`
        });
      });

    console.log('Writing rss feed');
    writeFile(join('.', 'static', 'feed.xml'), feed.rss2());
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
