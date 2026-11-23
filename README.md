# 智能任务管理系统

基于 **React（Vite）+ Supabase（PostgreSQL）** 的任务管理应用，支持任务的添加、完成状态切换、删除、按优先级筛选，数据持久化保存在 Supabase 云端数据库。

## 功能清单

- 输入任务标题，选择优先级（高 / 中 / 低）后添加入库
- 任务列表按创建时间倒序显示（最新在最上面）
- 每条任务显示：标题、优先级标签、完成状态
- 「标记完成 / 标记未完成」切换按钮、「删除」按钮
- 已完成任务文字自动加删除线、颜色变淡
- 顶部按优先级筛选：全部 / 高 / 中 / 低
- 刷新或关闭浏览器后数据不丢失

## 技术栈

- 前端：React 18 + Vite 5
- 数据库：Supabase（PostgreSQL），通过 `@supabase/supabase-js` 访问 REST API
- 代码托管：GitHub
- 部署：Vercel

## 目录结构

```
task-manager/
├── index.html
├── package.json
├── vite.config.js
├── .env.example          # 环境变量示例（复制为 .env.local 使用）
├── .gitignore
├── sql/
│   └── init.sql          # 建表 + RLS 策略 SQL
└── src/
    ├── main.jsx
    ├── App.jsx           # 页面与任务逻辑
    ├── supabase.js       # Supabase 客户端
    └── styles.css
```

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，填入 Supabase 项目凭据：

```
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_你的key
```

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器打开终端提示的地址（默认 http://localhost:5173）。

## Supabase 数据库准备

1. 登录 https://supabase.com ，新建项目 `task-manager`，区域选 Singapore。
2. 打开 SQL Editor，依次执行 `sql/init.sql` 中的建表语句与 RLS 策略。
3. 在 Project Settings → API Keys 中复制 **Project URL** 和 **Publishable key**（`sb_publishable_` 开头），填入 `.env.local`。

## 上传 GitHub

```bash
cd task-manager
git init
git add .
git commit -m "init: 智能任务管理系统"
git remote add origin https://github.com/你的用户名/task-manager.git
git branch -M main
git push -u origin main
```

> 确认 `.env` / `.env.local` 已被 `.gitignore` 排除，不要把密钥提交到仓库。

## 部署到 Vercel

1. 登录 https://vercel.com ，Add New → Project，导入 GitHub 上的 `task-manager` 仓库。
2. 在 Environment Variables 中添加：

   | Name | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_` 开头的 Publishable key |

3. 点击 Deploy，等待 1～3 分钟，即可获得 `https://task-manager-xxx.vercel.app` 线上地址。

## 常见问题

- **添加任务报 RLS 错误**：检查 `sql/init.sql` 中四条 `create policy` 是否已全部执行。
- **relation "tasks" does not exist**：建表 SQL 未执行成功，回 Supabase SQL Editor 重跑。
- **Vercel 线上看不到数据**：核对线上环境变量中的 `VITE_SUPABASE_URL` 项目 ID 与 Supabase 后台一致。
