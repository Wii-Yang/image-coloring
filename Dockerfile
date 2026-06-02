# 声明全局参数
ARG version='lts-alpine3.22'

# === 第一阶段：构建并打包 ===
FROM node:${version} AS builder
WORKDIR /app

# 1. 复制所有源码
COPY . .

# 2. 独立执行安装
RUN npm config set registry https://registry.npmmirror.com \
    && npm install -g pnpm@10.26.2 \
    && pnpm config set registry https://registry.npmmirror.com \
    && echo "neverBuiltDependencies: []" > pnpm-workspace.yaml \
    && pnpm install --no-frozen-lockfile \
    && pnpm run build \
    && tar -czv -C dist -f dist.tar.gz .

# === 第二阶段：导出阶段 ===
FROM scratch AS exporter
COPY --from=builder /app/dist.tar.gz /
