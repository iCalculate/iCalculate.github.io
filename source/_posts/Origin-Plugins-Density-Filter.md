---
title: Origin插件之：散点密度热图（Density Filter）
date: 2020-02-25 16:46:42
tags: 
- Origin 
categories: 
- Tutorials 
---

在统计样点在二维空间中的分布情况时常常会使用到**散点密度热图**，我们知道在R语言中有专用的绘图函数smoothScatter()可以实现，在MATLAB中也有可以用plotScat.m的内嵌函数，在Python中可以使用pandas和MatPlotLib中的相应功能，那么在Origin中如何绘制散点密度图呢？

<!--more-->

# Origin插件之：散点密度热图（Density Filter）

原创作者：iCalculate

## 前言：

在统计样点在二维空间中的分布情况时常常会使用到**散点密度热图**，我们知道在R语言中有专用的绘图函数smoothScatter()可以实现，在MATLAB中也有可以用plotScat.m的内嵌函数，在Python中可以使用pandas和MatPlotLib中的相应功能，那么在Origin中如何绘制散点密度图呢？

## 本期插件介绍：

本期要介绍的插件是OriginLab官方技术支持团队提供的"**Density Filter**"插件，这个插件用于通过二维散点图数据绘制密度热图。类似的插件有**Kernel Density Plot**用于极坐标系下的散点数据转密度热图，**Gaussian Mixture Models**可以通过高斯混合模型计算二维热力图，这三个插件功能和操作类似，本期以**Density Filter**为例，插件支持的最低Origin版本为Origin2019(9.6)。

插件官方地址：https://www.originlab.com/fileExchange/details.aspx?fid=464

插件下载备用：链接：https://pan.baidu.com/s/1IYvXdABRu_w8E1bdSiE1pw     提取码：itks

## 插件安装：

Origin插件下载完成后是后缀为".opx"的文件，只需先打开Origin软件然后将".opx"文件拖曳进Origin面板内即可完成安装，安装过程不会有提示出现，在面板右侧Apps窗口中如果有了相应的插件图标（图标灰色并非不可用）即说明安装成功。

## 具体介绍：

首先我们要准备一组散点数据，这里我使用Origin内嵌的Python环境和Code Builder工具生成了一组沿直线分布的随机点，并将Python中的数据加载进Origin的工作表：

![image-20200225161324837](Origin-Plugins-Density-Filter\image-20200225161324837.png)

在Origin的Command Window运行编辑好的成程序即可在工作区生成一个新的名为“MyData”的表单，在第一页载入了散点数据。（PS：如果大家感兴趣可以出一期Origin+Python环境搭建的教程）

![image-20200225161926659](Origin-Plugins-Density-Filter\image-20200225161926659.png)

用上期介绍过的Graph Maker工具可以快速预览散点分布的情况，如下：

![image-20200225162313774](Origin-Plugins-Density-Filter\image-20200225162313774.png)

现在选中两列数据，运行Density Filter插件，其中Input为原始数据，在Rows中可以选择数据范围，Setting可以设置密度计算方式，第二个参数用于设定输出热图的分辨率（参数设置过大会导致初始时间较长），Grid Range用于设置热图的空间范围。

![image-20200225162826380](Origin-Plugins-Density-Filter\image-20200225162826380.png)

设置完成后点击OK即可生成，效果如下，同时生成的一个工作表内部存放了计算得到的二维密度分布数据：

![image-20200225163147655](Origin-Plugins-Density-Filter\image-20200225163147655.png)

可以在设置对话框修改配色，如果需要使用自定义配色可以参考Color Editor插件的教程生成并保存自定义Palette，当然也可以通过Tool->Palette Editor生成和保存新的配色。

![image-20200225163357978](Origin-Plugins-Density-Filter\image-20200225163357978.png)

## 小结：

绘制散点数据的密度热图如要在原生的Origin环境中较难实现，通过Density Filter插件可以方便的生成，但是这个插件也存在算法单一的问题，如果需要调整热图的计算算法可以尝试Gaussian Mixture Models，该插件有着更灵活的应用范围和更丰富的计算方式。

