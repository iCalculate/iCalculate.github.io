---
title: Hello World
date: 2020-11-15 22:17:49
---
Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

## Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)

### Add Google Analytics

Sign up for Google Analytics and generate code, like this:

```javascript
<!-- hexo-inject:begin --><!-- hexo-inject:end --><!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-xxxxxxxxx"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-xxxxxxxxx');
</script>
```

Add it to the _config.yml and .ejs file at \layout\_partial 

### Add Baidu and Google search list

```mermaid
gantt         
       dateFormat  YYYY-MM-DD   
       title 使用mermaid语言定制甘特图

       section 任务1
       已完成的任务           :done,    des1, 2014-01-06,2014-01-08
       正在进行的任务               :active,  des2, 2014-01-09, 3d
       待完成任务1               :         des3, after des2, 5d
       待完成任务2              :         des4, after des3, 5d

       section 关键任务
       已完成的关键任务 :crit, done, 2014-01-06,24h
       已完成的关键任务2         :crit, done, after des1, 2d
       正在进行的关键任务             :crit, active, 3d
       待完成的关键任务        :crit, 5d
       待完成任务           :2d
       待完成任务2                      :1d
```