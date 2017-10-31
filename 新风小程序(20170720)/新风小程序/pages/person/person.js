// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inp:'',
    fangjian:'',
    userid:''
  },
  // 添加房间
  changeinp:function(e){
    this.setData({
      inp:e.target.id+' '+this.data.inp
    })
  },
  // 提交房间
  formSubmit:function(e){
    var that = this;
    try{
      var value = wx.getStorageSync('key2');
      if(value){
        that.setData({
          userid:value.nickName
        })
      }
    }catch(e){
    };
    wx.navigateTo({
      url: '../neishi/neishi'
    })
    // 将添加结果
    wx.setStorageSync('key3', e.detail.value.input)
  },
  // 表单重置
  formReset:function(e){
    this.setData({
      inp:''
    })
  },
  changePage:function(){
    wx.navigateTo({
      url: '../neishi/neishi',
    })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  },
  debug:true
})