# 地铁最短线路查询
1400012729 张乐聪
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
- cheerio Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
## 文件结构
```
index.js 项目主入口
public/ 前端网页信息

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
- **完全**实现了作业要求
- **提前交，并且在课上进行了展示**
- 额外在换乘站做了提醒
- 使用 ajax 交互
- 设计了看起来还算友好的界面