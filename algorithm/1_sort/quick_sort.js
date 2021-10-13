/**
 * 快速排序
 */

function quickSort (arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let target = arr[0];
    let left = [];
    let right = [];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > target) {
            right.push(arr[i]);
        } else {
            left.push(arr[i]);
        }
    };
    return quickSort(left).concat([target], quickSort(right));
}

var arr = [9,2,4,1,8,5,7,3];
console.log(quickSort(arr));