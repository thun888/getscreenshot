# 网页截图 Worker

这是一个使用 Cloudflare Worker 和 thum.io 服务的网页截图服务。

## 功能

- 通过路径参数获取任意网页的截图
- 支持完整的 thum.io 参数配置
- 支持跨域请求
- 自动缓存截图 90 天，提高访问速度
- 使用 Cloudflare 的全球边缘网络

## 部署步骤

1. 安装 Wrangler CLI:
```bash
npm install -g wrangler
```

2. 登录到你的 Cloudflare 账户:
```bash
wrangler login
```

3. 部署 Worker:
```bash
wrangler deploy
```

## 使用方法

部署完成后，可以通过以下方式使用：

```
https://your-worker.your-subdomain.workers.dev/original/width/[宽度]/crop/[高度]/[目标URL]
```

所有请求都必须以 `/original/` 开头。

### 示例

1. 获取 1280x720 的 Google 首页截图：
```
https://your-worker.your-subdomain.workers.dev/original/width/1280/crop/720/https://www.google.com
```

2. 获取全页面截图：
```
https://your-worker.your-subdomain.workers.dev/original/noanim/full/https://www.google.com
```

3. 获取特定宽度的截图：
```
https://your-worker.your-subdomain.workers.dev/original/width/800/https://www.google.com
```

### 支持的参数

您可以在 `/original/` 后使用 thum.io 支持的所有参数，例如：
- `width/[数值]` - 设置截图宽度
- `crop/[数值]` - 设置截图高度
- `noanim` - 禁用动画
- `full` - 获取全页面截图
- 更多参数请参考 thum.io 官方文档

## 缓存机制

- 首次访问时，Worker 会获取新的截图并缓存
- 缓存有效期为 90 天
- 使用 Cloudflare 的全球边缘缓存网络
- 相同 URL 的重复请求将直接从缓存返回，大幅提高响应速度

## 注意事项

- 所有请求必须以 `/original/` 开头
- 请确保提供的 URL 是完整的（包含 http:// 或 https://）
- 某些网站可能会限制截图功能
- 建议在生产环境中添加适当的访问控制
- 缓存会占用 Cloudflare Worker 的存储配额 