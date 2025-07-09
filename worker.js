addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 允许跨域请求
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': '*'
  }

  // 处理 OPTIONS 请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    // 获取 URL 参数
    const url = new URL(request.url)
    const pathname = url.pathname

    // 处理 DELETE 请求，用于清除缓存
    if (request.method === 'DELETE') {
      const cache = caches.default
      await cache.delete(url)
      return new Response('缓存已清除', {
        headers: corsHeaders
      })
    }

    if (pathname.startsWith('/original/')) {
    // 移除基础路径和开头的斜杠
    const targetPath = pathname.replace('/original/', '')

    if (!targetPath) {
      return new Response('请提供完整的截图参数和目标 URL', {
        status: 400,
        headers: corsHeaders
      })
    }

    // 检查缓存
    const cache = caches.default
    let response = await cache.match(url)

    if (!response) {
      // 如果缓存中没有，则获取新的截图
      const thumbUrl = `https://image.thum.io/get/maxAge/8/noanimate/${targetPath}`
      response = await fetch(thumbUrl)

      // 创建新的响应对象，添加缓存控制头
      const headers = new Headers(response.headers)
      Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value))
      headers.set('Content-Type', response.headers.get('Content-Type') || 'image/png')
      headers.set('Cache-Control', 'public, max-age=7776000') // 90天 = 7776000秒

      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      })

      // 存入缓存
      await cache.put(url, response.clone())
    }
    return response
    } else if(pathname.startsWith('/simple/')){
            // 移除基础路径和开头的斜杠
            const path = pathname.replace('/simple/', '')

            if (!path) {
              return new Response('请提供完整的截图参数和目标 URL', {
                status: 400,
                headers: corsHeaders
              })
            }
        
            // 检查缓存
            const cache = caches.default
            let response = await cache.match(url)
        
            if (!response) {
              // 如果缓存中没有，则获取新的截图
              const thumbUrl = `https://image.thum.io/get/maxAge/8/noanimate/width/1280/crop/720/${path}`
              response = await fetch(thumbUrl)
        
              // 创建新的响应对象，添加缓存控制头
              const headers = new Headers(response.headers)
              Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value))
              headers.set('Content-Type', response.headers.get('Content-Type') || 'image/png')
              headers.set('Cache-Control', 'public, max-age=7776000') // 90天 = 7776000秒
        
              response = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: headers
              })
        
              // 存入缓存
              await cache.put(url, response.clone())
            }
            return response

    } else {
      return new Response('参数错误', {
        status: 400,
        headers: corsHeaders
      })
    }


  } catch (error) {
    return new Response(`发生错误: ${error.message}`, {
      status: 500,
      headers: corsHeaders
    })
  }
} 