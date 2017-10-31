// pages/dingzhi/dingzhi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],
    index:0,
  },
  // 选择器改变值事件
  bindPickerChange:function(e){
    var that = this;
    that.setData({
      index:e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */


  changeModel:function(e){
    this.setData({
      userCellId:e.currentTarget.dataset.index
    })
  },
  onLoad: function (options) {
    var that = this;
    try {
      var value = wx.getStorageSync('key3')
      if (value) {
        var str = value.split(' ');
        for (var i = 0; i < str.length; i++) {
          that.data.array.push(str[i]);
        }
        var s = that.data.array;
        var newArr = new Array();
        function replaceEmptyItem(s) {
          for (var i = 0; i < s.length; i++) {
            if (s[i] && s[i] != ' ' && s[i] != undefined) {
              newArr.push(s[i]);
            }
          }
        }
        replaceEmptyItem(s);
        that.setData({
          array: newArr
        })
      }
    } catch (e) {
    }




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
    this.setData({
      modal:[
        {id:'0',dizhi:'马尔代夫'},
        {id:'1',dizhi:'九寨沟'},
        {id:'2',dizhi:'巴厘岛'},
        {id:'3',dizhi:'夜间模式'}
      ],
      userCellId:0
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
  
  },
  formSubmit:function(e){
    var that = this;
      wx.request({
        url: 'https://airclean.store',
        data:{
          type:'set',
          input:e.detail.value.input,
          mode:Number(e.detail.switch1),
          icon:e.detail.value.icon,
          night:Number(e.detail.value.switch2)
        },
        method:'GET',
        header:{
          'Content-Type':'application/json'
        },
        success:function(){
          console.log('submit success');
        },
        fail:function(){
          console.log('submit fail');
        },
        complete:function(){
          console.log('submit complete')
        }
      }),
      wx.setStorage({
        key: 'key',
        data: 'e.detail.value',
      })
  }
})