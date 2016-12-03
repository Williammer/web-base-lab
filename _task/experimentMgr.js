const fs = require("fs-extra"),
    action = process.argv[2],
    title = process.argv[3];

if (!title || !action) {
    throw `invalid input(action / title) provided.`;
    return;
}

if (action == "rm") {
    fs.remove(`./${title}`, function(err) {
        if (err) throw err;

        console.log(`remove '${title}' success!`)
    });

} else if (action == "add") {
    const tmplSrcPath = `./_sample`;
    const solutionDstPath = `./${title}`;

    fs.copy(tmplSrcPath, solutionDstPath, (err) => {
        if (err) throw err;

        console.log(`'${title}' - rename and copy complete.`);
    });

} else {
    throw `unknown action, please use 'add' or 'rm' together with 'title'.`;
    return;
}
