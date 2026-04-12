const fs = require('fs');

const filepath = '/Users/rahuljangir/Downloads/Projects/CodeWithAjay/CodeWithAjay/frontend/src/data/syllabusData.js';
let dataString = fs.readFileSync(filepath, 'utf-8');

// Quick and dirty parser by replacing items array of strings to objects
let updated = dataString.replace(/items:\s*\[([\s\S]*?)\]/g, (match, itemsContent) => {
    const rawItems = itemsContent.split(',').map(i => i.trim()).filter(i => i);
    // some items might contain commas if they are strings. A safe eval is better.
    return match;
});
// The regex approach is brittle. Let's just require it, modify in memory, and generate file.

