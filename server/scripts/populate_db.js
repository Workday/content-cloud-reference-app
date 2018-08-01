'use strict';

/**
 * This simple nodejs script will start a server and fillup the mockdb.json with GOOD test data
 */

// When ready, get endpoint and token
const app = require('../server');
const faker = require('faker');

app.on('ready', function() {
  // Set the env var for the mocha tests, helpful for docker scenarios
  const content = app.models.Content;
  console.info('App started and ready');

  console.info('Delete ALL previous data in mockdb.json');
  content.deleteAll();

  const itemMax = 1000;
  console.info('Generating', itemMax, 'items.');

  const contentItemArray = [];
  for (let i = 0; i < itemMax; i++) {
    let contentItem = {
      'id': faker.random.uuid(),
      'title': faker.lorem.sentence(),
      'description': faker.lorem.paragraphs(3) + allowedHtml(),
      'contentType': randomContentType(),
      'playbackType': randomPlaybackType(),
      'webPlaybackUrl': faker.internet.url().replace('http:', 'https:'),
      'mobilePlaybackUrl': faker.internet.url().replace('http:', 'https:'),
      'thumbnails': [
        {
          'url': faker.internet.url().replace('http:', 'https:'),
          'height': faker.random.number(),
          'width': faker.random.number(),
        },
      ],
      'channelTitle': faker.random.word(),
    };

    // add a random amount of more thumbnails
    for (let k = 0; k < faker.random.number({min: 0, max: 12}); k++) {
      contentItem.thumbnails.push({
        'url': faker.internet.url().replace('http:', 'https:'),
        'height': faker.random.number(),
        'width': faker.random.number(),
      });
    }

    // Add new item
    contentItemArray.push(contentItem);
  }

  console.info('Saving ALL data in memory...');
  content.create(contentItemArray);
  console.info('Saved successfully!');
  console.info('IMPORTANT: The in-memory will requires a few seconds to a minute to flush the entire contents to ' +
    'the file mockdb.json, leave this script running until the mockdb.json is updated.');
});

function randomContentType() {
  const randomIndex = faker.random.number({min: 0, max: 2});
  switch (randomIndex) {
    case 0:
      return 'video';
    case 1:
      return 'audio';
    case 2:
      return 'course';
  }
}

function randomPlaybackType() {
  const randomIndex = faker.random.number({min: 0, max: 2});
  switch (randomIndex) {
    case 0:
      return 'workday';
    case 1:
      return 'iframe';
    case 2:
      return 'external';
  }
}

function allowedHtml() {
  return '<h1>header 1</h1><h2>header2</h2><h3>header3</h3><p>paragraph</p><strong>strong</strong><i>italics</i> \
  \ <u>underline</u><span>span</span><ul>unordered list<li>list item1</li><li>list item2</li></ul>';
}
