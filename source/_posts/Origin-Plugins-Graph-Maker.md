---
title: Origin插件之：快速作图（Graph Maker）
date: 2020-02-24 14:30:50
tags: 
- Origin 
categories: 
- Tutorials 
---

Origin的绘图已经算是十分的方便，选中数据即可一键绘图，但是如果想切换绘图模式时就显得不太方便，同样在同一副图中调节每个数据点的颜色、大小、形状等也都显得操作繁琐，今天介绍的插件Graph Maker就针对这些问题实现了一键修改快速绘图。

<!--more-->

# Origin插件之：快速作图（Graph Maker）

原创作者：iCalculate

## 前言：

Origin的绘图已经算是十分的方便，选中数据即可一键绘图，但是如果想切换绘图模式时就显得不太方便，同样在同一副图中调节每个数据点的颜色、大小、形状等也都显得操作繁琐，今天介绍的插件Graph Maker就针对这些问题实现了一键修改快速绘图。

## 本期插件介绍：

本期要介绍的插件是OriginLab官方技术支持团队提供的"**Graph Maker**"插件，这个插件可以通过直接拖曳数据绘制目标图片。插件支持的最低Origin版本为Origin2019(9.6)。

插件官方地址：https://www.originlab.com/fileExchange/details.aspx?fid=445

插件下载备用：链接：https://pan.baidu.com/s/1VkMxz7Lu_5Y9iGDF87oxWQ  提取码：1pym 

## 插件安装：

Origin插件下载完成后是后缀为".opx"的文件，只需先打开Origin软件然后将".opx"文件拖曳进Origin面板内即可完成安装，安装过程不会有提示出现，在面板右侧Apps窗口中如果有了相应的插件图标（图标灰色并非不可用）即说明安装成功。

## 具体介绍：

首先我们初始化一个工作表单，A(X)类用行数填充作为X轴数据，B(Y)列用随机数创建X数据误差，C列数据用随机数填充作为Y轴数据，D列作为Y数据误差，E、F列分别用行数填充作为数据点的颜色大小数据。G列作为分区标识，前半部分用1填充后半部分用2填充，如下：

![image-20200224140721991](Origin-Plugins-Graph-Maker\image-20200224140721991.png)

打开Graph Maker插件，选择点线图，拖曳X、Y数据到相应位置即可实时得到图片输出：

![G1](Origin-Plugins-Graph-Maker\G1.gif)

绘图模式可以在多模式间切换：

![G2](Origin-Plugins-Graph-Maker\G2.gif)

拖曳误差数据可以显示误差线，拖曳颜色和大小列数据即可试试调整样点颜色和大小：

![G3](Origin-Plugins-Graph-Maker\G3.gif)

拖曳分区数据即可得到分区绘制的数据图：

![G4](Origin-Plugins-Graph-Maker\G4.gif)

同理也可以调节样点形状和内部结构，在插件内参数设置完成后即可点击确定生成图片。

## 小结：

使用Graph Maker插件可以快速绘制简易图片并且方便的切换不同绘制模式，在绘制样点信息复杂（如在二维电线图中可以使样点颜色代表第三维度数据、样点大小代表第四维度数据等）的数据图是有着独特的优势，可以在一定程度上提高绘图效率。