let test2 = requireZZZ('./test2');
module.exports = {
    a: 1,
    b: 2,
    c: test2.c,
    d () {
        return 3
    }
}