let vm = require('vm');
let scriptStr = '(function(a, b){console.log(a + b)})';
let afterTest = vm.runInThisContext(scriptStr);
console.log(afterTest);