// 构建时由 NEXT_PUBLIC_BASE_PATH 注入，GitHub Pages 部署时为 /gp-brand，本地为空
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
