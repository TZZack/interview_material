# 排序算法

## 快速排序

> `原理`：选择一个目标值，比目标值小的放左边，比目标值大的放右边，目标值的位置已排好，将左右两侧再进行快排
>
> `时间复杂度`：平均`O(nlogn)`，最坏`O(n2)`，实际上大多数情况下小于平均值
>
> `空间复杂度`：`O(logn)`

## 选择排序

>`原理`：每次循环选取最小的数字放到前面的有序序列中
>
>`时间复杂度`：O(n2)
>
>`空间复杂度`：O(1)
>
>`稳定性`：不稳定

## 冒泡排序

>`原理`：
>
>* 比较相邻的元素，前者比后者大的话，两者交换位置。
>* 对每一对相邻元素做相同操作，从开始第一对到最后一对，这样子最后的元素就是最大元素。
>* 针对n个元素重复以上步骤，每次循环排除当前最后一个。
>* 重复步骤1~3，直到排序完成。
>
>`时间复杂度`：O(n2)
>
>`空间复杂度`：O(1)
>
>`稳定性`：稳定

## 插入排序

>`原理`：将左侧序列看成一个有序序列，每次将一个数字插入该有序序列
>
>`时间复杂度`：O(n2)
>
>`空间复杂度`：O(1)
>
>`稳定性`：稳定

## 归并排序

>`原理`：分治法的典型应用
>
>* 首先是`分`，将一个数组反复二分为两个小数组，直到每个数组只有一个元素
>* 其次是`治`，从最小数组开始，两两按大小顺序合并，直到并为原始数组大小
>
>`时间复杂度`：O(nlogn)
>
>`空间复杂度`：O(n)
>
>`稳定性`：稳定

## 堆排序:TODO

>`原理`：
>
>* 创建一个大顶堆，大顶堆的堆顶一定是最大的元素
>* 交互第一个元素和最后一个元素，让剩余的元素继续调整为大顶堆
>* 从后往前依次和第一个元素交换并重新构建，排序完成
>
>`时间复杂度`：O(nlogn)
>
>`空间复杂度`：O(1)
>
>`稳定性`：不稳定

## 计数排序:TODO

> `原理`：
>
> `时间复杂度`：
>
> `空间复杂度`：