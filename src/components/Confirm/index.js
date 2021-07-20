import Vue from 'vue'
import confirm from '@/components/Confirm'
const MyComponent = Vue.extend(confirm)
var component = new MyComponent().$mount()
document.body.appendChild(component.$el)

Vue.prototype.confirm = function(data) {
  this.title = data.title
  this.content = data.content
  data.success(true)
}
