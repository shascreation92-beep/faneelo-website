const fs = require('fs');
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@400;500;600;700;800&display=swap');\n\n`;
const css = fs.readFileSync('britsofa.css', 'utf8');
fs.writeFileSync('src/index.css', fontImport + css);
console.log('src/index.css updated successfully with exact BritSofa stylesheet');
