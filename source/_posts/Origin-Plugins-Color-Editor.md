---
title: Origin插件之：配色编辑器(Color Editor)
date: 2020-02-22 11:42:57 
tags: 
- Origin 
categories: 
- Tutorials 
---

在Origin画图时你是否有被自带配色丑哭过？虽然在新版版的Origin官方已经给出了一些颜值尚可的配色方案（如：Candy、Maple），但是我们如何自定义一组个性化的配色方案呢？这期我们将介绍一款Origin插件实现自定义配色列表的创建、编辑和修改。

<!--more-->

# Origin插件之：配色编辑器(Color Editor)

原创作者：iCalculate

## 前言：

在Origin画图时你是否有被自带配色丑哭过？虽然在新版版的Origin官方已经给出了一些颜值尚可的配色方案（如：Candy、Maple），但是我们如何自定义一组个性化的配色方案呢？这期我们将介绍一款Origin插件实现自定义配色列表的创建、编辑和修改。

## 本期插件介绍：

本期要介绍的插件是OriginLab官方技术支持团队提供的"**ColorEditor**"插件，该免费插件主要用于创建、阅读或编写调色板和颜色列表。插件支持的最低Origin版本为Origin2017(9.4) SR1。

插件官方地址：https://www.originlab.com/fileExchange/details.aspx?fid=317

插件下载备用：链接：https://pan.baidu.com/s/1O8ttZb4rg1emTJUiTKuopg       提取码：h40x

## 插件安装：

Origin插件下载完成后是后缀为".opx"的文件，只需先打开Origin软件然后将".opx"文件拖曳进Origin面板内即可完成安装，安装过程不会有提示出现，在面板右侧Apps窗口中如果有了相应的插件图标（图标灰色并非不可用）即说明安装成功。

## 具体介绍：

### 基础介绍：

在Origin绘制成组的曲线时可以通过Color List批量设置曲线配色，当然双击进入配色编辑面板调整颜色使用顺序以及具体的色彩值，但是由于官方给出的配色方案比较单一，在想使用并使软件记住我们个性化的配方方案时操作比较复杂。

![Figure-1](http://photogz.photo.store.qq.com/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBS6nbGIfgCbWcwA4EX2J5m643XJFizGU51Ml7MyT89.gsOB4jMeTVjRH3IR4AzFcbA!!/b&ek=1&kp=1&pt=0&bo=cgG1AXIBtQERADc!&tl=1&tm=1582340400&sce=0-12-12&rf=viewer_311)

### PART 1： 插件基本结构

打开Color Editor插件会出现包含当前系统默认配色的编辑界面，如下：

![Figure-2](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBf0aEttywW4gY3ONTeE5.VKGcyqniGEvSUhuamB7Sw0jg8GDnucGfFjbuGfPQcoaQQ!!/b&ek=1&kp=1&pt=0&bo=6ALyAegC8gERADc!&tl=1&vuin=2142004747&tm=1582340400&sce=50-1-1&rf=viewer_311)

主题是一个工作表，其中每行是一种颜色的信息，其中包括RGB值、亮度比(Rel. Luminance)、色度(Hue)、饱和度(Saturation)、明度(Lightness)。上方是一些操作按键，接下来逐一介绍：

Load Palette：加载调色盘数据（PAL文件），默认路径是Origin内置调色盘数据文件夹。

Load Color List：加载色彩列表数据（OTH文件），Theme->Color默认路径中自带色彩列表数据。

Load GMIP Palette：加载GMIP调色盘数据（GPL文件）。

Interpolate：差值，可以实现线性(Linear)、样条线(Spline)、B-曲线(B-Spline)、Akima-曲线(Akima-Spline)差值等差值方式。

Reverse：反转色彩序列顺序。

Clear Data：清空数据表内容。

Save Palette：保存调色盘数据（PAL文件）。

Save Color List：保存色彩列表数据（OTH文件）。

Instruction：是一个官方的介绍文档，可以在其中了解该插件具体的信息。

### PART 2： 简单介绍PAL文件和GIMP

PAL文件(Palette List)是存储色彩序列的文件，使用记事本打开以发现文件格式符合如下规律：第一行默认为“JASC-PAL”，第二行默认为“0100”，第三行是颜色数目“”，第四行及以后为每个颜色的RGB值，如下：

![Figure-3](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBdtnu*X0Hxo*wQTDs6TwZ9kTRj8NZxwr5MGi*pSEStxG6dWgxHBi1P3lwVvkSZ1AtQ!!/b&ek=1&kp=1&pt=0&bo=SAE.AUgBPgERADc!&tl=1&vuin=2142004747&tm=1582340400&sce=50-1-1&rf=viewer_311)

GIMP （GNU Image Manipulation Program，GNU图像处理程序），它是一个图像处理与合成工具。GIMP的扩展性很强，用户可以通过自己编写的插件来扩充GIMP功能。[下载地址](https://www.gimp.org/)

### PART 3： 自定义配色生成及导入

了解了基础信息我们现在就尝试从一张图片中截取颜色并导入到我们的配色库中：

#### STEP 1: 使用Adobe Color采集颜色信息

这里随意找了一篇文章中的数据图，采集其中柱状图的配色信息

![Figure-4](http://photogz.photo.store.qq.com/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBQn5IpjOBSfneSJkjXhcipcW5a3Ol5K93r8wVJ9R5hU*ELksvJQnVFa6bb9SCDFaqg!!/b&ek=1&kp=1&pt=0&bo=BgQ1AgYENQIRADc!&tl=1&tm=1582344000&sce=0-12-12&rf=viewer_311)

#### STEP 2: 将色彩信息写入PAL文件

这里作者自己写了一个Python脚本实现的色彩信息采集，当然也可以使用屏幕色彩捕获软件直接读取后写入Origin Color Editor的表格中，如使用后者可直接跳过此步。

屏幕颜色捕获软件Pconline：链接：https://pan.baidu.com/s/1UqdmOxPbq9lETZMKlxgCjg     提取码：ez7k

或者可以尝试使用这个Python程序：https://github.com/iCalculate/PAL_Generator  (欢迎Fork、Issue)

```python
import pyautogui
import os
import sys
from ctypes import *
import numpy as np

def get_color(x, y):
	gdi32 = windll.gdi32
	user32 = windll.user32
	hdc = user32.GetDC(None)  # 获取颜色值
	pixel = gdi32.GetPixel(hdc, x, y)  # 提取RGB值
	r = pixel & 0x0000ff
	g = (pixel & 0x00ff00) >> 8
	b = pixel >> 16
	return [[r, g, b]]

Position = [[0,0]]
matrix = [Position] * 1
try:
	while True:
		##print(x,y)
		Key = input("Enter your input: ")
		if (Key == "\\"):
			x, y = pyautogui.position()
			New_Postion = [[x,y]]
			Position.extend(New_Postion)
		elif (Key == "/"):
			ColorList = get_color(Position[0][0],Position[0][1])
			for i in range(len(Position)-1) :
				New_ColorList = get_color(Position[i+1][0],Position[i+1][1])
				ColorList.extend(New_ColorList)
			break
except KeyboardInterrupt:
	print('\nExit.')

print("Color = " + str(ColorList) )

filename = 'write_data.txt'
with open(filename,'w') as f:
	f.write("JASC-PAL\n")
	f.write("0100\n")
	f.write(str(len(Position)) + "\n")
	for j in range(len(Position)) :
		f.write(str(ColorList[j][0])+" "+ \
				str(ColorList[j][1])+" "+ \
				str(ColorList[j][2])+"\n")

os.rename('./write_data.txt','./GetColor.pal')
	
```

生成PAL文件后点击Load Palette导入即可。

#### STEP 3: 配色信息调整和保存

导入色彩信息后如下图：

![Figure-5](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBdEDgxImMyiWzOJASpPfDKfC7przLXcrShW1BJ.xRgq2Yr8VbqTR6KyniEQGazjbNg!!/b&ek=1&kp=1&pt=0&bo=5gLvAeYC7wERADc!&tl=1&vuin=2142004747&tm=1582340400&sce=50-1-1&rf=viewer_311)

简单尝试线性插值增加色彩数量：

![Figure-6](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBU3GwBrKdgceB4yaTQuWoLRhzDycqWkdMGSs8xwUSn0YvS7K2PW2qhK2j0E9TAFrmA!!/b&ek=1&kp=1&pt=0&bo=5QLxAeUC8QERADc!&tl=1&vuin=2142004747&tm=1582340400&sce=50-1-1&rf=viewer_311)

保存为Origin配色文件OTH并尝试应用：

点击Save Color List输入文件名，点击确定后会有脚本窗口跳出提示文件保存路径，之后再绘制系列曲线时在设置颜色下拉栏中就有保存好的色彩序列啦~

![Figure-6](http://a1.qpic.cn/psc?/V10NjlLt3vJzWw/jATfUCBWQtBBaj8LJRaWBX1zZP6N0Io0UeowvAUCpIgvgfE8iIzHMcoNnhd5EBET92c3M7R*2uo2s.aXRIh0Dw!!/b&ek=1&kp=1&pt=0&bo=cAHCAXABwgERADc!&tl=1&vuin=2142004747&tm=1582340400&sce=50-1-1&rf=viewer_311)

### 附送配色网站：

Adobe Color: https://color.adobe.com/zh/create/color-wheel    (强烈推荐，可以从图片中提取颜色)

Colrd: http://colrd.com/     (配色分享论坛)

Flat UI Colors: https://flatuicolors.com/      (多色系列配色网站)

ColorSupply: https://colorsupplyyy.com/app     (色轮取色，示例图标生成)

## 小结：

不得不说Color Editor这款插件极大的提升了我的绘图效率，在文献阅读时看到好的配色图片也不在望尘莫及，只需要从中采出PAL文件导入本地配色库中就可以永久使用，妈妈再也不用担心我的曲线配色啦~