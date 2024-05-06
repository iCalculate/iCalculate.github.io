---
title: Origin插件之：堆叠图小工具（Layer Stack Manager）
date: 2020-02-23 12:23:47
tags: 
- Origin 
categories: 
- Tutorials 
---

在使用Origin绘制堆叠图（Stack Plot）时你是否有过这样的经历，经历千辛万苦终于把整幅图的边框尺寸、标尺格式、标题格式设置好，这时却发现在中间少加了一副图，如果重新画图有着巨大的工作量（当然可以选择保存当前格式为Template），如果想添加一个图层却需要重新调整新图层的各个参数，这期介绍的堆叠图小插件就为这种情况提供了最优的解决方案。

<!--more-->

# Origin插件之：堆叠图小工具（Layer Stack Manager）

原创作者：iCalculate

## 前言：

在使用Origin绘制堆叠图（Stack Plot）时你是否有过这样的经历，经历千辛万苦终于把整幅图的边框尺寸、标尺格式、标题格式设置好，这时却发现在中间少加了一副图，如果重新画图有着巨大的工作量（当然可以选择保存当前格式为Template），如果想添加一个图层却需要重新调整新图层的各个参数，这期介绍的堆叠图小插件就为这种情况提供了最优的解决方案。

## 本期插件介绍：

本期要介绍的插件是OriginLab官方技术支持团队提供的"**Layer Stack Manager**"插件，在活动层之前或之后插入一个层，或删除堆叠图中的活动层或选定层。插件支持的最低Origin版本为Origin2016(9.3) 。

插件官方地址：https://www.originlab.com/fileExchange/details.aspx?fid=263

插件下载备用：链接：https://pan.baidu.com/s/1A0H14A2HX1fahOwalJm4Pg   提取码：nw5t 

## 插件安装：

Origin插件下载完成后是后缀为".opx"的文件，只需先打开Origin软件然后将".opx"文件拖曳进Origin面板内即可完成安装，安装过程不会有提示出现，在面板右侧Apps窗口中如果有了相应的插件图标（图标灰色并非不可用）即说明安装成功。

## 具体介绍：

我们先使用填充功能在X列按行号填充，B-E列使用归一化随机数填充，F列使用带符号随机数填充。

![Fig1](Origin-Plugins-Layer-Stack-Manager\image-20200222210623098.png)

我们使用A(X)-B(Y)~E(Y)为数据源绘制Stack Plot：

![Fig2](Origin-Plugins-Layer-Stack-Manager\image-20200222210854834.png)

得到默认的格式如下右图，经过简单调整（边框宽度、标尺范围等）得到右图：

![Fig3](Origin-Plugins-Layer-Stack-Manager\image-20200222211225750.png)

这时如果们需要在其中2、3子图之间插入F(Y)数据的图即可使用Layer Stack Manager插件，我们只需要运行插件，并选中第二子图，然后使用插件中的Insert a layer before the active layer in a stack graph按键（左图）即可得到一个和其余子图格式相同的新图层（右图）：

![Fig4](Origin-Plugins-Layer-Stack-Manager\image-20200222211502864.png)

之后我们只需要在Layer Contents对话框中将F(Y)列的数据加入Layer 5即可：

![Fig5](Origin-Plugins-Layer-Stack-Manager\image-20200222212243399.png)

该插件的另外两个按键的作用一个是在所选图层后插入一个新的图层，另一个是删除选中图层。使用这两个功能时也不会影响原有格式。

## 小结：

这个插件是我在一次绘制XPS堆叠比较图时发现的，当时正遇到如开头所说的窘境，完全是因为懒的重新画和修改才让我在茫茫插件中发现了它，从此妈妈再也不用担心我画堆叠谱图啦~