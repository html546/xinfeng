//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    city: '',
    address:''
  },
  onLoad: function (options) {
    this.loadInfo();
  },
  loadInfo: function () {
    var page = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success 
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=rhTGloILiQFFoZR004rm6wz4pn2c22t3&callback=renderReverse&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=1', data: {},
          success: function (ops) {
          }
        })
      },
      fail: function () {
        // fail 
      },
      complete: function () {
        // complete 
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=rhTGloILiQFFoZR004rm6wz4pn2c22t3&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success 
        var city = res.data.result.addressComponent.city;
        var address = res.data.result.formatted_address;
        page.setData({
          city:city,
          address:address
        })
      },
      fail: function () {
        // fail 
      },
      complete: function () {
        // complete 
      }
    })
  },
  changeTab:function(e){
    wx.switchTab({
      url:"../person/person"
    })
  },
  formSubmit:function(e){
    wx.request({
      url: 'https://airclean.store',
      data:{
        type:'set',
        dizhi:e.detail.value.address
      },
      method:'Get',
      header:{
        'Content-Type':'application/json'
      },
      success:function(res){
      },
      fail:function(){
      },
      complete:function(){
      }
    })
  },
  formReset:function(e){
    var that = this;
    var formData = e.detail.value;
    wx.request({
      url: 'https://airclean.store',
      data:formData,
      header:{
        'Content-Type':'application/json'
      },
      success:function(res){
      }
    })
  }
}) 