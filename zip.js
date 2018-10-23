const fs = require('fs');
const git = require('git-rev-sync');
const path = require('path');
const zip = require('bestzip');
const bundleDir = path.join('build', 'bundle');
const artifactDir = path.join('build', 'artifacts');
const artifactDirRelativeToBundles = path.join('..', 'artifacts');
const packageVersion = require('./package.json').version;

function generateVersion() {
    const majorMinorVersion = packageVersion.slice(0, packageVersion.lastIndexOf('.'));
    const timestamp = Math.floor(Date.now() / 1000);
    return `${majorMinorVersion}.${timestamp}`
}

const version = generateVersion();
fs.mkdir(artifactDir, () => {
    fs.readdirSync(bundleDir).forEach(file => {
        const filenameNoExt = file.slice(0, file.lastIndexOf('.'));
        const zipFilename = `${filenameNoExt}-${version}-${git.short()}.zip`;
        zip({
            cwd: bundleDir,
            source: file,
            destination: path.join(artifactDirRelativeToBundles, zipFilename),
        }).then(() => {
            const inFile = path.join(bundleDir, file);
            const outFile = path.join(artifactDir, zipFilename);
            console.log(`LAMBDA ARTIFACT: ${inFile} => ${outFile}`);
        }).catch((err) => {
            console.error(err);
            process.exit(1);
        });
    });
});
