# 开发

# 准备配置文件

根目录下新建 var 文件夹，然后把根目录的 example.config.json 复制到 var 文件夹下，并更名为`server.config.json`。系统中用到的所有配置都来自这个 json 文件。

根据实际情况配置。自己也可以新增。然后用`server/modules/config.ts`里的方法读取配置

## 安装依赖

    npm i

    npm run dev-server

    npm run dev-static

然后 static 启动在 3000 端口 server 启动在 4000 端口。server 调试端口在 4005

# 部署

1. 把代码推到 github
2. 登陆服务器，到指定目录下 git 拉取代码
3. 按需安装 npm i (貌似服务器上不能自动到 server、static 文件夹下安装，则手动到俩文件夹下安装)
4. sh deploy
5. pm2 restart index

执行`sh deploy`后。前端文件会上传到cos。server代码会生成在`var/server`文件夹下。

**_dockers 部署废弃（太麻烦了）_**

## 生成 docker 镜像

在 node_modules 完全安装的情况下

    # sh deploy

会生成打包好的代码在 var 文件夹下
然后生成 docker 镜像

    docker build -t liuzhou_market .

把镜像推到 Docker hub

    docker tag liuzhou_market helloworld20/liuzhou_market

    docker push helloworld20/liuzhou_market

如果没有登陆 docker hub 则需要

    docker login

根据提示填写账号密码即可

## 部署 docker 镜像

登陆远程服务器，run 远程镜像

    docker run --name App -p 3000:3000 -t helloworld20/liuzhou_market

但是有个小问题是。一旦`ctrl + c`或者关调终端后会退出 docker。所以还得重新启动

    docker ps -a

找到暂停的 id

    docker restart <id>

即可
