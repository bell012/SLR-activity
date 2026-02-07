# DF-Vue3 H5 项目

基于 Vue3 + TypeScript + Vite 的移动端 H5 项目模板

## 技术栈

- **框架**: Vue 3.x
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 请求**: Axios
- **UI 组件库**: Vant 4
- **CSS 预处理器**: Sass
- **移动端适配**: amfe-flexible + postcss-pxtorem
- **代码规范**: ESLint + Prettier + Husky + Commitlint

## 功能特性

### 1. 移动端适配
- 基于 375px 设计稿
- 自动将 px 转换为 rem

### 2. 移动端调试
- 集成 vConsole 调试工具
- 开发模式自动启用
- 生产模式自动关闭
- 可查看控制台、网络请求、元素等

### 3. 代码规范
- ESLint 代码检查
- Prettier 代码格式化
- Husky Git Hooks
- Commitlint 提交信息规范

## 开始使用

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 开发模式
\`\`\`bash
npm run dev
\`\`\`

### 构建生产
\`\`\`bash
npm run build
\`\`\`

### 预览生产构建
\`\`\`bash
npm run preview
\`\`\`

### 代码检查
\`\`\`bash
npm run lint
\`\`\`

### 代码格式化
\`\`\`bash
npm run format
\`\`\`

## Git 提交规范

使用 Commitlint 规范提交信息，格式为：`<type>: <subject>`

### Type 类型
- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档变更
- **style**: 代码格式（不影响代码运行）
- **refactor**: 重构
- **perf**: 性能优化
- **test**: 增加测试
- **chore**: 构建过程或辅助工具的变动
- **revert**: 回退
- **build**: 打包

### 示例
\`\`\`bash
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复首页数据加载问题"
\`\`\`

## 项目结构

\`\`\`
src/
├── App.vue                 # 根组件
├── main.ts                 # 入口文件
├── vite-env.d.ts          # TypeScript 类型声明
├── router/                 # 路由配置
│   └── index.ts
├── store/                  # Pinia 状态管理
│   ├── index.ts
│   └── modules/
│       └── user.ts
├── views/                  # 页面组件
│   └── Home.vue
├── styles/                 # 全局样式
│   ├── reset.scss
│   └── variables.scss
└── utils/                  # 工具函数
    ├── request.ts          # Axios 封装
    └── vconsole.ts         # vConsole 配置
\`\`\`

## 真机调试

1. 确保手机和电脑在同一局域网
2. 运行 `npm run dev`
3. 使用手机浏览器访问控制台显示的局域网地址（如：http://192.168.x.x:3000）
4. 开发模式下会自动显示 vConsole 调试面板

## 注意事项

1. **px 转 rem**: 设计稿 375px，写样式时直接写 px，会自动转换为 rem
2. **不转换 rem**: 如需某些元素不转换，添加 `.no-rem` 类名
3. **Vant 组件**: 已全局引入，可直接使用
4. **环境变量**: 在 `.env.development` 和 `.env.production` 中配置

## License
1
MIT

