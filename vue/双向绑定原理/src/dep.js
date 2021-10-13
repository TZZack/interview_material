/**
 * 订阅器：统一管理监听器和订阅者
 */
function Dep () {

    // 存放订阅者
    this.subs = [];
}
Dep.target = null;  // 全局唯一的订阅者，同一时间只能由一个全局的watcher被计算
Dep.prototype = {
    addSub (sub) {
        this.subs.push(sub);
    },

    // 通知订阅者去执行更新函数
    notify () {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
};

module.exports = Dep;