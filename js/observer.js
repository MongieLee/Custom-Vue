class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    //  1. 判断data是否是对象
    //  2. 遍历data对象的所有属性
    if (!data || typeof data !== "object") {
      return
    }
    Reflect.ownKeys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(obj, key, val) {
    // 负责手机依赖，并发布通知
    let dep = new Dep()
    // 如果val是对象，也会将其转为getter和setter
    this.walk(val);
    const _this = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target);
        return val
      },
      set(newValue) {
        if (newValue === val) {
          return
        }
        val = newValue
        _this.walk(newValue)
        // 触发依赖
        dep.notify();
      }
    })
  }
}