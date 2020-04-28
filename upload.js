const fs = require('fs');
const path = require('path');
const COS = require('cos-nodejs-sdk-v5');

const server_conf = loadJSON('./var/server.config.json');

fileDisplay('./static/dist');

var cos = new COS({
    SecretId: server_conf.cos.SecretId,
    SecretKey: server_conf.cos.SecretKey,
});
// 分片上传
function upload(filePath, fileName) {
    if (!filePath || !fileName) return;
    console.log(`/app/${fileName}`)
    return new Promise((resolve, reject) => {
        cos.sliceUploadFile({
            Bucket: server_conf.cos.Bucket.app, // Bucket 格式：test-1250000000
            Region: server_conf.cos.Region,
            Key: `/app/${fileName}`,
            FilePath: filePath
        }, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    })
}

function loadJSON(filename) {
    try {
        const content = fs.readFileSync(filename, "utf8");
        return JSON.parse(content);
    } catch (error) {
        return {};
    }
}

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表
            files.forEach(function (filename) {
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if (isFile) {
                            upload(filedir, filedir.replace(/\\/g, '/'))
                        }
                        if (isDir) {
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });

        }
    });
}
