const tsGen = require('breeze-entity-generator/tsgen-core');
const fs = require('fs');
const dir = './src/model';
const metadata = '../metadata.json';
//'"C:/Users/allen/Source/Repos/demo20201014/metadata.json"'

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

if (!fs.existsSync(metadata)) {
  return console.log("file missing");
} else {
  let rawdata = fs.readFileSync(metadata);
  let m = JSON.parse(rawdata);
  console.log(m);
}

tsGen.generate({
  inputFileName: metadata,
  outputFolder: dir,
  camelCase: true,
  baseClassName: 'BaseEntity',
  kebabCaseFileNames: true,
  codePrefix: 'LineOfCredit'
});