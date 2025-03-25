const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = './README.pdf';
const mdOutputPath = './readme-copy.md';

// 读取PDF文件
const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    // 获取PDF文本内容
    const text = data.text;
    
    // 简单的格式化处理
    const formattedText = text
        // 处理标题
        .replace(/^(.+)$/gm, (match, p1) => {
            if (p1.trim().length > 0) {
                if (p1.match(/^[A-Z\u4e00-\u9fa5].+/)) {
                    return `\n# ${p1.trim()}\n`;
                }
            }
            return p1;
        })
        // 处理列表项
        .replace(/^[•\-\*]\s+(.+)$/gm, '- $1')
        // 处理代码块
        .replace(/```[\s\S]+?```/g, match => `\n${match}\n`)
        // 处理多余的空行
        .replace(/\n{3,}/g, '\n\n');

    // 写入新的Markdown文件
    fs.writeFileSync(mdOutputPath, formattedText, 'utf8');
    console.log('Markdown文件已生成：' + mdOutputPath);
}).catch(function(error){
    console.error('转换过程中出现错误：', error);
});