---
title: HER auto test script
date: 2023-03-13 12:12:36
tags: 
- Electrochemical
categories:
- Scientific
---

# HER自动测试和数据处理脚本

在HER性能测试中在对批量样品进行测试时我们常常面临测试流程不统一、测试流程复杂需要在测试现场等待等问题，这里我们针对性的设计了HER自动测试和数据处理脚本，在辰华工作站（CHI660E）上实现了脚本控制的自动测试： 先进行CV活化，再进行LSV测试，再进行EIS阻抗测试，再进行基于CV的ECSA系列测试，最后进行IT稳定性测试。整个测试过程无需实验人员值守，测试完成后会自动存储数据。同时我们也设计了针对自动测试后得到的数据的可视化处理脚本，方便实验人员可以在第一时间掌握样品性能信息。

## 应用实例

1. 首先我们的脚本时基于Python编程的，需要下载并安装Python环境，然后再脚本文件夹中找到PackageInstall.bat文件双击运行来安装该脚本运行所需要的库文件，等待自动安装完成即可。

   ![image-20210907100134612](C:\Users\iCalculate\AppData\Roaming\Typora\typora-user-images\image-20210907100134612.png)

```cmd
pip install numpy
pip install shapely
pip install pandas
pip install matplotlib
```

2. 然后再文件中找到Macro_Gen_HER.py文件双击运行，即可在根目录下生成两个文件output.txt和output.mcr。之后打开工作站软件，在Control下找到Macro Command并打开，点击Read读取新生成的mcr文件，如下：
   ![image-20210907095650270](C:\Users\iCalculate\AppData\Roaming\Typora\typora-user-images\image-20210907095650270.png)

3. 接下来点击Run Macro即可运行脚本，程序即可自动执行脚本中设置好的测试流程，这里展示核心部分脚本，通过修改其中测试参数即可调整生成运行脚本内容以控制自动测试中的参数：

   ```python
   chi.init_cv_tech(ei=0, eh=-0.6, el=-0, v=0.05)
   chi.run_cv(file, 'CV-001', add_note=True)
   
   for loop in range(1, 11):
   	chi.init_lsv_tech(ei=High, ef=Low, v=0.002, si=0.001, qt=2.0, sens=1e-3)
   	chi.run_lsv(file, 'LSV-' + str(loop), add_note=True)
   
   chi.init_imp_tech(ei=-0.25, fl=0.1, fh=1e5, amp=0.005, qt=2.0, sens=1e-3)
   chi.run_imp(file, 'EIS-001')
   
   CycleNum = (0.001, 0.002, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1)
   for loop in CycleNum:
   	chi.init_cv_tech(ei=-0.15, eh=-0.25, el=-0.15, v=loop)
   	chi.run_cv(file, 'ECSA-'+str(int(loop*1000)), add_note=True)
   
   chi.init_it_tech(ei=-0.3, si=1, st=7200)
   chi.run_it(file, 'IT-001', add_note=True)
   ```

   4. 。测试完成后会在根目录下自动保存测试的txt格式数据，只需运行HER_Data_Process.py文件即可实现基本的数据处理和可视化，这里绘制了CV活化数据（第一圈高亮）、LSV首圈和末圈数据（对比稳定性以并标注过电位）、Tafel图（并进行线性回归拟合标注Tafel斜率）、阻抗测试数据、ECSA不同扫速CV数据、ECSA数据散点图（并进行线性拟合求出单位面积电容）以及it稳定性数据。

![output](C:\Users\iCalculate\Desktop\HER-Demo\output.jpg)

## 使用说明

本系列脚本仍在不断开发迭代中，旨在针对不同类型的电化学测试流程实现自动化处理，目前已实现了HER、GCH、EIS等测试的自动化实现，目前正在征集广大科研工作者的测试需求以便我们更好的完善脚本功能。如您希望使用此脚本或给我们提出更新建议再或者加入我们开发团队可以联系我们的官方微信或在微信公众号后台咨询。

