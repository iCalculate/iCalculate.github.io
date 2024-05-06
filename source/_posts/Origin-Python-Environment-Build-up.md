---
title: Origin+Python环境搭建
date: 2020-02-25 13:30:35
tags: 
- Origin 
- Python 
categories: 
- Tutorials 
---

在Origin中搭建Python环境，可以调用外部Package，实现Origin自带Python Console全功能以及Code Builder程序文件运行和数据导入。

<!--more-->

# Origin+Python环境搭建

在Origin中开Python Console 查看Python版本，然后在Anaconda中新建同版本环境：

```
conda create -n Origin_Python_Env python=3.5
```

检查新环境时候安装成功：

```
conda env list
activate Origin_Python_Env
python --version
```

然后对给新的Python环境安装包

```
conda install -n your_env_name [package]
```

Anaconda下的新环境安装好之后就可以开始配置Origin中的Python环境了，当然在Origin中使用Python的方法有很多，可以参考[官方教程](https://www.originlab.com/doc/python#Installing_Python_Extensions)，我在这里简单介绍我使用内置Code Builder的配置方法，打开Code Builder后在Project文件夹下新建.py文件，用于设置外部Package环境。

```python
import sys
 
# Replace the value of string variable py_ext_path 
# with the actual Python extension installation path in your computer
 
py_ext_path = "D:\ProgramData\Anaconda3\envs\Origin_Python_Env\Lib\site-packages"
 
if py_ext_path not in sys.path:
    sys.path.append(py_ext_path)
```

保存后在Origin界面的Command Window输入指令运行.py文件

```
run -pyp DynamicTest
```

现在就已经可以应用路径中库中的Package了，如果需要新的Package只需要在环境中用conda或者pip指令添加即可。

在Code Builder中新建一个.py文件以测试环境是否正常，并测试是否可以导入数据到Origin的工作表单。

```python
import numpy as np
import math
import sys
import PyOrigin as O
wp = O.CreatePage(O.PGTYPE_WKS, "MyData", "Origin", 1)  # create a new worksheet
wks = wp.Layers(0)  # select the first worksheet in the workbook
x=np.arange(0,2*np.pi,0.01)
y=np.sin(10*x)*np.exp(0.5*x)
pArr = [x,y]
wks.SetData(pArr, 0,0)   # import the data into the worksheet
```

同样在Command Window运行该程序如果成功将生成带有两列数据的新表单。