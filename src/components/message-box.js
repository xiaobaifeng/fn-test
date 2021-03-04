function MessageBox (title, btns, type) {
  this.title = title
  this.btns = btns
  this.type = type
  var __visible__ = false
  Object.defineProperty(this, 'visible', {
    get: function () {
      return __visible__
    },
    set (value) {
      console.log('set visible: ', value)
      __visible__ = value
    }
  })
  this.eventEmitter = {}
}
MessageBox.prototype.$on = function (event, callback) {
  this.eventEmitter[event] = callback
}
MessageBox.prototype.$emit = function (event) {
  this.eventEmitter[event] && this.eventEmitter[event](this)
}
MessageBox.prototype.show = function () {
  setTimeout(() => {
    this.visible = true
    this.$emit('show')
  }, 1000)
}
MessageBox.prototype.hide = function () {
  setTimeout(() => {
    this.visible = false
    this.$emit('hide')
  }, 1000)
}
function showMessage (opt) {
  return new Promise(resolve => {
    const box = window.box = new MessageBox(opt.title)
    box.show()
    box.$on('hide', function (vm) {
      resolve(vm)
    })
  })
}

showMessage({ title: 'create' }).then(res => {
  // doing
  console.log(res)
})
