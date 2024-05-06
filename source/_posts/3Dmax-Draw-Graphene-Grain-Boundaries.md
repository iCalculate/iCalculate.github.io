---
title: 使用3Dmax绘制石墨烯晶格缺陷
date: 2020-02-27 15:20:12
tags: 
- 3Dmax 
categories: 
- Tutorials  
---

使用3Dmax的晶格功能绘制石墨烯以及石墨烯的简单缺陷十分容易，但是绘制石墨烯的晶界不太方便，这里我给出一个需要手动调整绘制石墨烯晶界的方法，该方法存在很大的改进空间，欢迎大家指正！B站视频：https://www.bilibili.com/video/av92997647

<!--more-->

# 使用3Dmax绘制石墨烯晶格缺陷

首先我们先绘制出单片石墨烯结构，这里我使用的是**多边形细分切角**的方法：

![image-20200227153033964](3Dmax-Draw-Graphene-Grain-Boundaries\image-20200227153033964.png)

然后复制出一片新的，并旋转30度，并剪切边缘成下图：

![image-20200227153415607](3Dmax-Draw-Graphene-Grain-Boundaries\image-20200227153415607.png)

然后使用五边形和七边形填补裂隙：

![image-20200227153925826](3Dmax-Draw-Graphene-Grain-Boundaries\image-20200227153925826.png)

然后附加所有多边形，在点层级焊接所有点，阈值可以给大一点。

![image-20200227154110691](3Dmax-Draw-Graphene-Grain-Boundaries\image-20200227154110691.png)

最后就是添加晶格修改器，加灯光，加一点简单的效果：

![image-20200227154212107](3Dmax-Draw-Graphene-Grain-Boundaries\image-20200227154212107.png)

渲染！

![image-20200227154257023](3Dmax-Draw-Graphene-Grain-Boundaries\image-20200227154257023.png)