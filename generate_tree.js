const fs = require('fs');
const path = require('path');

function generateTree(dir, prefix = '', isLeft = true, ignoreDirs = ['.git', 'node_modules', 'dist', '.vscode']) {
    let treeStr = '';
    let fileCount = 0;

    if (!fs.existsSync(dir)) return { treeStr, fileCount };

    const files = fs.readdirSync(dir).filter(f => !ignoreDirs.includes(f));

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isLast = i === files.length - 1;
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        treeStr += prefix + (isLast ? '\u2514\u2500\u2500 ' : '\u251C\u2500\u2500 ') + file + '\n';

        if (stats.isDirectory()) {
            const result = generateTree(filePath, prefix + (isLast ? '    ' : '\u2502   '), isLeft, ignoreDirs);
            treeStr += result.treeStr;
            fileCount += result.fileCount;
        } else {
            fileCount++;
        }
    }
    return { treeStr, fileCount };
}

const frontendDir = path.join(__dirname, 'frontend');
const backendDir = path.join(__dirname, 'backend');

let output = '# 🌳 Full Project File Tree\n\n';
output += '> Note: `node_modules`, `.git`, `dist`, and `.vscode` are ignored.\n\n';

let totalFiles = 0;

if (fs.existsSync(frontendDir)) {
    output += '## 🖥️ Frontend\n```\nfrontend\n';
    const result = generateTree(frontendDir);
    output += result.treeStr + '```\n';
    output += `**Frontend Total Files:** ${result.fileCount}\n\n`;
    totalFiles += result.fileCount;
}

if (fs.existsSync(backendDir)) {
    output += '## ⚙️ Backend\n```\nbackend\n';
    const result = generateTree(backendDir);
    output += result.treeStr + '```\n';
    output += `**Backend Total Files:** ${result.fileCount}\n\n`;
    totalFiles += result.fileCount;
}

// Add root files
const rootFiles = fs.readdirSync(__dirname).filter(f => {
    const stats = fs.statSync(path.join(__dirname, f));
    return stats.isFile();
});

output += '## 📁 Root Directory Files\n```\nmain_project\n';
for (let i = 0; i < rootFiles.length; i++) {
    const isLast = i === rootFiles.length - 1;
    output += (isLast ? '\u2514\u2500\u2500 ' : '\u251C\u2500\u2500 ') + rootFiles[i] + '\n';
}
output += '```\n';
output += `**Root Total Files:** ${rootFiles.length}\n\n`;
totalFiles += rootFiles.length;
output += `---\n**Total Files in Project:** ${totalFiles}\n`;

fs.writeFileSync(path.join(__dirname, 'FILE_TREE_STRUCTURE.md'), output);
console.log('Tree generated at FILE_TREE_STRUCTURE.md');
