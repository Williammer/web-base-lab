const fs = require("fs-extra"),
  open = require("open"),
  action = process.argv[2],
  title = process.argv[3],
  copyTitle = process.argv[4];

if (!title || !action) {
  throw "Invalid `action` or `title` provided.";
  return;
}

const targetFolder = `./${title}`,
  targetHtml = `${targetFolder}/index.html`;

switch (action) {
  case "run":
    open(targetHtml, `Google Chrome`);
    break;

  case "rm": {
    fs.remove(targetFolder, function(err) {
      if (err) throw err;

      console.log(`removed '${title}'!`);
    });
    break;
  }

  case "copy": {
    if (!copyTitle) {
      throw `invalid input(copyTitle) provided.`;
    }

    fs.copy(`./${copyTitle}`, targetFolder, err => {
      if (err) throw err;

      console.log(`copied '${title}'!`);
    });
    break;
  }

  case "add": {
    const sampleFolder = `./_sample`;

    fs.copy(sampleFolder, targetFolder, err => {
      if (err) throw err;

      console.log(`added '${title}'!`);
    });

    break;
  }

  default:
    throw `unknown action, please use 'add'/'copy'/'rm'/'run' with a title.`;
    return;
}
