---
title: Drude Model in Soild State Physics
date: 2020-04-17 23:18:16
categories: 
- Scientific
tags:
- Literature 
---



最近发现Drude model 真是太重要了啊。我主要从事半导体工作，也会用到今属，Drude model 把载流子浓度n，漂移寿命（对应声子散射频率） ![[公式]](https://www.zhihu.com/equation?tex=%5Ctau) ，电磁波频率 ![[公式]](https://www.zhihu.com/equation?tex=%5Comega) ，物质有效质量m放在一个公式里面真是太有意思了啊。Drude model就是用来描述物质最基本的性质的模型，最基本的性质包括 电导率 ![[公式]](https://www.zhihu.com/equation?tex=%5Csigma) ，介电常数 ![[公式]](https://www.zhihu.com/equation?tex=%5Cvarepsilon) ，以及折射率n，此外还有吸收系数 ![[公式]](https://www.zhihu.com/equation?tex=%5Calpha)![[公式]](https://www.zhihu.com/equation?tex=+)

试想一下光与物质的相互作用是怎么作用的？

光对物质的作用分为光对物质中的自由电子的作用，和 光对物质中电子跃迁的作用，Drude model 描述的就是光对半导体和金属中自由电子的作用。

简单来说，Drude model 就是将电子看作是经典的粒子

{利用独立电子近似（忽略电子相互作用），自由电子近似（忽略电子与晶格相互作用），再考虑一个弛豫时间}

从经典的牛顿第二定律入手，动力学方程为

![[公式]](https://www.zhihu.com/equation?tex=m%5Cfrac%7Bdv%7D%7Bdt%7D%2B%5Cfrac%7Bmv%7D%7B%5Ctau%7D%3DeE_%7B0%7De%5E%7B-i%5Comega+t%7D)

这里 ![[公式]](https://www.zhihu.com/equation?tex=%5Ctau) 这一项提供了阻尼项；一个正弦变化的电场提供驱动力，

为了对应正弦变化的场，电子的运动速度也会是正弦变化，设为

![[公式]](https://www.zhihu.com/equation?tex=v%3D+v_%7B0%7Dx%5E%7B-i%5Comega+t%7D)

得到

![[公式]](https://www.zhihu.com/equation?tex=%28-m%5Comega+i9%2B%5Cfrac%7Bm%7D%7B%5Ctau%7D%29v_%7B0%7D+%3D%5Csigma+E_%7B0%7D)

求解出了电子的运动速度 ![[公式]](https://www.zhihu.com/equation?tex=v_%7B0%7D) ，进而用

![[公式]](https://www.zhihu.com/equation?tex=j%3Dnev_%7B0%7D%3D%5Csigma+E_%7B0%7D)

从而求解出 ![[公式]](https://www.zhihu.com/equation?tex=%5Csigma%28%5Comega%29)

而从基本麦克斯韦方程可以推导出 ![[公式]](https://www.zhihu.com/equation?tex=%5Csigma) 和 ![[公式]](https://www.zhihu.com/equation?tex=%5Cvarepsilon) 的千丝万缕的关系，从而有了 ![[公式]](https://www.zhihu.com/equation?tex=%5Cepsilon+%28%5Comega%29) ,

![[公式]](https://www.zhihu.com/equation?tex=%5Cepsilon%28%5Comega%29%3D%5Cepsilon_%7Bcore%7D%2B%5Cfrac%7B4%5Cpi+i%7D%7B%5Comega%7D%5Cfrac%7Bne%5E%7B2%7D%5Ctau%7D%7Bm%281-i%5Comega%5Ctau%29%7D%3D%5Cvarepsilon_%7B1%7D%2B%5Cvarepsilon_%7B2%7Di)

也就是有了

![[公式]](https://www.zhihu.com/equation?tex=n%28%5Comega%29%3Dsqrt%28%5Cvarepsilon%29%3Dn%2Bki) ，      也就是有了色散关系。

然后分别根据高频和低频以及共振频率进行分析。低频和高频是电子波频率相对与电子运动的频率的比较，一半用 ![[公式]](https://www.zhihu.com/equation?tex=%5Comega%5Ctau) 跟1的关系是远大于还是远小于来衡量，换个形式就是 ![[公式]](https://www.zhihu.com/equation?tex=%5Comega) 和 ![[公式]](https://www.zhihu.com/equation?tex=1%2F%5Ctau) 的比较， ![[公式]](https://www.zhihu.com/equation?tex=1%2F%5Ctau) 显然就是电子的频率。当然上面色散关系的分母就是 ![[公式]](https://www.zhihu.com/equation?tex=1-i%5Comega%5Ctau) ，因此通过比较就可以做不同的近似，从而是色散关系简单很多。

下面再把介电常数和折射率再分开解释一下。

物质的介电常数表述的是对外加电场的响应情况，对了，电磁波（光）是高频变化的电场。介电常数是复数，而且可正可负可为零的，我暂时理解正负号是对外电场做出回应的方向不同（有误请指出），而虚部是对外电场相应的相位滞后。

介电常数随频率变化会存在一个零点，这个频率为零的称为 等离子体频率 ![[公式]](https://www.zhihu.com/equation?tex=%5Comega_%7Bp%7D) （Plasma frequency）。

金属的等离子体频率很高，在x射线波段。

而半导体的等离子体频率和掺杂关系很大，对半导体而言，当介电常数从正变为负时，也说其对光的相应从半导体变为金属性质，半导体介电常数的实部是与掺杂浓度呈反比的关系，掺杂浓度越高，介电常数越小，折射率也就越小。

折射率

![[公式]](https://www.zhihu.com/equation?tex=n%28%5Comega%29%3Dsqrt%28%5Cvarepsilon%29%3Dn%2Bki) ![[公式]](https://www.zhihu.com/equation?tex=+) 

实部可以立即成物质对光在里面传播的阻碍作用，v=c/n，折射率越大意味着光在物质中的速度越小。而折射率的虚部则描述的是光对物质的吸收和损耗作用。

下面再说一个参数，吸收系数 ![[公式]](https://www.zhihu.com/equation?tex=%5Calpha) ，也就是损耗。

![[公式]](https://www.zhihu.com/equation?tex=%5Calpha%3D%5Cfrac%7B2%5Comega%7D%7Bc%7D%2Ak%28w%29%3D%5Cfrac%7B4pi%7D%7B%5Clambda%7D%2Ak%28w%29) 

吸收有自由载流子吸收和带间跃迁吸收，这里只讲一下金属和半导体中自由载流子的吸收，有人需要的话我再不带间吸收的。具体公式我也就不写了，

对金属而言，吸收系数 ![[公式]](https://www.zhihu.com/equation?tex=%5Calpha) 与 ![[公式]](https://www.zhihu.com/equation?tex=%5Comega%5E%7B%5Cfrac%7B1%7D%7B2%7D%7D) 成正比；

对半导体而言，吸收系数 ![[公式]](https://www.zhihu.com/equation?tex=%5Calpha) 与 ![[公式]](https://www.zhihu.com/equation?tex=%5Comega%5E%7B-2%7D) 成正比。

这是因为，对半导体而言，一般光学频率（可见光及红外）是高频，取得是高频近似，而对金属而言，一般光波频率是低频，因此取得低频近似，这是金属半导体得区别，

顺便提一下：金属里面自由电子浓度大概30次方左右 ![[公式]](https://www.zhihu.com/equation?tex=cm%5E%7B-3%7D) ,半导体是10-20，而且电子在金属中运动，应该还有其他常数得数量级，有空补充。

以上是我用到的Drude model简单应用的浅陋理解，说错了请指出，我一定改。