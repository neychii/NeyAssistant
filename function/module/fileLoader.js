const { glob } = require("glob");
const path = require("path");

async function deleteCache(file) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

async function fileLoader(directory) {
    let self = path.basename(__filename).split(".")[0].toUpperCase();
    self = "[" + self + "]";
    console.log(`${self} Loading '${directory.split("/").slice(1)}'`);

    try {
        const files = await glob(
            path.join(process.cwd(), directory, "**/*.js").replace(/\\/g, "/")
        );

        const jsFiles = files.filter(file => path.extname(file) === ".js");
        for (const file of jsFiles) {
            console.log(`${self} Loading '${file.split("/").pop()}'`);
        }

        await Promise.all(jsFiles.map(deleteCache));

        return jsFiles;
    } catch (error) {
        console.error(
            `Error loading files from directory ${directory}: ${error}`
        );
        throw error;
    }
}

module.exports = { fileLoader };
