var area;
var p = 0,
  c = 0,
  d = 0
Page({
  data: {
    provinceName: [],
    provinceCode: [],
    provinceSelIndex: '',
    cityName: [],
    cityCode: [],
    citySelIndex: '',
    districtName: [],
    districtCode: [],
    districtSelIndex: '',
    showMessage: false,
    messageContent: '',
    showDistpicker: false
  },
  position(cb) {
    wx.request({
      url: 'http://192.168.1.184:7071/catelog/position',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.List)
        cb(res.data.List)
      }
    })
  },
  onLoad: function(options) {
    // 载入时要显示再隐藏一下才能显示数据，如果有解决方法可以在issue提一下，不胜感激:-)
    // 初始化数据
    var that = this
    this.position(function(data) {
      console.log('onLoad')
      console.log(data)

      area = data

      that.setAreaData()

    })


  },
  setAreaData: function(p, c, d) {
    var p = p || 0 // provinceSelIndex
    var c = c || 0 // citySelIndex
    var d = d || 0 // districtSelIndex
      // 设置省的数据
    var province = area
    var provinceName = [];
    var provinceCode = [];
    for (var item in province) {
      provinceName.push(province[item].Name)
      provinceCode.push(province[item].Zip)
    }
    this.setData({
        provinceName: provinceName,
        provinceCode: provinceCode
      })
      // 设置市的数据
    var city = area[p].Children
    var cityName = [];
    var cityCode = [];
    for (var item in city) {
      cityName.push(city[item].Name)
      cityCode.push(city[item].Zip)
    }
    this.setData({
        cityName: cityName,
        cityCode: cityCode
      })
      // 设置区的数据
    var district = city[c].Children
    var districtName = [];
    var districtCode = [];
    for (var item in district) {
      districtName.push(district[item].Name)
      districtCode.push(district[item].Zip)
    }
    this.setData({
      districtName: districtName,
      districtCode: districtCode
    })
  },
  changeArea: function(e) {
    p = e.detail.value[0]
    c = e.detail.value[1]
    d = e.detail.value[2]
    this.setAreaData(p, c, d)
  },
  showDistpicker: function() {
    this.setData({
      showDistpicker: true
    })
  },
  distpickerCancel: function() {
    this.setData({
      showDistpicker: false
    })
  },
  distpickerSure: function() {
    this.setData({
      provinceSelIndex: p,
      citySelIndex: c,
      districtSelIndex: d
    })
    this.distpickerCancel()
  },
  savePersonInfo: function(e) {
    var data = e.detail.value
    var telRule = /^1[3|4|5|7|8]\d{9}$/,
      nameRule = /^[\u2E80-\u9FFF]+$/
    if (data.name == '') {
      this.showMessage('请输入姓名')
    } else if (!nameRule.test(data.name)) {
      this.showMessage('请输入中文名')
    } else if (data.tel == '') {
      this.showMessage('请输入手机号码')
    } else if (!telRule.test(data.tel)) {
      this.showMessage('手机号码格式不正确')
    } else if (data.province == '') {
      this.showMessage('请选择所在地区')
    } else if (data.city == '') {
      this.showMessage('请选择所在地区')
    } else if (data.district == '') {
      this.showMessage('请选择所在地区')
    } else if (data.address == '') {
      this.showMessage('请输入详细地址')
    } else {
      this.showMessage(' 保存成功')
      console.log(data)
    }
  },
  showMessage: function(text) {
    var that = this
    that.setData({
      showMessage: true,
      messageContent: text
    })
    setTimeout(function() {
      that.setData({
        showMessage: false,
        messageContent: ''
      })
    }, 3000)
  }
})