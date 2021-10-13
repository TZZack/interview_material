/**
 * 冒泡排序
 */

function bubbleSort (arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let isComplete = true;
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                isComplete = false;
            }
        }
        if (isComplete) {
            break;
        }
    }

    return arr;
}

var arr = [9,2,4,1,8,5,7,3];
console.log(bubbleSort(arr));