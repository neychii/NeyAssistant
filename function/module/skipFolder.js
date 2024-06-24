function skipFolders(file) {
    let fileLog = file.split('/').pop();
    if (file.split('/').slice(0, -1).pop().startsWith('@')) {
        console.log(
            `[HANDLERS] Skipped ${fileLog}`
        );
        return true;
    }
    return false;
}

module.exports = {skipFolders}