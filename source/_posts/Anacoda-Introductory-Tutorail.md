---
title: Anaconda详细安装及使用教程
date: 2020-02-26 10:43:18
tags: 
- Anaconda
- Python 
categories: 
- Tutorials 
---



Anaconda指的是一个开源的Python发行版本，其包含了conda、Python等180多个科学包及其依赖项。 因为包含了大量的科学包，Anaconda 的下载文件比较大（约 531 MB），如果只需要某些包，或者需要节省带宽或存储空间，也可以使用Miniconda这个较小的发行版（仅包含conda和 Python）。原文链接：https://blog.csdn.net/ITLearnHall/article/details/81708148

<!--more-->

## Anacond的介绍

Anaconda指的是一个开源的Python发行版本，其包含了conda、Python等180多个科学包及其依赖项。 因为包含了大量的科学包，Anaconda 的下载文件比较大（约 531 MB），如果只需要某些包，或者需要节省带宽或存储空间，也可以使用Miniconda这个较小的发行版（仅包含conda和 Python）。

Conda是一个开源的包、环境管理器，可以用于在同一个机器上安装不同版本的软件包及其依赖，并能够在不同的环境之间切换

Anaconda包括Conda、Python以及一大堆安装好的工具包，比如：numpy、pandas等

Miniconda包括Conda、Python

## Anacond下载

下载地址：https://www.anaconda.com/download/


 ![img](Anacoda-Introductory-Tutorail\1142366-20180816103535078-1330674384.png)



![img](Anacoda-Introductory-Tutorail\1142366-20180816103625443-1546789868.png)

Anaconda 是跨平台的，有 Windows、macOS、Linux 版本，我们这里以 Windows 版本为例，点击那个 Windows 图标。

我这里选择下载 

Python 2.7 version *--Python 2.7 版 *

64-Bit Graphical Installer (564 MB) --64位图形安装程序（564 MB）

当然，你也可以根据自己的实际情况，选择 Python 3.6版的，或者 32-Bit 版本的。

安装包有 564MB，因为网速的关系，下载时间可能会比较长，请耐心等待。我这里下载完成 Anaconda2-5.2.0-Windows-x86_64.exe文件了。

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816103647936-691282982.png)

## **安装 Anaconda** 

双击下载好的 Anaconda2-5.2.0-Windows-x86_64.exe文件，出现如下界面，点击 Next 即可。

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816104034920-1869414341.png)

点击Next

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816104046163-1243439856.png)

点击 I Agree （我同意），不同意，当然就没办法继续安装啦。

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816104106659-255110697.png)

Install for: Just me还是All Users，假如你的电脑有好几个 Users ，才需要考虑这个问题.其实我们电脑一般就一个 User，就我们一个人使用，如果你的电脑有多个用户，选择All Users，我这里直接 All User，继续点击 Next 。

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816104133449-1461977216.png)

Destination Folder 是“目标文件夹”的意思，可以选择安装到什么地方。默认是安装到 C:\ProgramData\Anaconda2文件夹下。你也可以选择 Browse... ，选择想要安装的文件夹。我这里 C 盘空间充裕，所以我直接就装到默认的地方。

这里提一下，Anaconda 很强大，占用空间也不小啊，2.6GB，差不多是一部高清电影的体积了。不过，为了学习，这点硬盘空间算什么呢。

继续点击 Next> 。

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816104200442-589753278.png)

这里来到 Advanced Options 了，所谓的“高级选项”。如果你英文好，有一定背景知识的话，肯定明白这界面上的意思。两个默认就好，第一个是加入环境变量，第二个是默认使用 Python 2.7，点击“Install”，终于开始安装额。

安装时间根据你的电脑配置而异，电脑配置高，硬盘是固态硬盘，速度就更快。安装过程其实就是把 Anaconda2-5.2.0-Windows-x86_64.exe文件里压缩的各种 dll 啊，py 文件啊，全部写到安装目标文件夹里。

![img](Anacoda-Introductory-Tutorail\1142366-20180816104233618-507512210.png) 

过程还是很漫长的，毕竟 2.6GB 的无数个小文件啊，请耐心等待。

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816104250926-1454705418.png)

经过漫长的等待，终于安装完成 Installation Complete （安装完成）了，点击最后一个 Next>。

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816104336542-1540025296.png)

点击Install Microsoft VSCode

![img](Anacoda-Introductory-Tutorail\1142366-20180816104436384-791485566.png)

点击 Finish，那两个 √ 可以取消。

## 配置环境变量

如果是windows的话需要去 控制面板\系统和安全\系统\高级系统设置\环境变量\用户变量\PATH 中添加 anaconda的安装目录的Scripts文件夹, 比如我的路径是C:\ProgramData\Anaconda2\Scripts, 看个人安装路径不同需要自己调整.

之后就可以打开命令行(最好用管理员模式打开) 输入

```
conda --version
```

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816104457252-1462108915.png)

如果输出conda 4.5.4之类的就说明环境变量设置成功了.

为了避免可能发生的错误, 我们在命令行输入conda upgrade --all 先把所有工具包进行升级

## 管理虚拟环境

接下来我们就可以用anaconda来创建我们一个个独立的python环境了.接下来的例子都是在命令行操作的,请打开你的命令行吧.

### activate

activate 能将我们引入anaconda设定的虚拟环境中, 如果你后面什么参数都不加那么会进入anaconda自带的base环境,

你可以输入python试试, 这样会进入base环境的python解释器, 如果你把原来环境中的python环境去除掉会更能体会到, 这个时候在命令行中使用的已经不是你原来的python而是base环境下的python.而命令行前面也会多一个(base) 说明当前我们处于的是base环境下。

![img](Anacoda-Introductory-Tutorail\1142366-20180816104523744-509861422.png)

创建自己的虚拟环境

我们当然不满足一个base环境, 我们应该为自己的程序安装单独的虚拟环境.

创建一个名称为python34的虚拟环境并指定python版本为3.4(这里conda会自动找3.4中最新的版本下载)

```
conda  create -n python34  python=3.4
```

或者

```
conda  create  --name  python34   python=3.4
```

![img](Anacoda-Introductory-Tutorail\1142366-20180816104550085-1627525656.png)

于是我们就有了一个learn的虚拟环境, 接下来我们切换到这个环境, 一样还是用activae命令 后面加上要切换的环境名称

## **切换环境**

```
activate learn
```

如果忘记了名称我们可以先用

```
conda env list
```

 ![img](Anacoda-Introductory-Tutorail\1142366-20180816104608847-1846257566.png)

去查看所有的环境

现在的learn环境除了python自带的一些官方包之外是没有其他包的, 一个比较干净的环境我们可以试试

先输入python打开python解释器然后输入

```python
import requests
```

会报错找不到requests包, 很正常.接下来我们就要演示如何去安装requests包

```python
exit()
```

退出python解释器

## 安装第三方包

输入

```
conda install requests
```

或者

```
pip install requests
```

来安装requests包.

安装完成之后我们再输入python进入解释器并import requests包, 这次一定就是成功的了.

## 卸载第三方包

那么怎么卸载一个包呢

```
conda remove requests
```

或者

```
pip uninstall requests
```

就行啦.

## 查看环境包信息

要查看当前环境中所有安装了的包可以用

```
conda list
```



## 导入导出环境

如果想要导出当前环境的包信息可以用

```
conda env export > environment.yaml
```

将包信息存入yaml文件中.

当需要重新创建一个相同的虚拟环境时可以用

```
conda env create -f environment.yaml
```

其实命令很简单对不对, 我把一些常用的在下面给出来, 相信自己多打两次就能记住

```
activate // 切换到base环境

activate learn // 切换到learn环境

conda create -n learn python=3 // 创建一个名为learn的环境并指定python版本为3(的最新版本)

conda env list // 列出conda管理的所有环境

conda list // 列出当前环境的所有包

conda install requests 安装requests包

conda remove requests 卸载requets包

conda remove -n learn --all // 删除learn环境及下属所有包

conda update requests 更新requests包

conda env export > environment.yaml // 导出当前环境的包信息

conda env create -f environment.yaml // 用配置文件创建新的虚拟环境
```


