# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GABLILY PREMIER (GP 珈珮) — 高端珍珠首饰品牌官网。全栈项目：Next.js 前端 + Strapi v5 CMS + Docker 部署到阿里云 ECS。

详细建站规划见 `PLAN.md`。设计稿参考在 `stitch_gp_brand_official_website/`，甲方原始需求在 `甲方原始需求文件/`。

## Commands

```bash
# 前端开发
cd frontend && npm run dev          # http://localhost:3000
cd frontend && npm run build        # 生产构建

# 后端开发
cd backend && npm run develop       # http://localhost:1337/admin
cd backend && npm run build         # 构建 Strapi admin
cd backend && npm start             # 生产模式启动

# Docker 部署（需 Docker 环境）
docker compose up -d --build        # 构建并启动全部服务
docker compose logs -f              # 查看日志
docker compose down                 # 停止
```

## Architecture

```
Nginx(:80) → /api/*,/admin/*,/uploads/* → Strapi(:1337) → PostgreSQL(:5432)
           → /*                          → Next.js(:3000)
```

- **frontend/** — Next.js 16 (App Router) + Tailwind v4 + TypeScript。`output: 'standalone'` 用于 Docker 优化。
- **backend/** — Strapi v5 CMS。本地用 SQLite，生产用 PostgreSQL。
- **nginx/** — 反向代理，路由规则见 `nginx/conf/default.conf`。
- **docker-compose.yml** — 编排 4 个 service：nginx, frontend, backend, postgres。

## Key Constraints

### Strapi v5 配置
- 配置文件必须是 `.js` 格式（不是 `.ts`），Strapi 的 `loadConfigFile` 只识别 `.js`/`.json`
- SQLite 方言名是 `sqlite`（不是旧版的 `better-sqlite3`）
- 必须有 `config/admin.js` 配置 `auth.secret`
- `tsconfig.json` 的 `rootDir` 设为 `.` 以确保 `config/` 和 `src/` 同时编译到 `dist/`

### Frontend 设计体系
- Tailwind v4 使用 CSS-first 配置（`globals.css` 中的 `@theme inline`），不是独立的 `tailwind.config.ts`
- 品牌 token 定义在 `frontend/src/app/globals.css`（颜色、间距、圆角、动效）和 `frontend/src/lib/design-tokens.ts`
- 玻璃拟态样式：`.glass-panel` 和 `.gradient-shell` CSS 类
- 主色 `#0F172A`，背景 `#F8F9FA`，字体 Inter

### 动效规范（GSAP ScrollTrigger）
- **所有多元素板块必须用 `pin + scrub` 模式**，不用 autoplay 一次性动画
- `scrub: 1~1.5`（平滑延迟），`end: '+=${vh * 2~2.5}'`（舒适节奏）
- Hero 入场是唯一允许 autoplay 的例外
- 向下滚动元素逐一出现，向上滚动反向回退
- GSAP 必须动态 import，用 `gsap.context()` 包裹，cleanup 时 `ctx.revert()`

### 页面架构规范
- 每个子页内容必须独立，不允许跨页面复制内容
- 首页 Bento Grid 每张卡片必须链接到对应子页
- Services = 售后保养 + 真伪鉴定 + 门店定位；Bespoke = 高定定制旅程
- 品牌文案必须高雅传世，使用手册原文（如"始于对自然的敬畏与对光的执着"），不造通用文案

### Hydration 安全
- 禁止在 useState 初始值中使用 `typeof window` 判断
- 正确模式：默认服务端安全值 → useEffect 中读 localStorage → mounted flag 控制渲染

### 品牌资产
- 真实图片在 `frontend/public/images/gp-manual-01~20.png`
- 文件名必须 URL-safe ASCII
- 品牌手册页面可作 Hero 背景（需加渐变遮罩）

### 环境变量
- 后端 `.env` 不提交（已在 .gitignore），模板见 `.env.example`
- 前端通过 `NEXT_PUBLIC_STRAPI_URL` 连接 Strapi
- 服务端内部通过 `STRAPI_URL` 访问（Docker 内是 `http://backend:1337`）

## 环境变量

- **密钥不用公开前缀** — `NEXT_PUBLIC_*` 会暴露到客户端 JS，密钥/token 一律不用此前缀
- 本地开发无需 Docker，Node.js 直接启动前后端即可
- 生产部署时数据库切换为 `postgres`，本地用 `sqlite`
