class Compiler {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    this.compile(this.el)
  }

  // 编译模板，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  update(node, key, attrName) {
    let updateFn = this[attrName + "Updater"];
    updateFn && updateFn.call(this, node, this.vm[key], key);
  }

  // 编译元素节点，处理指令
  compileElement(node) {
    Array.from(node.attributes).filter(attr => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        attrName = attrName.substring(2);
        let key = attr.value;
        this.update(node, key, attrName)
      }
    })
  }

  // 处理v-text指令
  textUpdater(node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }

  // 处理v-model
  modelUpdater(node, value, key) {
    node.value = value;
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue;
    })
    node.addEventListener('input', (e) => {
      this.vm[key] = e.target.value
    })
  }

  // 编译文本节点， 处理插值表达式
  compileText(node) {
    // {{ text }}
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key])

      // 创建watcher对象，当数据改变时
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }

// 判断元素属性是否指令
  isDirective(attrName) {
    return attrName.startsWith("v-")
  }

// 判断节点是否是文本节点
  isTextNode(node) {
    // 3是文本，1是元素
    return node.nodeType === 3
  }

// 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}