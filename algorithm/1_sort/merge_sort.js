/**
 * 归并排序
 */

// 写法1：
// 优点：思路简单、写法简单
// 缺点：空间复杂度略高（需要复制多个数组）
function mergeSort1 (arr) {
    if (arr.length < 2) {
        return arr;
    }
    let midIndex = Math.floor(arr.length / 2);
    let left = arr.slice(0, midIndex);
    let right = arr.slice(midIndex);
    return merge1(mergeSort1(left), mergeSort1(right));
}

function merge1 (left, right) {
    let temp = [];
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            temp.push(left.shift());
        } else {
            temp.push(right.shift());
        }
    }
    if (left.length) {
        temp.push(...left);
    }
    if (right.length) {
        temp.push(...right);
    }
    return temp;
}

// 写法2
// 优点：空间复杂度低，只需一个temp存储空间，不需要拷贝数组（直接在原数组上改）
// 缺点：写法复杂
function mergeSort2 (arr, left, right, temp) {
    if (left < right) {
        const midIndex = Math.floor((left + right) / 2);
        mergeSort2(arr, left, midIndex, temp);
        mergeSort2(arr, midIndex + 1, right, temp);
        merge2(arr, left, right, temp);
    }
}

function merge2 (arr, left, right, temp) {
    const mid = Math.floor((left + right) / 2);
    let leftIndex = left;
    let rightIndex = mid + 1;
    let tempIndex = 0;  // 每次都把temp给重新赋值了
    while (leftIndex <= mid && rightIndex <= right) {
        if (arr[leftIndex] < arr[rightIndex]) {
            temp[tempIndex++] = arr[leftIndex++]
        } else {
            temp[tempIndex++] = arr[rightIndex++]
        }
    }
    while (leftIndex <= mid) {
        temp[tempIndex++] = arr[leftIndex++]
    }
    while (rightIndex <= right) {
        temp[tempIndex++] = arr[rightIndex++]
    }
    tempIndex = 0;

    // 把arr上left到right的覆盖掉
    for (let i = left; i <= right; i++) {
        arr[i] = temp[tempIndex++];
    }
}

let arr1 = [9,2,4,1,8,5,7,3];
let arr2 = [9,2,4,1,8,5,7,3];
let temp = new Array();
console.log('mergeSort1', mergeSort1(arr1));
mergeSort2(arr2, 0, arr2.length - 1, temp);
console.log('mergeSort2', arr2);