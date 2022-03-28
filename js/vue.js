class Vue {
  constructor(options) {
    //  1. 通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === "string" ? document.querySelector(options.el) : options.el
    //  2. 用data中的成员转化成getter和setter，注入到vue实例中
    this._proxyData(this.$data)
    //  3. 调用observer对象，监听数据的变化
    new Observer(this.$data);
    //  4. 调用compiler对象，解析指令和插值表达式
    new Compiler(this);
  }

  _proxyData(data) {
    // 遍历data中的所有属性
    Reflect.ownKeys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) {
            return
          } else {
            data[key] = newValue
          }
        }
      })
    })
    //  把data的属性注入到Vue实例中
  }
}