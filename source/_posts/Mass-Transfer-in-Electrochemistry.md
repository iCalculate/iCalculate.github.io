---
title: Mass Transfer in Electrochemistry
date: 2020-04-28 10:14:03
categories: 
- Scientific
tags:
- Electrochemical
---

# Mass transfer in electrochemistry

为什么电解质在许多电化学测试中必不可少？一个直观的原因是为了降低溶液电阻和降低电压降（iR drop）。可这个回答也未免过于太简单，细细深究起来，溶液电阻究竟和电解质浓度什么关系？电流又是怎么通过电解质传递的？电解质还有其他什么作用么？

这些问题的答案涉及到电化学中的**传质问题**（**mass transfer**）。

我们先来了解一下在电解过程中，物质是怎么在溶液-溶液，溶液-电极之间转移的。

首先，我们要知道处于电场之下的物质拥有电化学势能。它分为两部分，第一部分 ![[公式]](https://www.zhihu.com/equation?tex=u_%7Bi%7D%5E%7B%5Calpha%7D) 是传统的化学势能， ![[公式]](https://www.zhihu.com/equation?tex=u_%7Bi%7D%5E%7B%5Calpha%7D%3Du_%7Bi%7D%5E%7B0%5Calpha%7D%2BRTlna_%7Bi%7D%5E%7B%5Calpha%7D) ，它和温度活度有关。第二部分 ![[公式]](https://www.zhihu.com/equation?tex=z_%7Bi%7DF%5Cphi%5E%7B%5Calpha%7D) 代表由电场附加给该物质的能量，和带电荷数及电场强度有关。其中 ![[公式]](https://www.zhihu.com/equation?tex=z_%7Bi%7D) 是该物质带电荷数， ![[公式]](https://www.zhihu.com/equation?tex=%5Cphi%5E%7B%5Calpha%7D) 是电场强度。可以看出只有离子才有第二部分的能量。

$$
\overline {\mu _i^\alpha }  = \mu _i^\alpha  + {z_i}F{\phi ^\alpha }\
$$
本质上，任意两点之间的物质发生交换是因为它们之间的电化学势能不同。物质一定会从电化学势能高的地方流向电化学势能低的地方。

![img](Mass-Transfer-in-Electrochemistry\v2-458031cd21ad97036829699f5e04d259_720w.jpg)

我们假设有物种i处于溶液中r点和s点。s点电化学势能较高，势必会有物种i从s点流向r点。我们认为它的流动速度和两点之间的势能梯度差为正相关。流动速度以通量表示，符号 ![[公式]](https://www.zhihu.com/equation?tex=J) , 单位 ![[公式]](https://www.zhihu.com/equation?tex=mol%5Cbullet+s%5E%7B-1%7D%5Cbullet+cm%5E%7B-2%7D) ,它可以理解成单位时间内通过单位面积的物质的量。

![img](Mass-Transfer-in-Electrochemistry\v2-af43ea43063094d1decd30ef79e0b169_720w.jpg)

通量![[公式]](https://www.zhihu.com/equation?tex=J+)和势能梯度以及扩散系数D有关。在一维情况下，上式简化为：

![img](Mass-Transfer-in-Electrochemistry\v2-fdf48805465367c0f56916320f6c85e5_720w.png)

它代表了在一维情况下，由电化学势能差引起的物质沿着x轴流动的速度，且流动的方向是沿着电化学势能减小的方向进行。除了电化学势能差引起的传质，如果溶液本身在移动，也会引起物质的流动，且该流动方向和溶液流动方向相同。即总流动通量=电化学势能差引起的流动+溶液运动引起的流动； v(x)是溶液流动速度：

![img](Mass-Transfer-in-Electrochemistry\v2-bc44a3a60e8f808dea38c63bd633c9b0_720w.jpg)

扩展上式中的电化学势能项（![[公式]](https://www.zhihu.com/equation?tex=%5Cbar%7Bu%7D_%7Bj%7D%5E%7B%5Calpha%7D%3Du_%7Bj%7D%5E%7B%5Calpha%7D%2Bz_%7Bj%7DF%5Cphi%5E%7B%5Calpha%7D%2Cu_%7Bj%7D%5E%7B%5Calpha%7D%3Du_%7Bj%7D%5E%7B0%5Calpha%7D%2BRTlna_%7Bj%7D%5E%7B%5Calpha%7D)），再用浓度来近似活度得到：

![img](Mass-Transfer-in-Electrochemistry\v2-15fe4584a18751df4e331cac4ccbef5b_720w.jpg)

***Nernst-Planck equations\***一共由三项组成。第一项代表**扩散diffusion**，它表示由于浓度梯度引起的质量传递。第二项代表**迁移migration**，表示离子由于电场梯度引起的质量传递。第三项代表**对流convection**，它表示由于搅拌等外力引起溶液流动最后导致的质量传递。在一般的电化学测试实验中，我们不会搅拌溶液，所以第三项一般可忽略。

对于物种 ![[公式]](https://www.zhihu.com/equation?tex=j) 而言，如果它自身带电，它的流动就代表电荷流动。所以它的通量就等于电流密度。

![img](Mass-Transfer-in-Electrochemistry\v2-3f09d30af12d74e282bd0b368c66bfed_720w.jpg)通量和电流的关系，其中， ![[公式]](https://www.zhihu.com/equation?tex=i_%7Bd%2Cj%7D) 代表物种 ![[公式]](https://www.zhihu.com/equation?tex=j) 扩散导致的电流。 ![[公式]](https://www.zhihu.com/equation?tex=i_%7Bm%2Cj%7D) 代表物种 ![[公式]](https://www.zhihu.com/equation?tex=j) 迁移导致的电流。

![img](Mass-Transfer-in-Electrochemistry\v2-3c5335f9c65c257dd9b699a5c3c87fa6_720w.png)

那么电解过程中，在没有对流的情况下，总电流就等于各离子通过扩散和迁移产生的电流总和。

![img](Mass-Transfer-in-Electrochemistry\v2-3855a352cd02d7d50be57f12ac0243fb_720w.jpg)

我们接下来讨论电化学系统下，关于扩散电流和迁移电流的细节。这些工作可以追溯到1890年Planck时代。*以下所有讨论假设溶液中不存在对流。*

## *电流在溶液中的传递-迁移电流*

首先我们问自己一个问题，电流是怎么在电解质溶液中传递的？

我们知道在本体溶液中，不存在浓度梯度，因此电流只能通过离子迁移传递。因此对于某一物种 ![[公式]](https://www.zhihu.com/equation?tex=j) 而言，其迁移产生的电流为：

![img](Mass-Transfer-in-Electrochemistry\v2-13078275e025cd9f200f5598a81b2d39_720w.png)

又根据Einstein-Smoluchowski equation：

![img](Mass-Transfer-in-Electrochemistry\v2-a7aedb0ebf98ba98b510f1ea69808239_720w.jpg)

电流公式可改写成：

![img](Mass-Transfer-in-Electrochemistry\v2-69cd1f4c46e7c9aadb2ff1ce15134561_720w.jpg)

现在我们知道，电流和电场梯度差，离子带电荷量，离子迁移率以及离子浓度有关。我们可以根据上面的公式算出溶液的电导或者电阻，

![img](Mass-Transfer-in-Electrochemistry\v2-d3b28284dc5032c6448966ff4ec7fc68_720w.png)

L：离子溶液电导 conductance； R：离子溶液电阻 resistance； k：离子溶液电导率 conductivity

![img](Mass-Transfer-in-Electrochemistry\v2-5fce8a4ab804309c3bf44281e23d7a2b_720w.png)p: 电阻率 resistivity，它是电导率的倒数

**从上面公式可以看出，我们只要知道了溶液中的离子组成就可以计算溶液电阻。如果我们往溶液中加入电解质，会提高离子浓度，从而提高溶液电导，降低溶液电阻。**从第二个公式可知，电阻和距离面积有关。这也是为什么我们认为参比电极距离工作电极越近越好，这样能降低电阻。而工作电极与对电极之间的溶液通道越大越好，这样能降低它们之间的电阻，避免损失能量。顺便说一句，由于电阻而损失的电能都是以热能形势耗散的。

最后我们定义物种 ![[公式]](https://www.zhihu.com/equation?tex=j) 产生的电流占总电流的比例为转移数，transference number。公式中 ![[公式]](https://www.zhihu.com/equation?tex=%5Clambda) 是ionic conductivity， ![[公式]](https://www.zhihu.com/equation?tex=%5Clambda_%7Bi%7D%3DFu_%7Bi%7D) , 代表了这个离子的电导率。

![img](Mass-Transfer-in-Electrochemistry\v2-714907fc4fafc271e73b28e0bcc6e5dd_720w.jpg)

## ***溶液在电极表面的传递-迁移电流+扩散电流\***

我们知道在电极表面会有电化学反应，导致物质的浓度发生改变，从而产生浓度梯度，因此会导致扩散电流。所以总电流等于迁移电流加扩散电流。

![img](Mass-Transfer-in-Electrochemistry\v2-27ba5f3a3ee16ef44af55214ef882b81_720w.png)总电流=迁移电流+扩散电流

值得注意的是，扩散电流的方向和迁移电流的方向没有必然关系。

![img](Mass-Transfer-in-Electrochemistry\v2-eb92fd7763bba48170c081c9ff9fe7b6_720w.jpg)扩散电流和迁移电流

接下来我们以三个例子来学习分析，扩散电流和迁移电流的实际应用。

***例子1：简单溶液\***

![img](Mass-Transfer-in-Electrochemistry\v2-ba15ac9e6b0ec8012629eb64441e8111_720w.jpg)

假设一共有10个电子发生了转移，那么在阴极会有10个质子被消耗，在阳极会有10个氯离子被消耗。

先看溶液。在溶液中，电流是由电荷流动传递的，那么10个电子的电流就代表有10个净负电荷流向了阳极区。由于质子和氯离子在电场下的移动速率不同，所以其离子电导率不同，已知阴阳离子的电导率为 ![[公式]](https://www.zhihu.com/equation?tex=%5Clambda_%7B%2B%7D%5Capprox4%5Clambda_%7B-%7D) ，由此计算出 ![[公式]](https://www.zhihu.com/equation?tex=t_%7B%2B%7D%5Capprox4+t_%7B-%7D)，由于 ![[公式]](https://www.zhihu.com/equation?tex=t_%7B%2B%7D%2Bt_%7B-%7D%3D1) ，所以 ![[公式]](https://www.zhihu.com/equation?tex=t_%7B%2B%7D%3D0.8%2C+t_%7B-%7D%3D0.2) ，也就是说80%的电流是由阳离子（质子）传递的，20%的电流是由阴离子（氯离子）传递的。也就是说10个向右流动的净负电荷电流由8个向左移动的质子和2个向右移动的氯离子组成。

再看电极表面，由于阴极一共消耗了10个质子，因此除了迁移来的8个质子，还需要扩散2个质子到电极表面，与此同时为了保证电中性，会扩散来2个氯离子。对于阳极来说，可采取类似的分析。所以总电流 ![[公式]](https://www.zhihu.com/equation?tex=i%3D10) ,对于质子而言， ![[公式]](https://www.zhihu.com/equation?tex=i_%7Bd%7D%3D2%2C+i_%7Bm%7D%3D8) ，对于氯离子而言， ![[公式]](https://www.zhihu.com/equation?tex=i_%7Bd%7D%3D8%2C+i_%7Bm%7D%3D2) 。

这里我们学习了如何通过转移数来计算相应离子的迁移电流和扩散电流。

***例子2：复杂溶液\***

上面的例子相对比较简单。对于多种浓度不同离子混合溶液，也能通过转移数来计算相应的迁移电流和扩散电流。

![img](Mass-Transfer-in-Electrochemistry\v2-4a81d9daf6ce137cb4a4414db234b04f_720w.jpg)

离子的浓度已在上图中标出，假设 ![[公式]](https://www.zhihu.com/equation?tex=Cu%28II%29%2CCu%28I%29%2CCl%5E%7B-%7D) 的离子电导率 ![[公式]](https://www.zhihu.com/equation?tex=%5Clambda) 相同，请算出相应的转移数，再根据转移数算出相应的迁移电流。再根据迁移电流和总电流算出扩散电流。这个问题留给你们自己去算。答案已经在图中了。For Cu(II) at the cathode, im=1, id=5. For Cu(I) at the anode, im=-1, id=7

***例子3：电解质的影响\***

现在我们来讨论在例子2的溶液中加入0.1 M NaClO4的电解质，会如何改变扩散和迁移电流。假设所有离子的电导率相同，那么我们会发现钠离子和高氯酸根离子的转移数很高，溶液中的电流有97%是通过这两种离子的迁移产生。

![img](Mass-Transfer-in-Electrochemistry\v2-0a66aca59d94fa687da24f3c2c126569_720w.jpg)

For Сu(II) at the cathode, im=0.03, id=5.97. 我们发现，在阴极被还原的二价铜离子主要是通过扩散传质。换句话说，对于铜离子而言，往溶液加入大量电解质，可以消除Nernst-Planck equations中的迁移项。这相当于简化了该方程，有助于我们后续的数学处理和方程解析。

**总的来说，电解质有以下作用：**

1. 消除electroactive species的传质方程中的迁移项，简化数学处理，简化电化学分析方法（比如CV）的理论分析。
2. 降低溶液电阻，避免电压降，避免不必要的能量损失。也能保障参比电极和工作电极之间准确的电势测量。
3. 提供一个化学环境（pH, Ionic strength等）来稳定化合物，甚至改变电极反应速率。很多时候电解质也是buffer。
4. 电解质的加入可以保证双电层远远小于扩散层。
5. 当然它有一定的缺点。因为电解质使用量很大。第一是浪费。第二是它的杂质会影响分析。第三电解质从某种意义上讲已经改变了溶液的性质和分析物质所处的化学环境，所以该环境中测得的热力学/动力学数据可能和纯溶液环境中有区别。

如果你实在不想用电解质，或者你的溶液电阻（比如非极性的有机溶液）真的非常大，你可以使用**超微电极（ultramicroelectrode）**，由于超微电极面积极小，产生的电流极小，所以电压降 ![[公式]](https://www.zhihu.com/equation?tex=iR) drop通常可以忽略不计。不过值得注意的是，在没有电解质的情况下，我们无法忽略迁移电流的存在。比如下图中是Tl2SO4在UME上的还原伏安图。可以发现电流随着电解质的加入而变小。那是因为，电解质的加入导致Tl2+离子往阴极表面的迁移电流消失，所以总电流就变小了。

![img](Mass-Transfer-in-Electrochemistry\v2-64ea87e01f569a678851c8fd316a8a10_720w.jpg)



以上讨论了电流中的迁移项。下面讨论扩散项。

## ***物质扩散和扩散电流\***

物质的扩散主要涉及要Fick第一定律和Fick第二定律。[详见我的另一篇文章](https://zhuanlan.zhihu.com/p/131674979)。

![img](Mass-Transfer-in-Electrochemistry\v2-44478c145a394e24dad142ef4805e4e6_720w.jpg)Fick第一定律

![img](Mass-Transfer-in-Electrochemistry\v2-e11a4f8ebc6d856e5ed988ec74b823f9_720w.jpg)Fick第二定律

简单来说，Fick第一定律描述了扩散通量和浓度梯度的关系。Fick第二定律描述了浓度是如何随着时间变化的。通过给这两个偏微分方程设立边界条件，就能对方程进行解析，得到扩散通量和扩散电流了。扩散方程非常重要，前面讲到在含电解质的溶液中，电流基本等于扩散电流。因此只要能解析出扩散方程就能知道总电流，在此基础上可以研究电流-电压关系，电极反应动力学，反应机理等等。比如，我有一篇文章介绍了[Fick定律在CV模拟中的应用。](https://zhuanlan.zhihu.com/p/130561366)

***Bonus:\***

我们知道，即使在平衡状态下，分子并不是静止，它会发生布朗运动。它会自发的进行“扩散”和“迁移”。对于同一种离子而言，我们怎么比较其扩散速度和其迁移速度？

![img](Mass-Transfer-in-Electrochemistry\v2-2a8678d27e5e54403196716cb5808382_720w.png)扩散速度 单位：cm/s

![img](Mass-Transfer-in-Electrochemistry\v2-41440d488df0c4e5833aa5278d050ca0_720w.png)迁移速度 单位：cm/s

要想让迁移速度远远小于扩散速度，

![img](Mass-Transfer-in-Electrochemistry\v2-cdd95c2aea6369e4eae7e64846c76529_720w.jpg)

25摄氏度下，要想让某一离子的迁移忽略不计，那么两点之间的电压差应该远小于 ![[公式]](https://www.zhihu.com/equation?tex=51.4%2F%5Cleft%7C+z_%7Bi%7D+%5Cright%7C) mV。

***总结\***

可以看出，对于电流而言，离子的质量传递（mass transfer）才是其本质。在本体溶液中，主要是迁移电流。在电极表面同时存在扩散电流和迁移电流。电解质承担了迁移电流的大部分，消除了迁移对于电化学活性物质传质的影响，简化了其传质方程的数学处理，也同时降低了溶液电阻。

今天的内容到此为止，欢迎一起探讨。