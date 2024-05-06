---
title: Hertz-Knudsen Equation for Evaporation and Condensation
date: 2020-03-11 15:18:35
tags: 
- Theory 
categories: 
- Scientific
---

对于非解离蒸发过程，描述非平衡相界面蒸发过程中质量流非常经典的Hertz-Knudsen-Schrage equation适用:

![[公式]](https://www.zhihu.com/equation?tex=+j%3D%5Cfrac%7B2%7D%7B2%E2%88%92%5Ckappa_C%7D+%5Cfrac%7B1%7D+%7B%E2%88%9A2%CF%80%7D%28+%5Ckappa_E%5Cfrac%7Bp_%7Bsat%7D+%28T_l%29%7D+%7B%5Csqrt%7BRT_l%7D%7D+%E2%88%92+%5Ckappa_C%5Cfrac%7Bp_v%7D+%7B%5Csqrt%7BRT_v%7D%7D+%29)

![[公式]](https://www.zhihu.com/equation?tex=+Denotation%3A+j-massflux%2C+l-liquid%2C+v-vapor%2C+p_%7Bsat%7D%28T%29-+)**T**温度下的饱和蒸汽压。

![[公式]](https://www.zhihu.com/equation?tex=%5Ckappa_E) 和 ![[公式]](https://www.zhihu.com/equation?tex=%5Ckappa_C) 是两个经验参数，分别称为**蒸发系数**和**凝聚系数**，也是对于一种特定溶剂实际测量的系数。对这两个系数物理含义的直观理解是离开原有相并在相界面处缓慢迁移的分子中，气相分子和液相分子中各占的比例。

对于如何确定![[公式]](https://www.zhihu.com/equation?tex=%5Ckappa_E)  和 ![[公式]](https://www.zhihu.com/equation?tex=%5Ckappa_C)有基于速率分布律的导出公式(Tsuruta and Nagayama 1999)，也有不少MD模拟和实验研究。

除了经典的非平衡热力学方法之外，经典速率理论通过考虑压强非恒定界面处的粒子速率分布，也得出了类似的表达式(Schrage 1953, Barrett and Clement 1992)。这些方法的共性是都包含并未显式定义的蒸发系数和凝聚系数，而近年有人通过statistical rate theory (**SRT**)建立了依赖于界面熵 ![[公式]](https://www.zhihu.com/equation?tex=%5CDelta+S_%7BLV%7D) 和饱和蒸汽压的方程(Ward and Fang 1999)：

![[公式]](https://www.zhihu.com/equation?tex=j%3D%5Cfrac%7B%5Ceta+p_%7Bsat%7D%28T_L%29%7D+%7B2%5Cpi+mkT_L%7D+%28+exp+%28%5CDelta+S_%7BLV%7D%2Fk%29+-+exp+%28-%5CDelta+S_%7BLV%7D%2Fk%29%29)

![[公式]](https://www.zhihu.com/equation?tex=%5CDelta+S_%7BLV%7D)在理论上可以通过展开两相的配分函数得到。这个方法得到的结果和实验吻合较好（图片来自P Rahimi 2005）：

![img](https://pic2.zhimg.com/50/v2-ca321536331dc3de190591a49a35ccb0_hd.jpg)

Figure 5. Pressure in the vapor predicted by the SRT expression using measured values of temperature at the interface in the vapor and the liquid and the curvature of the interface at the measured rate of evaporation.

这些方法的共同点是假设相界面的过渡层，再通过分析两相热力学状态对这个过渡层中粒子的组成和速率分布的影响，进而积分得到质量流函数，也就是反应纯溶剂的挥发速率。

相关文献和参考资料：

http://www.lorentzcenter.nl/lc/web/2011/465/presentations/Henning%20Struchtrup.pdfwww.lorentzcenter.nl
https://link.zhihu.com/target=http%3A//www.lorentzcenter.nl/lc/web/2011/465/presentations/Henning%20Struchtrup.pdf
https://link.zhihu.com/?target=https%3A//link.springer.com/article/10.1007%2Fs10891-014-1006-4https://link.zh
ihu.com/?target=http%3A//dergipark.ulakbim.gov.tr/eoguijt/article/view/1034000142