
import { createApp } from 'vue'
import App from './App.vue'
import Exposure from './Exposure'
const app = createApp(App)

const options = {
  root: null, //默认浏览器视窗
  threshold: 1 //元素完全出现在浏览器视窗内才执行callback函数。
}
let timer = {}; //增加定时器对象

const reportMsg = (visuallyData) => {
  return new Promise((resolve, reject) => {
    console.log('reportMsg', visuallyData)
    resolve({
      code: 0,
      success: true
    })
  })
}
const callback = entries => {
  entries.forEach(entry => {
    let visuallyData = null;
    try {
      visuallyData = JSON.parse(entry.target.getAttribute('visually-data'));
    } catch (e) {
      visuallyData = null;
      console.error('埋点数据格式异常', e);
    }
    //没有埋点数据取消上报
    if (!visuallyData) {
      observer.unobserve(entry.target);
      return;
    }
    
    if (entry.isIntersecting) {
      timer[visuallyData.id] = setTimeout(function() {
        //上报埋点信息
        reportMsg(visuallyData).then(res => {
          if (res.success) {
            //上报成功后取消监听
            observer.unobserve(entry.target);
            visuallyList.push(visuallyData.id);
            timer[visuallyData.id] = null;
          }
        });
      }, 1000);
  } else {
    if (timer[visuallyData.id]) {
      clearTimeout(timer[visuallyData.id]);
      timer[visuallyData.id] = null;
    }
  }
  });
};
const observer = new IntersectionObserver(callback, options);
let visuallyList = []; //记录已经上报过的埋点信息
const addListenner = (ele, binding) => {
  console.log('binding.value', binding.value)
    if(visuallyList.indexOf(binding.value) !== -1) return;
    
    observer.observe(ele);
};
const removeListener = (ele) => {
  observer.unobserve(ele);
};

//自定义曝光指令
// app.directive('visually', {
//   mounted: addListenner,
//   unmounted: removeListener,
// });

const exposeInstance = new Exposure()
app.directive('expose', {
  mounted: (el, binding) => exposeInstance.add(el, binding),
  unmounted: (el, binding) => exposeInstance.remove(el, binding),
});
app.mount('#app')
