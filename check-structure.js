const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js',
  'next-i18next.config.js',
  'ecosystem.config.js'
];

const requiredFolders = [
  'app',
  'components',
  'lib',
  'models',
  'public',
  'scripts'
];

console.log('🔍 检查项目结构...\n');
console.log('📄 检查必需文件：\n');

let filesOk = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 缺失！`);
    filesOk = false;
  }
});

console.log('\n📁 检查必需文件夹：\n');

let foldersOk = true;
requiredFolders.forEach(folder => {
  const exists = fs.existsSync(path.join(__dirname, folder));
  if (exists && fs.statSync(path.join(__dirname, folder)).isDirectory()) {
    console.log(`✅ ${folder}/`);
  } else {
    console.log(`❌ ${folder}/ - 缺失！`);
    foldersOk = false;
  }
});

console.log('\n' + '='.repeat(50));

if (filesOk && foldersOk) {
  console.log('\n✅ 项目结构正确！可以打包上传到 Hostinger。\n');
  console.log('📦 打包提示：');
  console.log('   1. 在项目根目录选中所有文件和文件夹（除了 node_modules 和 .next）');
  console.log('   2. 右键 → 压缩为 zip');
  console.log('   3. 确保 package.json 在压缩包的根目录\n');
} else {
  console.log('\n❌ 项目结构不完整！');
  console.log('   请检查缺失的文件或文件夹，然后重新运行此脚本。\n');
  process.exit(1);
}
