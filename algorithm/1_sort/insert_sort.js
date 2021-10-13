/**
 * 插入排序
 */

function insertSort (arr) {
    for (let i = 1; i < arr.length; i++) {
        let target = i;
        for (let j = i - 1; j >= 0; j--) {
            if (arr[target] < arr[j]) {
                [arr[target], arr[j]] = [arr[j], arr[target]];
                target = j;
            } else {
                break;
            }
        }
    }
    return arr;
}

var arr = [9,2,4,1,8,5,7,3];
console.log(insertSort(arr));