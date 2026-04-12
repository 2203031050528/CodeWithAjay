import fs from 'fs';
import path from 'path';

const filepath = '/Users/rahuljangir/Downloads/Projects/CodeWithAjay/CodeWithAjay/frontend/src/data/syllabusData.js';
let content = fs.readFileSync(filepath, 'utf-8');

// I will just use string manipulation to convert `items: ['A', 'B']` to `items: [{ title: 'A', topicId: 'slug-a' }, { title: 'B', topicId: 'slug-b' }]`
// Let's execute this logic dynamically when the app loads so we don't have to rewrite the file.
