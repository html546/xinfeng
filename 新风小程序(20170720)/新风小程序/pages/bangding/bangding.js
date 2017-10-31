// pages/bangding/bangding.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inp:'',
    room:'',
    userid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  jianpan:function(e){
    this.setData({
      inp:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 获取序列号
    try{
      var value = wx.getStorageSync('key1')
      if(value){
        // console.log(value)
        that.setData({
          inp:value
        })
      }
    }catch(e){
    }
    wx.getStorage({
      key: 'key2',
      success: function(res) {
        that.setData({
          userid:res.data.nickName
        })
      },
    })
    // 获取房间
    try{
      var value2 = wx.getStorageSync('key3')
      if(value2){
        var str = value2.split(' ');
        var newArr=[];
        for(var i=0;i<str.length;i++){
          if(str[i]&&str[i]!=' '&&str[i]!=undefined){
            newArr.push(str[i]);
          }
        }
        that.setData({
          room:newArr
        })
      }
    }catch(e){
    }
  },
  // 选择房间
  changeinp: function (e) {
    var that = this;
    String.prototype.trim=function(){
      return this.replace(/(^\s*)|(\s*$)/g,'');
    }
    that.setData({
      inp: that.data.inp.trim()+' '+ e.currentTarget.id
    })
    var s = that.data.inp;
    s = s.split(' ');
    if(s.length>2){
      wx.showModal({
        title: '提示',
        content: '绑定房间不得多于一个',
        success:function(res){
          if(res.confirm){
            s.splice(2,s.length-2);
            that.setData({
              inp:s.join(' ')
            })
          }else if(res.cancel){

          }
        }
      })
    }
  },
  // 提交向本地缓存里保存房间绑定的序列号数据
  formSubmit:function(e){  
    var that = this;
    var s = e.detail.value.input;
    s=s.split(' ');
    if(s.length!=2){
      return;
    }
    var l=getApp().my_data.arr.length;
    l = parseInt(l);
    getApp().my_data.arr[l]=s;    
    wx.setStorage({
      key: 'key4',
      data: getApp().my_data.arr
    })
    wx.navigateTo({
      url: '../neishi/neishi',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})