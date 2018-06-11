# 地铁最短线路查询
1400012729 张乐聪（文档/文案我会写在备注后面）
## 如何运行
```
npm install # 安装依赖
node index.js
```
访问 localhost:3000 查看系统
## 主要用到的框架（显得我做的很认真）
- sequelize nodejs 的 ORM 框架
- vuejs 前端框架
- superagent http io工具
- expressjs nodejs 后端框架
- semanticui 前端 ui 框架
- jquery 我也不想用这个，只不过这个和一些 semanticui 的组件要配合着来
- cheerio Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
## 文件结构
```
index.js 项目主入口
public/ 前端网页信息
public/index.html 包含页面信息和 script

getDistance.js 从网站上下载地铁的距离信息
distanceInfo.json 距离信息

getStopLineInfo.js 获取哪一站在哪一条线上
stopLineInfo.json 每条线有哪站的信息

initDb.js 将 distanceInfo.json 和 stopLineInfo.json 的数据导入数据库 metro.sqlite
metro.sqlite 地铁信息数据库
model.js Sequelize 的模型文件

floyd.js 佛洛依德距离算法
testF.js 测试 floyd.js

其他 不需要了解是干什么的
```
## 备注
- *完全*实现了作业要求
- *提前交，并且在课上进行了展示*
- 额外在换乘站做了提醒
- 使用 ajax 交互
- 设计了看起来还算友好的界面

## 文案
###简要需求分析
通过北京地铁网站，采集每条地铁线路数据并将其存储到数据库。在浏览器端输入起止站名，可以计算出最短行进路线(通过站包括换乘站等)；
###简要项目说明
实现了上述需求，并多做了一点微小的工作
###重点难点分析
####难点
繁琐的过程
####重点
1. 下载网站页面
2. 用 cheerio 解析页面
3. 保存信息为 json 格式
4. 将信息导入数据库
5. server 启动，从数据库获取距离信息
6. 调用 floyd 算法计算距离，将信息保存在内存中
7. 每当有请求发来，把信息发回去
8. 在前端使用 vuejs 来渲染页面
###简要测试数据
可以运行`node testF.js`来测试，当然了，用来测试的数据是完整的数据
###简要操作手册
参见《如何运行》章节