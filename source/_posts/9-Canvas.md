---
title: Canvas一般用法
date: 2016-03-10 20:54:38
tags: 
    - HTML
    - 笔记
    - Canvas
categories: 
    - 笔记
    - HTML
---


![](/images/snow.jpg)

## what is Canvas
Canvas是HTML5的绘图接口，可以提供用JavaScript绘制位图的功能。

## API
Canvas的API众多，这里举几个常用的。(好久没看都快忘了。。。)

> 1.beginPath() 让canvas根据需要计算图形的内部和外部范围，通常在绘图开始会有
> 2.moveTo(),lineTo() 移动和画线函数，但是不会马上绘制(paint)
> 3.stroke(绘制)和fill(填充)会马上绘制图形显示出来
> 4.lineWidth可以改变线条宽度
> 5.strokeStyle可以改变绘制颜色

## 缓存Canvas成数据
用`canvas.toDataURL(type)`可以获取data URL格式的Canvas数据

## DEMO
```javascript
function createCanopyPath(context) {
    //绘制树
    context.beginPath();
    context.moveTo(-25, -50);
    context.lineTo(-10, -80);
    context.lineTo(-20, -80);
    context.lineTo(-5, -110);
    context.lineTo(-15, -110);

    context.lineTo(0, -140);

    context.lineTo(15, -110);
    context.lineTo(5, -110);
    context.lineTo(20, -80);
    context.lineTo(10, -80);
    context.lineTo(25, -50);
    context.closePath();
}

function drawTrails() {
    var canvas = document.getElementById('trails');
    var context = canvas.getContext('2d');

    context.save();
    //移动画布
    context.translate(130, 250);
    //绘制树的上半部分
    createCanopyPath(context);
    //线条宽度
    context.lineWidth = 4;
    //拐角显得平滑
    context.lineJoin = 'round'; 
    //设置颜色并且绘制
    context.strokeStyle = '#663300';
    context.stroke();

    //填充颜色
    context.fillStyle = '#339900';
    context.fill();

    context.fillStyle = '#663300';
    context.fillRect(-5, -50, 10, 50);

    //恢复初始状态
    context.restore();

    // Save the canvas state and draw the path
    context.save();

    context.translate(-10, 350);
    context.beginPath();

    // The first curve bends up and right
    context.moveTo(0, 0);

    //绘制曲线
    context.quadraticCurveTo(170, -50, 260, -190);

    // The second curve continues down and right
    context.quadraticCurveTo(310, -250, 410,-250);
    
    // Draw the path in a wide brown stroke
    context.strokeStyle = '#663300';
    context.lineWidth = 20;
    context.stroke();

    // Restore the previous canvas state
    context.restore();
}

window.addEventListener("load", drawTrails, true);
```

