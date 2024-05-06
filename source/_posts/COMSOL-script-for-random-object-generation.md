---
title: COMSOL script for random object generation
date: 2023-03-21 16:21:08
tags: 
- COMSOL
categories:
- Scientific
---

The comsol geometry generation script developed based on java can generate randomly distributed geometry structures (circles) in two-dimensional geometry space without overlapping each other, and can customize parameters such as generation space, particle size, and particle spacing. Running the script may enter an infinite loop, so you can manually terminate the script.

<!--more-->

# COMSOL script for random object generation

The comsol geometry generation script developed based on java can generate randomly distributed geometry structures (circles) in two-dimensional geometry space without overlapping each other, and can customize parameters such as generation space (*Xlim* & *Ylim*), particle size (*CirR*) and number (*CirNum*), and particle spacing (*space*). Running the script may enter an infinite loop, so you can manually terminate the script.

Create a new method in COMSOL App developer and copy the code to run it:

```java
int CirNum = 300;
double SimHeight = 3;
double[] Xlim = {0.0, 2.5};
double[] Ylim = {0.0, 1.0};
double[] CirR = {0.045/2.0, 0.055/2.0};
double space = 0.06;
double[][] pos_list = new double[CirNum][3];

model.component("comp1").geom("geom1").feature().clear();
model.component("comp1").geom("geom1").nodeGroup().clear();

model.component("comp1").geom("geom1").feature().clear();
model.component("comp1").geom("geom1").lengthUnit("\u00b5m");
model.component("comp1").geom("geom1").create("r1", "Rectangle");
model.component("comp1").geom("geom1").feature("r1").set("size", new double[]{Xlim[1], SimHeight});

model.component("comp1").geom("geom1").create("r2", "Rectangle");
model.component("comp1").geom("geom1").feature("r2").set("size", new double[]{Xlim[1], Ylim[1]-Ylim[0]});
model.component("comp1").geom("geom1").feature("r2").set("pos", new double[]{0, 0});
model.component("comp1").geom("geom1").run("r1");
model.component("comp1").geom("geom1").run("r2");

double CirR_i = Math.random()*(CirR[1]-CirR[0])+CirR[0];
double[] Pos = {0.0, 0.0};
Pos[0] = Math.random()*(Xlim[1]-Xlim[0]);
Pos[1] = Math.random()*(Ylim[1]-Ylim[0]-2*CirR_i-2*space)+Ylim[0]+CirR_i+space;
pos_list[0][0] = Pos[0];
pos_list[0][1] = Pos[1];
pos_list[0][2] = CirR_i;
model.component("comp1").geom("geom1").create("c"+0, "Circle");
model.component("comp1").geom("geom1").feature("c"+0).set("pos", Pos);
model.component("comp1").geom("geom1").feature("c"+0).set("r", CirR_i);
model.component("comp1").geom("geom1").run("c"+0);

for (int i = 1; i < CirNum; i++) {
  CirR_i = Math.random()*(CirR[1]-CirR[0])+CirR[0];
  Pos[0] = Math.random()*(Xlim[1]-Xlim[0])+Xlim[0];
  Pos[1] = Math.random()*(Ylim[1]-Ylim[0]-2*CirR_i-2*space)+Ylim[0]+CirR_i+space;
  pos_list[i][0] = Pos[0];
  pos_list[i][1] = Pos[1];
  pos_list[i][2] = CirR_i;
  System.out.print(CirR_i);
  for (int j = 0; j < i; j++) {
    double dist = Math.sqrt((pos_list[i][0]-pos_list[j][0])*(pos_list[i][0]-pos_list[j][0])+
                            (pos_list[i][1]-pos_list[j][1])*(pos_list[i][1]-pos_list[j][1]));
    if (dist < (CirR_i+pos_list[j][2]+space)) {
      
      i = i-1;
      break;
    }
    if (j+1 == i) {
      model.component("comp1").geom("geom1").create("c"+i, "Circle");
      model.component("comp1").geom("geom1").feature("c"+i).set("pos", Pos);
      model.component("comp1").geom("geom1").feature("c"+i).set("r", CirR_i);
      model.component("comp1").geom("geom1").run("c"+i);
    }
  }
}
```

