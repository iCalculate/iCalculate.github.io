---
title: Origin插件之：韦恩图生成插件（Venn Diagram）
date: 2020-02-23 12:24:07
tags: 
- Origin 
categories: 
- Tutorials 
---

一般在归类样品属性、统计文献关键词信息、变量交叉分析等工作中常需要设计韦恩图来直观表现样品的在多属性之间的交叉分布情况，在一般印象中Origin更擅长绘制带有坐标系的图片，但是得益于Origin强大的可开发和数据处理能力，Venn Diagram插件可以轻松的在Origin中绘制韦恩图。

<!--more-->

# Origin插件之：韦恩图生成插件（Venn Diagram）

原创作者：iCalculate

## 前言：

一般在归类样品属性、统计文献关键词信息、变量交叉分析等工作中常需要设计韦恩图来直观表现样品的在多属性之间的交叉分布情况，在一般印象中Origin更擅长绘制带有坐标系的图片，但是得益于Origin强大的可开发和数据处理能力，Venn Diagram插件可以轻松的在Origin中绘制韦恩图。

## 本期插件介绍：

本期要介绍的插件是OriginLab官方技术支持团队提供的"**Venn Diagram**"插件，用于在Origin中一键生成韦恩图。插件支持的最低Origin版本为Origin2018(9.5) 。

插件官方地址：https://www.originlab.com/fileExchange/details.aspx?fid=425

插件下载备用：链接：https://pan.baidu.com/s/1elGZB2wg74_a1NZjUsoXfg        提取码：cq6d

## 插件安装：

Origin插件下载完成后是后缀为".opx"的文件，只需先打开Origin软件然后将".opx"文件拖曳进Origin面板内即可完成安装，安装过程不会有提示出现，在面板右侧Apps窗口中如果有了相应的插件图标（图标灰色并非不可用）即说明安装成功。

## 具体介绍：

Venn Diagram插件的使用十分简单，可以说是一键生成，这里给出一个简单的例子，首先初始画一个工作表内部新建四列数据命名为Set_1~4。每列中使用随机数函数填充了一些随机整数。

![Fig1](Origin-Plugins-Venn-Diagram\image-20200222223905129.png)

点击Venn Diagram插件在Data栏中选中需要进行韦恩图处理的数据范围，勾选Export Detailed Overlap List，这样可以输出统计信息，设置完成后点击OK即可生成。

![Fig2](Origin-Plugins-Venn-Diagram\image-20200222231946867.png)

生成结果如下，并且在工作表中同时生成了两个新的表单，在Venn Data表单中列出了具体各个韦恩分区下存在的元素：

![Fig3](Origin-Plugins-Venn-Diagram\image-20200222235411827.png)

![Fig5](Origin-Plugins-Venn-Diagram\image-20200222235558482.png)

当然绘制韦恩图还有很多好用的工具这里推荐如下几种方式：

- 使用亿图EDraw，亿图提供了多种模型和输出图形格式，同时也支持嵌套形的韦恩图。https://www.edrawsoft.com/cn/venn-diagram-solutions.php
- 西班牙国家生物技术中心BioinfoGP提供的Venn图在线绘制工具，和本例提供的输出结果很类似。https://bioinfogp.cnb.csic.es/tools/venny/index.html
- 根特大学Bioinformatics & Evolutionary Genomics课题组提供的在线绘制工具。(果然做生物的都是大佬)http://bioinformatics.psb.ugent.be/webtools/Venn/
- 如果你是生信方向的你肯定听说过**TBtools**，很好的本地化统计软件，除了韦恩图还有巨多统计方式。（BTW：TBtools是支持Mac/Linux/Win全平台的）CJ-Chen's Repo链接：https://github.com/CJ-Chen/TBtools
- 当然如果你足有有耐心可以手动统计，然后用PPT画韦恩图。

## 小结：

作者不是生物方向的所以针对专业的生物统计了解较少，接触韦恩图主要是做文献调研过程中进行中进行重点关键词交叉分布统计和对样品信息进行整理是用到，一般五组的韦恩图已经可以应付绝大多数情况。当然大于五组时Venn图结构会很复杂，也不太适合表示交叉分布信息，当然只要你不介意它长这样。。。

![FS-1](Origin-Plugins-Venn-Diagram\image-20200222221655882.png)

