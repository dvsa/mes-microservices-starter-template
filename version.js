const packageVersion = require('./package.json').version;
const majorMinorVersion = packageVersion.slice(0, packageVersion.lastIndexOf('.'));
const timestamp = Math.floor(Date.now() / 1000);
console.log(`${majorMinorVersion}.${timestamp}`);
