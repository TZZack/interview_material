const Watcher = require('./watcher');

function Compile (el, vm) {

    // 当前实例
    this.vm = vm;

    // new Vue时传进来的el配置
    this.el = document.querySelector(el);
    this.fragment = null;   // 碎片节点

    // 初始化编译
    this.init();
}

Compile.prototype = {
    init () {
        if (this.el) {
            // 把所有dom节点都放入fragment碎片节点里面，再统一添加到页面，会减少页面渲染dom的次数，效率明显提升
            this.fragment = this.nodeToFragment(this.el);

            // 编译节点上的指令和插值表达式
            this.compileElement(this.fragment);

            // 统一把所有元素添加到页面
            this.el.appendChild(this.fragment);
        } else {
            console.log('Dom元素不存在');
        }
    },

    // 把当前vue实例的所有节点都放入碎片节点
    nodeToFragment (el) {
        let fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while (child) {
            // 将Dom元素一如fragment中
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    },

    // 编译所有元素：分为指令和插值表达式
    compileElement (el) {

        // 当前节点的所有子节点
        let childNodes = el.childNodes;
        let me = this;
        Array.from(childNodes).forEach(node => {
            var reg = /\{\{(.*)\}\}/;   // 插值表达式
            var text = node.textContent;    // 节点的textContent，即标签中间的内容

            // 如果是元素节点
            if (me.isElementNode(node)) {
                me.compile(node);
            } else if (me.isTextNode(node) && reg.test(text)) {

                // 文本节点且包含插值表达式的处理
                me.compileText(node, reg.exec(text)[1]);
            }

            // 该节点还有子节点，则递归编译下去
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    },

    /**
     * 编译文本
     * @param {Object} node 文本节点
     * @param {String} exp 插值属性
     */
    compileText (node, exp) {
        let me = this;
        let text = this.vm[exp];
        this.updateNodeText(node, text);
        new Watcher(this.vm, exp, (value) => {
            me.updateNodeText(node, value);
        });
    },

    // 编译节点的所有指令：分为事件监听和v-model
    compile (node) {
        let nodeAttrs = node.attributes;
        let me = this;
        Array.from(nodeAttrs).forEach(attr => {
            let attrName = attr.name;
            if (me.isDirective(attrName)) {

                // 指令绑定的属性，比如v-model="name" 的name
                let exp = attr.value;
                let directiveName = attrName.substring(2);    // 指令名称，去掉v-

                // 事件监听指令
                if (me.isEventDirective(directiveName)) {
                    me.compileEvent(node, me.vm, exp, directiveName);
                } else {    // v-model指令
                    me.compileModel(node, me.vm, exp, directiveName);
                }

                // 编译完指令后，删除绑定上去的指令
                node.removeAttribute(attrName);
            }
        });
    },

    // 编译事件监听
    compileEvent (node, vm, exp, directiveName) {

        // 事件名称
        let eventName = directiveName.split(':')[1];
        let cb = vm.methods && vm.methods[exp];   // 事件处理函数
        if (eventName && cb) {

            // 用原生的事件监听
            node.addEventListener(eventName, cb.bind(vm), false);
        }
    },

    // 编译v-model
    compileModel (node, vm, exp, directiveName) {
        let me = this;
        let val = this.vm[exp];
        this.updateNodeValue(node, val);

        // 初始化订阅者
        new Watcher(this.vm, exp, (value) => {
            me.updateNodeValue(node, value);
        });

        // 暂时不知道这个更新的意思在哪里
        node.addEventListener('input', (e) => {
            let newVal = e.target.value;
            if (val === newVal) {
                return;
            }
            me.vm[exp] = newVal;
            val = newVal;
        });
    },

    // 设置节点的textContent
    updateNodeText (node, val) {
        node.textContent = typeof val === 'undefined' ? '' : val;
    },

    // 设置节点的值
    updateNodeValue (node, val) {
        node.value = typeof val === 'undefined' ? '' : val;
    },

    // 是否是vue的指令
    isDirective (attr) {
        return attr.indexOf('v-') === 0;
    },

    // 是否是事件监听指令（另外处理）
    isEventDirective (directiveName) {
        return directiveName.indexOf('on:') === 0;
    },

    // 是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1;
    },

    // 是否是元素或属性中的文本内容
    isTextNode (node) {
        return node.nodeType === 3;
    }
}

module.exports = Compile;