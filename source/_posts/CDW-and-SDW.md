---
title: CDW and SDW
date: 2020-03-03 11:14:51
tags: 
- Knowledge Point
categories: 
- Scientific
typora-root-url: CDW-and-SDW
---

# 电荷密度波与自旋密度波 

电荷密度波（charge density wave->CDW）不稳定性最早是由Frohlich和Peierls在1954,1955年提出的。

一、一维CDW: Peierls instability

之前已经多次提到过一维自由电子气的Peierls distortion，把奇数位或偶数位的原子整体相对偏移一点点，原来晶胞的晶格常数会由a变成2a，它会在布里渊区边界处±π/2a打开一个gap, 且具有更低的能量，意味着低温下一维的金属由于这种distortion总是不稳定的，伴随着metal–insulator transition （MIT）

![img](/89796915173140288a2f8563a41e5b7c.jpeg)

从线性响应理论去看，给定一个微扰的外场，可以导致电荷的重新分布

![img](/10eedd7d040548aead123648d75dcdea.png)

![img](/aae3d3340f524f69a6597f496316f4c5.png)

![img](/bc5ffc3f34bd478c8bb2ce1d678c147a.png)

这个系数Lindhard susceptibility.

这个公式表明只有电子-空穴pair有贡献，即

![img](/07ed82419c344d21819ce003d72f9e5d.png)

这和BCS超导不同，它是电子-电子pair。同时当二者能量接近的时候，会产生很大的峰值，所以它的贡献主要来自费米能级附近

q ~2kF，把这种现象也称作Fermi *surface* (FS) nesting

![img](/eda4f75059584933a4c452eac98b346f.jpeg)

对于二维和三维的自由电子气没有这么完美的nesting，

![img](/ab483d790a89421aa13c7ceabcddbf56.png)

![img](/3de2df7e54c04f84b658bb0f6b496644.jpeg)

不同维度的响应函数以及声子在不同温度下的色散关系，一维的Lindhard response function在q =2kF有一个发散的点，因此这样的一维电子气是不稳的。Kohn在1959年也指出了这种电子的excitation会有效的屏蔽某些波矢phonon mode（2kF）. 这被称作phonon softening.

![img](/7c8f99626a8b4ac5a5d0d8737f11fa08.jpeg)

二、二维CDW: electron–phonon coupling

二维、三维的CDW体系不能由Peierls的图像解释，比如六方的NbSe2就没有Fermi *surface* nesting （FSN）. 显然CDW的起源并不来自于FSN，所以提出了电声耦合electron–phonon coupling (EPC)的机制，它们都是电子和晶格的作用，FSN是弹性散射，EPC是非弹性散射。EPC的Hamiltonian最先由Frohlich给出，这也是BCS超导的理论基础

![img](/12598f894e4d4b1ba901d713b634ea2c.png)

第一项是自由电子的能量，第二项是phonon的能量，第三项就是EPC，它满足动量守恒。EPC对声子能量的renormalization可得

![img](/68a556d87b294802a354c0c551a14a34.png)

对Lindhard response function取一个static limit **ω=0**

![img](/16005cb98347422ab36bb6007e3f07cf.png)

可以看到不论维度是多少声子频率都会减小，在q =2kF处可以存在很大的异常，这种反常的声子色散关系就是Kohn anomaly。利用和BCS理论同样的处理方法即平均场近似便可以求出CDW转变温度（略）。

三、CDW: Electron correlations

在一些经典的CDW体系中，其转变机制依然存在激烈的争论。这是个全新的观点，CDW和电子关联有关，有待考察。。。

四、Spin Density Wave (SDW)

SDW和CDW很类似，不同的是CDW来自electron-phonon interaction而SDW起源于electron-electron interaction, 需要用到之前讲的Hubbard model (略)。粗糙的来讲，SDW可以看作两个自旋相反的CDW

![img](/d055916f17f74fdcae5b05c50346eeb9.png)

![img](/fae75e8567274eb2b6c9ac1d63031214.png)

五、最后: Anderson-Higgs mechanism

二者都要破坏平移对称性，这和超导el-el不一样（gauge symmetry）