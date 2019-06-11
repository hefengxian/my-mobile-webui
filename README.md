# KMW Mobile Web Client

KWM 移动网页版，弥补 APP 可能在平台受限的问题

采用 [PWA](https://developers.google.com/web/progressive-web-apps/) 实现，需要注意的是：

1. PWA 在 IOS 支持受限，但是 Apple 提供了自己的解决方案
2. Android 平台较系统版本较低的平台支持也是受限的，并且国产手机内置的浏览器支持非常不好；需要下载最新的 Chrome 浏览器
3. Android 要想完整的安装 PWA 为一个 APK 并且可以在应用列表显示需要翻墙（猜测可能是某些资源需要到 Google 下载）
4. 没有翻墙的时候也可以用过 Chrome 添加，但是可能只是一个快捷方式，但是总体体验还是可以


- PWA Android 安装要满足三个条件，可以通过 Chrome Dev Tools Audit 功能来检查（查看 Installable 节）
    - Uses HTTPS
    - Registers a service worker that controls page and start_url
    - Web app manifest meets the installability requirements
- Android PWA 虽然可以使用推送等功能，但是推送需要经过 Google 的服务器，也是要翻墙才能使用
- IOS 不支持 PWA，但是支持添加到主屏；体验也还可以（无法使用高级的推送功能）


## 功能规划

**V1 规划** （基本对标现有 APP 已经实现功能）

- [ ] 登录
- [ ] 分类信息浏览；查看、筛选、操作分类信息
- [ ] 搜索（Solr）；全库快速搜索
- [ ] 分析/报告；查看操作结果，分析报告
- [ ] 个人/设置；个人设置、账号管理、系统设置等
- [ ] 文章详情页面；操作信息
- [ ] 可以通过手机的添加到桌面可以类似原生 APP（要研究）


## 界面设计



## 代码规范

- AuthLoading 加载页面
    + Login 登录页面
    + Main 主页面（框架），包含标题栏，操作按钮，底部主菜单（5个）
        - 最新信息
        - 信息列表
        - 搜索
        - 报告/分析（各项统计）
        - 个人设置
    + 详情页
    + 其他设置页面



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



