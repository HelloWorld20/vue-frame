FROM node:alpine

ENV NODE_ENV production
ENV PROJECT_ENV production

# 工作目录
WORKDIR /app

# 复制源码
COPY /var/server /app/server

# 全局安装pm2模块
RUN npm i -g pm2

# 测试
# RUN npm install -g http-server

# CMD http-server ./dist -p 80

# 镜像内的服务使用 3000 端口
EXPOSE 3000

# 传递环境变量
ENV NODE_ENV=production PORT=3000

CMD pm2-docker start server/dist/index.js
