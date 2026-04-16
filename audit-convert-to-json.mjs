// save as: audit-convert-to-json.mjs
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'audit-results', 'broken-external-links.csv');
const outputPath = path.join(__dirname, 'public', 'broken-links.json');

try {
  const rows = fs
    .readFileSync(inputPath, 'utf8')
    .split('\n')
    .slice(1) // remove header
    .filter(Boolean);

  const uniqueRows = [...new Set(rows)];

  fs.writeFileSync(outputPath, JSON.stringify(uniqueRows, null, 2));

  console.log(`Saved ${uniqueRows.length} unique broken links to ${outputPath}`);
} catch (err) {
  console.error('Error processing file:', err.message);
  process.exit(1);
}