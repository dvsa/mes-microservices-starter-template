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
const gitRev = git.short();
fs.mkdir(artifactDir, () => {
    fs.readdirSync(bundleDir).forEach(file => {
        const filenameNoExt = file.slice(0, file.lastIndexOf('.'));
        const zipFilename = `${filenameNoExt}-${version}-${gitRev}.zip`;
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

    const coverageDir = 'coverage'
    if (fs.existsSync(coverageDir)) {
        const coverageFilename = `journal-coverage-${version}-${gitRev}.zip`;
        zip({
            cwd: '.',
            source: 'coverage',
            destination: path.join(artifactDir, coverageFilename)
        }).then(() => {
            const outFile = path.join(artifactDir, coverageFilename)
            console.log(`COVERAGE ARTIFACT: ${coverageDir} => ${outFile}`);
        });
    } else {
        console.log('No coverage found');
    }
});
