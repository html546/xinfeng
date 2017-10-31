// pages/neishi/neishi.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rooms:[],
    macAddress:'',
    userid:''
  },
// 跳转页面
  bianji:function(e){
    wx.switchTab({
      url: '../dingzhi/dingzhi',
    })
  },
  changePage:function(e){
    wx.switchTab({
      url: '../bangding/bangding',
    })
  },
  // 调取扫码API，获取mac_address
  saoyisao: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        that.setData({
          macAddress:res.result
        })
        wx.setStorage({
          key: 'key1',
          data: that.data.macAddress
        })
        wx.switchTab({
          url: '../bangding/bangding'
        })
      },
      fail:(res) =>{
      },
      complete:(res) =>{
      }
    })
  },
  // 选择房间
  changeRoom1:function(e){
    getApp().globalData.num=e.currentTarget.dataset.id;
    var that = this;
    getApp().globalData.roomNum=e.currentTarget.dataset.id;
    try{
      var value5=wx.getStorageSync('key4');
      if(value5){
        for(var k = 0;k<value5.length;k++){
          for(var u = k+1;u<value5.length;u++){
            if(value5[k][1]==value5[u][1]){
              value5.splice(k,1);
            }
          }
        }
        // 如果点击房间名与本地缓存的对应房间名相等走这里
        if(that.data.rooms[e.currentTarget.dataset.id]['roomName']===value5[e.currentTarget.dataset.id][1]){
          getApp().globalData.macAddress = value5[e.currentTarget.dataset.id][0];
          getApp().globalData.roomName = value5[e.currentTarget.dataset.id][1];
          // 如果点击房间名与本地缓存的对应房间名不相等走这里
        }else if(that.data.rooms[e.currentTarget.dataset.id]['roomName']!=value5[e.currentTarget.dataset.id][1]){
          // console.log('333');
        for(var k=0;k<value5.length;k++){
          if(that.data.rooms[e.currentTarget.dataset.id]['roomName']===value5[k][1]){
            getApp().globalData.macAddress = value5[k][0];
            getApp().globalData.roomName = value5[k][1];
          }
        }   
      }
        
      }
    }catch(e){
    }
    if (that.data.rooms[e.currentTarget.dataset.id]['color'] =='#2eb0ea'){
      wx.switchTab({
        url: '../index/index',
        success:function(e){
          var page = getCurrentPages().pop();
          if(page == undefined || page == null) return;
          page.onLoad();
        }
      })
    }else if(that.data.rooms[e.currentTarget.dataset.id]['color']=='#ddd'){
      wx.scanCode({
        success:(res)=>{
          that.setData({
            macAddress: res.result
          })
          wx.setStorage({
            key: 'key1',
            data: that.data.macAddress,
          })
          wx.switchTab({
            url: '../bangding/bangding',
          })
        },
        fail: (res) => {
        },
        complete: (res) => {
        }
      })
    }
  },
  // 按钮滑动事件
  huadong:function(e){
    var that = this;
    var s = e.target.dataset.id;
    that.data.rooms[s].checked=!that.data.rooms[s].checked;
    var b= that.data.rooms[s].checked;
    b=Number(b);
    try{
      var value=wx.getStorageSync('key4')
      if(value){
        that.setData({
          macAddress:value[s][0]
        })
      }
    } catch (e) {
    }
    if(that.data.macAddress==''){
      return;
    }
    wx.request({
      url: 'https://airclean.store',
      data:{
        type:'set',
        macaddress: that.data.macAddress,
        userid: that.data.userid,
        power:b
      },
      method:'GET',
      header:{
        'content-type':'application/json'
      },
      success:function(msg){
      },
      fail:function(msg){
      },
      complete:function(){
      }
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
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        getApp().globalData.userid = res.userInfo.nickName;
        wx.setStorage({
          key: 'key2',
          data: {
            nickName: getApp().globalData.userid,
            userInfoAvatar: res.userInfo.avatarUrl,
            userID: res.encryptedData
          },
        })
        that.setData({
          userid: getApp().globalData.userid
        })
      },
      fail: function (res) {
      },
      complete: function () {
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'key2',
      success: function(res) {
        getApp().globalData.userid = res.data.nickName;
      },
      fail:function(){
      },
      complete:function(){
      }
    })
    wx.getStorage({
      key: 'key3',
      success: function(res) {
        if(res.data == ''){
          wx.showModal({
            title: '提示',
            content: '请前往房间设置页设置房间',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../person/person',
                })
              } else if (res.cancel) {
              }
            }
          });
          return;
        }else if(res.data.length==1){
            var s = res.data.split('');
        }else if(res.data.length>1){
            var s =res.data.split(' ');
        }
        var str=[];
        for(var i=0;i<s.length;i++){
          if(s[i]&&s[i]!=' '&&s[i]!=undefined){
            str.push(s[i])
          }
        }
        let newArr = getApp().globalData.newArr;
        for(let i=0;i<str.length;i++){
          newArr.push({'id':i,'roomName':str[i],'color':'#ddd','roomSrc':'../images/ciwo@2x.png','size':'...','checked':false,'refreshSrc':'../images/grayrefresh@2x.png'});
        }
        for (var i=0;i<newArr.length;i++){
            for(var s=i+1;s<newArr.length;s++){
              if(newArr[i]['roomName'] == newArr[s]['roomName']){
                newArr.splice(s,1);
              }
            }
        }
        that.setData({
          rooms:newArr
        })
        try{
          var value = wx.getStorageSync('key4');
          if(value){
            for(var k = 0;k<value.length;k++){
              for(var u = k+1;u<value.length;u++){
                if(value[k][1]==value[u][1]){
                  value.splice(k,1);
                }
              }
            }
            for (let k = 0; k < newArr.length; k++) {
              for (let j = 0; j < value.length; j++) {
                var jiami1 = escape(value[j][1]);
                var jiami2 = escape(newArr[k]['roomName']);
                if(jiami1===jiami2){
                  wx.request({
                    url: 'https://airclean.store',
                    data: {
                      type: 'get',
                      macaddress: value[j][0],
                      userid: getApp().globalData.userid 
                      },
                      method:"GET",
                      header: {
                        'content-type': 'application/json'
                      },
                      async: false,
                      success: function (res) {
                        newArr[k]['color'] = '#2eb0ea';
                        newArr[k]['roomSrc'] = '../images/zhuwo@2x.png';
                        newArr[k]['checked'] = Number(res.data[0].power);
                        newArr[k]['refreshSrc'] = '../images/refresh@2x.png';
                        newArr[k]['size'] = res.data[0].pm25;
                        that.setData({
                          rooms: newArr
                        })
                      }
                  });             
                }
              }
            }
          }
        }catch(e){
        }
      },
      fail:function(){
        wx.showModal({
          title: '提示',
          content: '请前往房间设置页设置房间',
          success:function(res){
            if(res.confirm){
              wx.switchTab({
                url: '../person/person',
              })
            }else if(res.cancel){
            }
          }
        })
      }
    })
  },
  // 刷新事件
  refresh: function (e) {
    var s = e.currentTarget.dataset.id;
    var that = this;
    try {
      var value = wx.getStorageSync('key4')
      if (value) {
        that.setData({
          macAddress: value[s][0]
        })
      }
    } catch (e) {
    }
    if(that.data.macAddress==''){
      return;
    }
    wx.request({
      url: 'https://airclean.store',
      data: {
        type: 'get',
        macaddress: that.data.macAddress,
        userid: that.data.userid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var param={};
        var string = "rooms["+s+"].size";
        param[string]=res.data[0].pm25;
        that.setData(param);
      },
      fail: function (res) {
      },
      complete: function () {
      }
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