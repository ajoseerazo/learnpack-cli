const vscode = require("vscode");
const lp = require("../learnpack");
const logger = require("../utils/console");
const fs = require("fs");

//create reset folder
const createResetFile = (path, slug, name) => {
  logger.debug(`Creating reset ${slug}/${name} file`);

  if (!fs.existsSync(`${extension.workspaceRoot}/.learn/resets`)) {
    fs.mkdirSync(`${extension.workspaceRoot}/.learn/resets`);
  }

  if (!fs.existsSync(`${extension.workspaceRoot}/.learn/resets/` + slug)) {
    fs.mkdirSync(`${extension.workspaceRoot}/.learn/resets/` + slug);
    if (
      !fs.existsSync(`${extension.workspaceRoot}/.learn/resets/${slug}/${name}`)
    ) {
      const content = fs.readFileSync(`${extension.workspaceRoot}/${path}`);
      fs.writeFileSync(
        `${extension.workspaceRoot}/.learn/resets/${slug}/${name}`,
        content
      );
    }
  }
};

module.exports = async () => {
  logger.debug("open current");

  let current = lp.currentExercise();

  logger.debug(`Opening ${current.slug}`, current);
  return openFiles(current);
};

const openFiles = async (ex) => {
  const files = ex.visibleFiles;
  logger.debug(`Files to open`, files);
  let editor = null;
  for (let i = 0; i < files.length; i++) {
    const file = vscode.Uri.file(`${extension.workspaceRoot}/${files[i].path}`);
    const fileName = files[i].name;
    const path = files[i].path;
    createResetFile(path, ex.title, fileName);
    editor = await vscode.window.showTextDocument(
      file,
      vscode.ViewColumn.One,
      false
    );
  }
  return editor;
};
