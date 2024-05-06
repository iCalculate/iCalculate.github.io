---
title: Origin插件之：LSV数据处理插件(Tafel Extrapolation)
date: 2020-02-21 18:46:07 
tags: 
- Origin 
categories: 
- Tutorials 
---

关于使用Origin绘制数据图，研之成理给出了很多实用的教程，但是值得注意的是Origin不仅有着强大的绘图能力同时也有着强大的数据处理能力，OriginLab官方专门针对其开发了专用的Origin C开发环境，为广大科研工作者提供了设计个性化的插件的平台。在这个系列中将会分享一系列Origin官方以及我个人编写的一些实用插件。

<!--more-->

# Origin插件之：LSV数据处理插件(Tafel Extrapolation)

原创作者：iCalculate

## 前言：

关于使用Origin绘制数据图，研之成理给出了很多实用的教程，但是值得注意的是Origin不仅有着强大的绘图能力同时也有着强大的数据处理能力，OriginLab官方专门针对其开发了专用的Origin C开发环境，为广大科研工作者提供了设计个性化的插件的平台。在这个系列中将会分享一系列Origin官方以及我个人编写的一些实用插件。

## 本期插件介绍：

本期要介绍的插件是OriginLab官方技术支持团队提供的"**Tafel Extrapolation**"插件，该免费插件主要可用于估算Tafel Extrapolation，并输出相应的参数值(如阳极/阴极曲线函数、腐蚀电位和电流、阳极/阴极曲线斜率和角度)。插件支持的最低Origin版本为Origin2016(9.3)。

插件官方地址：https://www.originlab.com/fileExchange/details.aspx?fid=219

插件下载备用：链接：https://pan.baidu.com/s/12lpBcLz06RCoBIB0lpkpPg  提取码：h7zf

## 插件安装：

Origin插件下载完成后是后缀为".opx"的文件，只需先打开Origin软件然后将".opx"文件拖曳进Origin面板内即可完成安装，安装过程不会有提示出现，在面板右侧Apps窗口中如果有了相应的插件图标（图标灰色并非不可用）即说明安装成功。

![image-20200221162332507](http://photogz.photo.store.qq.com/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBROrErHZBYnHrYaazR1yPZfeiH4br6XNAihVbcbs5Am9MaWsdk1VlahTtwD5wn5jww!!/b&ek=1&kp=1&pt=0&bo=KwEZASsBGQERADc!&tl=1&tm=1582279200&sce=0-12-12&rf=viewer_311)

## 使用示例：

为了简单展示该插件的使用，这里给出一个简单的应用示例：

### STEP 1：导入电极极化曲线数据

新建Sheet并将极化曲线输入导入，如下图：

![image-20200221154413359](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBX880kJJIjbt*d6BJDPf2aD1ICGC1fF*Yy0melIWUjoqAG214D77eF28bPXcgT*y9w!!/b&ek=1&kp=1&pt=0&bo=cgM.AnIDPgIRADc!&tl=1&vuin=2142004747&tm=1582279200&sce=50-1-1&rf=viewer_311)

并将计划曲线处理为Tafel曲线（如直接使用电化学工作站采集Tafel曲线可以直接忽略此步），具体操作为，新建两列，第一列为Log电流密度值，第二列为电压值，并将新建的两列中第一列设置为X数据，如下图。

![image-20200221171420826](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBYoB3GZuZtwsQuDPaHObTJZb80RY4jeUFwP5N*pjfRov4A30PzazjMUh1O3Kkkjp9w!!/b&ek=1&kp=1&pt=0&bo=cQNBAnEDQQIRADc!&tl=1&vuin=2142004747&tm=1582279200&sce=50-1-1&rf=viewer_311)

### STEP 2：绘制Tafel图

选中C、D两列，并绘制折线图，绘制完成后，在右侧Apps窗口点击Tafel Extrapolation图标会弹出如下对话框：

![image-20200221164136457](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBegbSy9nVvUK4rW8V2DjIIaqHqVegL9xI7lw2svidudM4GYq.R00rakfe0DkZtNvXw!!/b&ek=1&kp=1&pt=0&bo=WQFtAlkBbQIRADc!&tl=1&vuin=2142004747&tm=1582279200&sce=50-1-1&rf=viewer_311)

有两个标签页，第一个标签页"ROI Box"用于设置需要得到的数据，其中"Show on Graph"包括切点信息(Tangent Point Coordinates)，阳极极Tafel斜率角度电流方程(Anodic Tafel Slope, Angle, Function)，阴极极Tafel斜率角度电流方程(Cathodic Tafel Slope, Angle, Function)，腐蚀电压电流(I<sub>corr</sub>, E<sub>corr</sub>)，以及非对数条件下的腐蚀电流(I<sub>corr</sub> in Nonlogarithmic Form)。"Color Setting"中可以设置数据以及切线的颜色。

![image-20200221165343615](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBZRhxgmbAKd9A1MpR8RSSPRvRbdmaegp1vZvIvG.U.Ta3Q.YjQ9Y79K7Bob3lzz*rQ!!/b&ek=1&kp=1&pt=0&bo=egEIAnoBCAIRADc!&tl=1&vuin=2142004747&tm=1582279200&sce=50-1-1&rf=viewer_311)

第二个选项卡中可以设置输出格式，需要在Quantities中的复选框中勾选和ROI中相应的内容，并可选择输出脚本窗口(Script Window)，日志文件(Results Log)，工作表扩展链接(Append to Worksheet)。

### STEP 3：数据显示

点击确定后绘制好的图片中出现如下信息，调节阳极游标（点击拖动图片下方红色滑块），将其和Tafel曲线的的交点的电流设置在合理的区间。这时红线表示的为阳极部分的切线，黑底红字为切线的表达式，下面为斜率值和切线角度等信息。

![image-20200221172039753](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBerHlQATxvUKvXAsvYkhi4.0Lsww9zqciUBkjkwLoM6FgVOqKGVMY7iNMAPnfoE8PQ!!/b&ek=1&kp=1&pt=0&bo=cQNAAnEDQAIRADc!&tl=1&vuin=2142004747&tm=1582279200&sce=50-1-1&rf=viewer_311)

## 小结：

在HER、OER数据处理过程中使用Origin的Tafel Extrapolation插件可以大大提高数据处理的效率，且对极化曲线的处理过程更直观，相比使用Fitting的方法省去了选择拟合区域和设置拟合参数的过程，但是由于本插件测量斜率的方法是使用切线法，所以和使用拟合得到的结果存在一定偏差，但如果极化曲线动力学控制部分斜率稳定那么输出结果在误差范围内。