---
title: 常见数据结构算法
date: 2016-03-04 22:57:08
tags: 
    - 数据结构
    - 笔记
categories: 
    - 笔记
    - 数据结构
---

![数据结构](/images/dataStructures.jpg)

## 前言
数据结构的重要性就不多说了，一名合格的程序猿/媛，必修的科目。
这里列举常见的前端开发面试会遇到的数据结构面试题，好像基本都是要手写代码的。
这里的代码不限制于javascript语言，默认升序排列，有特别的地方会指出来。

## 冒泡排序[稳定 平均O(n^2)，最好O(n)，最坏O(n^2)]

```javascript
function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j + 1] < arr[j]) {
                swap(arr[j + 1], arr[j]);
            }
        }
    }
}
```

## 选择排序[稳定 平均最好最坏都为O(n^2)]

```javascript
function selectSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        var min = i;
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        swap(arr[min], arr[i]);
    }
}
```

## 快速排序[不稳定 平均最好O(nlogn),最坏O(n^2) 需要辅助空间]
```javascript
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1);
    var left = [],
        right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return quickSort(left).concat(pivot, quickSort(right));
}
```

## 二分查找[logn]
```javascript
function binarySearch(arr, key) {
    var low = 0,
        high = arr.length,
        middle;
    while (low < high) {
        middle = Math.floor((low + high) / 2);
        if (key === arr[middle]) {
            return key;
        } else if (key < arr[middle]) {
            high = middle - 1;
        } else if (key > arr[middle]) {
            low = middle + 1;
        }
    }
    return -1;
}
```

