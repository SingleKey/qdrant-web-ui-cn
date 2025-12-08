
# Qdrant Web UI v0.2.5 中文翻译版

> 本项目是 Qdrant Web UI v0.2.5 AI中文翻译版，旨在让初学者更容易上手Qdrant向量数据库，本项目将其node_modules中的其中一个表单依赖（CreateCollectionForm）转移至component文件夹下，与项目同时构建，官方原版在：[qdrant-web-ui](https://github.com/qdrant/qdrant-web-ui)，以下是原版README的中文翻译。

这是一个面向 [Qdrant](https://github.com/qdrant/qdrant) 向量搜索引擎的**自托管 Web 管理界面**。

该 UI 本意由 Qdrant 服务自身提供，但你也可以将其作为独立应用部署与使用。

其主要目标是：为用户提供一种**简洁直观的方式**，用于**浏览和管理 Qdrant 中的集合（collections）**。

类似于 Elasticsearch 的 [Kibana](https://www.elastic.co/kibana)，但**无需额外依赖任何服务**。

---

## 可用脚本命令

在项目目录中，你可以运行以下命令：

### `npm start`

以**开发模式**启动应用。  
请访问 [http://localhost:3000](http://localhost:3000) 在浏览器中查看。

⚠️ 开发模式默认要求 Qdrant 服务运行在 [http://localhost:6333](http://localhost:6333)。

---

### `npm test`

以**交互式监听模式**运行测试套件。  
更多详情请参见 [运行测试文档](https://facebook.github.io/create-react-app/docs/running-tests)。

---

### `npm run build`

构建**生产环境版本**，输出至 `build` 目录。  
此命令会：

- 启用 React 生产模式；
- 自动压缩代码；
- 为静态资源文件名添加哈希值（避免缓存问题）；
- 最大化性能与加载速度。

构建完成后，即可部署上线。  
部署相关说明详见 [部署文档](https://facebook.github.io/create-react-app/docs/deployment)。

---

## 技术栈

- **[React](https://reactjs.org/)** — 构建用户界面的声明式 JavaScript 库  
- **[MUI](https://mui.com/core/)**（原 Material-UI）— React 组件库，提供美观、响应式的 UI 元素  
- **[Axios](https://axios-http.com/)** — 基于 Promise 的 HTTP 客户端，用于与 Qdrant REST API 通信  
