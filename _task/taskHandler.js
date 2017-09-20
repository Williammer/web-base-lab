const fs = require("fs-extra"),
    open = require("open"),
    action = process.argv[2],
    title = process.argv[3],
    copyTitle = process.argv[4];

if (!title || !action) {
    throw `invalid input(action / title) provided.`;
    return;
}

const targetFolder = `./${title}`,
    targetHtml = `${targetFolder}/index.html`;

if (action == "run") {
    open(targetHtml, `Google Chrome`);

} else if (action == "rm") {
    fs.remove(targetFolder, function(err) {
        if (err) throw err;

        console.log(`remove '${title}' success!`)
    });

} else if (action == "copy") {
    if (!copyTitle) {
        throw `invalid input(copyTitle) provided.`;
    }

    fs.copy(`./${copyTitle}`, targetFolder, (err) => {
        if (err) throw err;

        console.log(`'${title}' - rename and copy complete.`);
    });
} else if (action == "add") {
    const sampleFolder = `./_sample`;

    fs.copy(sampleFolder, targetFolder, (err) => {
        if (err) throw err;

        console.log(`'${title}' - rename and copy complete.`);
    });

} else {
    throw `unknown action, please use 'add' or 'rm' together with 'title'.`;
    return;
}
