const fs = require("fs-extra");
const exists = fs.existsSync;

module.exports = async function readAndWrite(path, files) {
  let targetPath = path || process.env.TARGET_PATH + files.target;
  if (files.source) {
    fs.readFile(process.env.ROOT_DIR + "/" + files.source, "utf-8", function (
      err,
      data
    ) {
      if (files.beforeWrite) data = files.beforeWrite(data);
      fs.outputFile(targetPath, data);
    });
  }
};
