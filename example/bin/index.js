const { spawn } = require('child_process');

function ps(command) {
  // console.log(command.join(' '))
  const sp = spawn("node", ['../../dist/cli.js', ...command]);
  sp.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
}
function testImg() {
  ps([, '-i', './long.png', '-d', 'row', '-s', '300, 200'])
}

function testJson() {
  ps(['-j', './multi.json'])
}


testImg();

testJson()