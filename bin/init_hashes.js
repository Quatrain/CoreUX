const fs = require('node:fs');
const path = require('node:path');
const { computePackageHash } = require('./hashUtils');

const packagesDir = path.join(__dirname, '../packages');
const outputFile = path.join(__dirname, '../.version_hashes.json');
const registry = {};

async function run() {
    const packages = fs.readdirSync(packagesDir);
    for (const pkg of packages) {
        const pkgDir = path.join(packagesDir, pkg);
        if(!fs.statSync(pkgDir).isDirectory()) continue;
        const pkgJsonPath = path.join(pkgDir, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
            const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
            const hash = await computePackageHash(pkgDir, pkgJson);
            registry[pkgJson.name] = {
                version: pkgJson.version,
                hash: hash,
                last_published: new Date().toISOString()
            };
        }
    }
    fs.writeFileSync(outputFile, JSON.stringify(registry, null, 2), 'utf8');
    console.log(`Created ${outputFile}`);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
