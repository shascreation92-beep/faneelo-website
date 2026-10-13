const fs = require('fs');
const js = fs.readFileSync('page_home.js', 'utf8');
const pos = js.indexOf('function W(');
console.log('Pos of W():', pos);
console.log(js.slice(pos, pos + 2000));
