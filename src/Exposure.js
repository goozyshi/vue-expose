// polyfill
import 'intersection-observer';

// 一些情况 透明度为0 // fixed 定位 // report 请求聚合？

export default class Exposure {
  constructor (options) {
    this.options = {
      root: null, // 默认浏览器视口
      rootMargin: '0px', // 视口 margin
      threshold: 0.1, // 暴露比例
      ...options
    }
    this.observeIntsance = null
    this.timerMap = new Map()
    this.uploadKeySet = new Set()
    this.init()
  }
  init () {
    try {
      const self  = this
      this.observeIntsance = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            let reportData = null
            try {
              reportData = JSON.parse(entry.target.getAttribute('goods-data'))
              reportData = {
                once: true,
                ...reportData
              }
            } catch (e) {
              console.error('埋点数据异常', e)
            }
            // 没有埋点数据取消上报
            if (!reportData) {
              self.remove(entry.target)
              return
            }
            if (entry.isIntersecting) {
              this.timerMap.set(reportData.id, setTimeout(() => {
                //上报埋点信息
                reportMsg(reportData).then(res => {
                  if (res.code === 0) {
                    //上报成功后取消监听
                    reportData.once && self.remove(entry.target)
                    self.uploadKeySet.add(reportData.id)
                    self.timerMap.set(reportData.id, null)
                  }
                });
              }, 1000))
            } else {
              clearTimeout(this.timerMap.get(reportData.id))
              this.timerMap.set(reportData.id, null)
            }
          })
        },
        this.options)
    } catch (e) {
      throw new Error(e)
    }
  }

  add (el, binding) {
    const id = setDomGoodsAttr(el, binding)
    if (!id || this.uploadKeySet.has(id))  return
    this.observeIntsance && this.observeIntsance.observe(el)
  }
  remove (el) {
    this.observeIntsance && this.observeIntsance.unobserve(el)
  }
}

const setDomGoodsAttr = (el, binding) => {
  const data = typeof binding.value === 'object' ? binding.value : {
    id: binding.value,
    data: null
  }
  el.setAttribute('goods-data', JSON.stringify(data))
  return data.id
}

const reportMsg = (reportData) => {
  return new Promise((resolve, reject) => {
    const { id, data } = reportData
    console.log('reportMsg', {id, data})
    resolve({
      code: 0,
    })
  })
}