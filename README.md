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

- [x] 登录
    - [x] 页面设计
    - [x] 登录功能
        - [x] 错误提示
        - [x] 按钮加载动画
    - [x] 如果已经登录，用户通过输入登录地址来访问登录页面自动跳转到首页
         
- [x] 分类信息浏览；查看、筛选、操作分类信息
    - [x] 文章列表样式设计
        - [x] 标题
        - [x] 摘要
        - [x] 标签
        - [x] 分类信息，文章基础信息
        - [x] 操作菜单
        - [x] 已读样式
        - [x] 已选样式
        - [x] 情感属性样式
    - [x] 筛选器设计
        - [x] 主题、媒体类型
        - [x] 时间、情感属性等等筛选
    - [x] 分页
    - [x] 总体数量
    - [x] 操作实现
    - [x] Tag 实现
    
    

- [x] 搜索（Solr）；全库快速搜索
- [ ] 分析/报告；查看操作结果，分析报告
    - [ ] 要选用图表，AntV F2 还是 ECharts 4
- [x] 个人/设置；个人设置、账号管理、系统设置等
- [x] 文章详情页面；操作信息
- [x] 可以通过手机的添加到桌面可以类似原生 APP（要研究）
- [x] PWA 更新问题 


2019-06-25 记录

- Refresh Token 刷新 Access Token 的问题
- 页面在切换的时候，布局有抖动，需要处理
- 在 SW 提示更新之后跳转到更新历史去（新的页面 or 模块）


## 界面设计



## 代码规范

1. 尽量严格遵守 Vue 官方的[风格指南 - Vue.js](https://cn.vuejs.org/v2/style-guide/)
2. Vant 也有一个简化版的[风格指南](https://youzan.github.io/vant/#/zh-CN/style-guide)




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

## 未解决问题

- IOS 每次打开都会重新加载，在 iPhone 6 Plus 上偶尔会出现 LocalStorage 失效的问题
- Android 下输入框问题，如果在 HTTP 协议下，会弹出地址栏和警示进行安全警告！
- 更新问题，每次有更新之后并没有及时装载最新的内容，而是在使用缓存的旧的内容


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



