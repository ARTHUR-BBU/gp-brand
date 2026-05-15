# GP 珈珮品牌官网 — Docker 全栈项目搭建计划

## Context

GABLILY PREMIER (GP 珈珮) 是一个高端珍珠首饰品牌，需要搭建一个品牌官网。Stitch 已交付 5 个静态 HTML 设计稿 + 设计体系文档。现在需要构建正式的全栈项目框架，使用 Docker 容器化部署到阿里云 ECS。

技术选型已确认：**Next.js (App Router) + Strapi v5 + PostgreSQL + Nginx**

---

## 项目结构

```
F:\gp_brand\
├── docker-compose.yml              # 生产环境编排
├── docker-compose.dev.yml          # 开发环境覆盖配置
├── .env.example                    # 环境变量模板
├── .gitignore
│
├── frontend/                       # Next.js 前端
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   ├── public/
│   │   └── images/                 # 品牌图片资源
│   └── src/
│       ├── app/                    # App Router 页面
│       │   ├── layout.tsx          # 根布局
│       │   ├── page.tsx            # 首页
│       │   ├── globals.css         # 全局样式 + 设计 token
│       │   ├── collections/page.tsx
│       │   ├── categories/page.tsx
│       │   ├── craftsmanship/page.tsx
│       │   └── services/page.tsx
│       ├── components/             # 共享组件
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
│       │   │   └── Footer.tsx
│       │   └── ui/
│       │       └── GlassPanel.tsx  # 核心玻璃拟态组件
│       └── lib/
│           ├── api.ts              # Strapi API 客户端
│           └── design-tokens.ts    # 设计 token 常量
│
├── backend/                        # Strapi v5 CMS
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── config/                     # .js 格式（Strapi v5 配置加载器要求）
│   │   ├── admin.js               # 管理后台认证配置
│   │   ├── database.js            # 数据库配置（sqlite 本地 / postgres 生产）
│   │   ├── server.js              # 服务器配置
│   │   ├── plugins.js             # 插件配置
│   │   └── middlewares.js         # 中间件配置
│   ├── public/uploads/            # Strapi 媒体上传目录
│   └── src/
│       ├── admin/                  # 管理面板自定义
│       ├── api/                    # Content Types（后续添加）
│       └── extensions/            # 插件扩展
│
├── nginx/                          # Nginx 反向代理
│   ├── Dockerfile
│   └── conf/
│       └── default.conf           # Nginx 路由配置
│
├── stitch_gp_brand_official_website/  # 设计稿参考（保留）
└── 甲方原始需求文件/                    # 原始需求（保留）
```

---

## Docker Compose 服务架构

```
┌─────────────────────────────────────────────┐
│              Nginx (:80/:443)                │
│         反向代理 + SSL + 静态资源            │
├──────────────┬──────────────────────────────┤
│              │                              │
│  /api/*      │  /*                          │
│  /admin/*    │                              │
│  /uploads/*  │                              │
│      ▼       │       ▼                      │
│  Strapi      │   Next.js                    │
│  (:1337)     │   (:3000)                    │
│              │                              │
│      ▼       │                              │
│  PostgreSQL  │                              │
│  (:5432)     │                              │
└──────────────┴──────────────────────────────┘
```

### Nginx 路由规则

| 路径 | 代理目标 | 说明 |
|------|----------|------|
| `/` | frontend:3000 | 品牌官网 |
| `/api` | backend:1337 | Strapi REST API |
| `/admin` | backend:1337 | Strapi 管理后台 |
| `/uploads` | backend:1337 | Strapi 媒体文件 |
| `/_next/static` | frontend:3000 | Next.js 静态资源（365天缓存） |

---

## 环境变量规划

| 变量 | 说明 | 本地开发 | 生产 |
|------|------|----------|------|
| `NODE_ENV` | 环境 | `development` | `production` |
| `DATABASE_CLIENT` | 数据库类型 | `sqlite` | `postgres` |
| `DATABASE_HOST` | 数据库主机 | — | `postgres` |
| `DATABASE_PORT` | 数据库端口 | — | `5432` |
| `DATABASE_NAME` | 数据库名 | — | `gp_strapi` |
| `DATABASE_USERNAME` | 数据库用户 | — | `gp_admin` |
| `DATABASE_PASSWORD` | 数据库密码 | — | *(强密码)* |
| `ADMIN_JWT_SECRET` | Strapi JWT 密钥 | dev 值 | *(随机生成)* |
| `API_TOKEN_SALT` | API Token 盐 | dev 值 | *(随机生成)* |
| `APP_KEYS` | 应用密钥 | dev 值 | *(随机生成)* |
| `NEXT_PUBLIC_STRAPI_URL` | 前端访问 Strapi | `http://localhost:1337` | `https://域名` |
| `NEXT_PUBLIC_SITE_URL` | 品牌站地址 | `http://localhost:3000` | `https://域名` |

---

## 本地开发启动方式

```bash
# 前端
cd frontend && npm run dev       # → http://localhost:3000

# 后端
cd backend && npm run develop    # → http://localhost:1337/admin
```

## Docker 部署方式（阿里云 ECS）

```bash
# 构建并启动
docker compose up -d --build

# 查看日志
docker compose logs -f

# 停止
docker compose down
```

---

## 实施步骤与状态

| 步骤 | 内容 | 状态 |
|------|------|------|
| Step 1 | 项目根配置（docker-compose、.env、.gitignore） | ✅ 完成 |
| Step 2 | Nginx 反向代理配置 | ✅ 完成 |
| Step 3 | Next.js 前端（App Router + Tailwind + 5 页面骨架） | ✅ 完成 |
| Step 4 | Strapi v5 后端（SQLite 本地 / PostgreSQL 生产） | ✅ 完成 |
| Step 5 | 本地验证 | ✅ 完成 |

---

## 已踩过的坑

1. **Strapi v5 配置文件必须是 `.js`**：`loadConfigFile` 只识别 `.js` 和 `.json`，`.ts` 会被忽略返回空对象
2. **Strapi v5 SQLite 方言名是 `sqlite`**：不是旧版的 `better-sqlite3`
3. **Strapi v5 需要 `config/admin.js`**：必须配置 `auth.secret`，否则 SessionManager 报错
4. **tsconfig.json 的 `rootDir`**：设为 `.` 让 TypeScript 同时编译 `config/` 和 `src/` 到 `dist/`，Strapi 才能正确加载配置
5. **Next.js standalone 输出**：`output: 'standalone'` 配合多阶段 Dockerfile，生产镜像体积极小

---

*计划创建时间：2026-05-13*
*最后更新：2026-05-13*
