//index.js
//获取应用实例
let app=getApp();
let animationShowHeight=300;

Page({
  onShareAppMessage:function(){
    return {
      title:'新风智能家居小程序',
      path:'/index',
      success:function(){
        console.log('转发成功')
      },
      fail:function(){
        console.log('转发失败')
      }
    }
  },
  data:{
    open:false,
    open2:false,
    cehua1:false,
    cehua2:false,
    animationData:'',
    showModalStatus:false,
    keting:'',
    dizhi:'',
    huanjing1:'空气指数',
    huanjing2:'',
    kongqi1:'空气指数',
    kongqi2:'',
    CO2:'',
    wendu1:'',
    power:'',
    fengsu:'',
    zhishu:100,
    baifenbi:100,
    shijian:'',
    nickName:'',
    userInfoAvatar:'',
    Mac_address:'',
    room:[],
    type:'',
    img1:'../images/kaiguan1.png',
    fengsudang:''
  },
  // 点击获取房间设备参数
  dianji:function(e){
    var that = this;
    this.setData({
      keting: this.data.room[e.currentTarget.dataset.index]
    })
    // 根据本地缓存参数向后台请求数据
    wx.getStorage({
      key: 'key4',
      success: function(res) {
        for(var i=0;i<res.data.length;i++){
          for(var j=0;j<res.data[i].length;j++){
            if(res.data[i][j]===that.data.room[e.currentTarget.dataset.index]){
              getApp().globalData.macAddress = res.data[i][j-1];
              wx.request({
                url: 'https://airclean.store',
                data:{
                  type:'get',
                  macaddress:res.data[i][j-1],
                  userid: getApp().globalData.userid
                },
                method:'GET',
                header:{
                  'Content-Type':'application/json'
                },
                success:function(res){
                  that.setData({
                    huanjing2: res.data[0].pm25,
                    kongqi2: res.data[0].pm10,
                    CO2:res.data[0].co2,
                    wendu1: res.data[0].temperature1 + '/' + res.data[0].temperature2,
                    fengsu:res.data[0].airflow,
                    shijian: res.data[0].time,
                    Mac_address: res.data[0].macaddress
                  })
                  if(res.data[0].power==0){
                    that.setData({
                      power:'关机',
                      img1:'../images/kaiguan.png'
                    })
                  }else if(res.data[0].power==1){
                    that.setData({
                      power:'开机',
                      img1:'../images/kaiguan1.png'
                    })
                  }
                  if (res.data[0].pm25 < 50) {
                    that.setData({
                      kongqi1: '空气清新'
                    })
                  } else if (res.data[0].pm25 > 50 && res.data[0].pm25 < 100) {
                    that.setData({
                      kongqi1: '轻污染'
                    })
                  } else {
                    that.setData({
                      kongqi1: '重度污染'
                    })
                  }
                  if(res.data[0].pm10<50){
                    that.setData({
                      huanjing1:'空气清新'
                    })
                  }else if(res.data[0].pm10>50&&res.data[0].pm10<100){
                    that.setData({
                      huanjing1:'轻污染'
                    })
                  }else{
                    that.setData({
                      huanjing1:'重度污染'
                    })
                  }
                  if(res.data[0].airflow==1){
                    that.setData({
                      fengsudang:'低速'
                    })
                  }else if(res.data[0].airflow==2){
                    that.setData({
                      fengsudang:'中速'
                    })
                  }else if(res.data[0].airflow==3){
                    that.setData({
                      fengsudang:'高速'
                    })
                  }else if(res.data[0].airflow==4){
                    that.setData({
                      fengsudang:'自动'
                    })
                  }
                },
                fail:function(res){
                },
                complete:function(){
                }
              })
            }
          }
        }
      },
    })
  },
  shanchu:function(e){
      var that = this;
      var s=that.data.room;
      var f = e.currentTarget.dataset.index;
      try{
        var value = wx.getStorageSync('key4');
        if(value){
          value.splice(f,1);
          try{
            wx.setStorageSync('key4', value);
          }catch(e){
            console.log(e);
          }
        }
      }catch(e){
      }
      getApp().globalData.newArr = [];
      s.splice(f,1);
      var h =s.join(' ');
      that.setData({
        room:s
      })
      try{
        wx.setStorageSync('key3', h);
      }catch(e){
        console.log(e);
      }
  },
  changeSwitch:function(e){
    console.log(e.detail.value);
  },
  // 侧滑栏
  tap_ch:function(e){
    if(this.data.open){
      this.setData({
        open:false,
        cehua1:false
      });
    }else{
      this.setData({
        open:true,
        cehua1:true
      });
    }
  },
  // 侧滑栏
  tap_ch2:function(e){
    if(this.data.open2){
      this.setData({
        open2:false,
        cehua2:false
      });
    }else{
      this.setData({
        open2:true,
        cehua2:true
      });
    }
  },
  changeRoom:function(e){
    wx.navigateTo({
      url: '../neishi/neishi',
    })
  },
  // 扫码识别二维码
  saoyisao:function(e){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var mac_address = res.result;
        wx.setStorage({
          key: 'key1',
          data: mac_address
        })
      }
    })
  },
  showModal:function(){
    var animation = wx.createAnimation({
      duration:200,
      timingFunction:"linear",
      delay:0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData:animation.export(),
      showModalStatus:true
    })
    setTimeout(function(){
      animation.translateY(0).step()
      this.setData({
        animationData:animation.export()
      })
    }.bind(this),200)
  },
  hideModal:function(e){
    var animation=wx.createAnimation({
      duration:200,
      timingFunction:"linear",
      delay:0
    })
    this.animation =animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData:animation.export(),
    })
    setTimeout(function(){
      animation.translateY(0).step()
      this.setData({
        animationData:animation.export(),
        showModalStatus:false
      })
    }.bind(this),200)
  },
  hideModal2:function(){
    wx.makePhoneCall({
      phoneNumber: '4001066609',
    })
  },
  // 一进页面就加载数据
  onshow:function(){
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        animationShowHeight = res.windowHeight;
      },
    })
    wx.getUserInfo({
      success: function (res) {
        getApp().globalData.userid = res.userInfo.nickName;
        that.setData({
          nickName: res.userInfo.nickName,
          userInfoAvatar: res.userInfo.avatarUrl,
          encryptedData: res.encryptedData,
          keting: getApp().globalData.roomName
        })
        if (getApp().globalData.roomName == null) {
          that.setData({
            keting: getApp().globalData.room1
          })
        }
        wx.setStorage({
          key: 'key2',
          data: {
            nickName: res.userInfo.nickName,
            userInfoAvatar: res.userInfo.avatarUrl,
            userID: res.encryptedData
          },
        })
      },
      fail: function (res) {
      },
      complete: function () {
      }
    });
    if (getApp().globalData.macAddress == null) {
      try {
        var value6 = wx.getStorageSync('key4');
        if (value6) {
          getApp().globalData.macAddress = value6[0][0];
          getApp().globalData.room1 = value6[0][1];
        }
      } catch (e) {
      }
    }
    wx.request({
      url: 'https://airclean.store',
      data: {
        type: 'get',
        macaddress: getApp().globalData.macAddress,
        userid: getApp().globalData.userid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          huanjing2: res.data[0].pm25,
          kongqi2: res.data[0].pm10,
          CO2: res.data[0].co2,
          wendu1: res.data[0].temperature1 + '/' + res.data[0].temperature2,
          fengsu: res.data[0].airflow,
          shijian: res.data[0].time,
          Mac_address: res.data[0].macaddress,
        })
        if (res.data[0].power == 0) {
          that.setData({
            power: '关机',
            img1: '../images/kaiguan.png'
          })
        } else if (res.data[0].power == 1) {
          that.setData({
            power: '开机',
            img1: '../images/kaiguan1.png'
          })
        }
        if (res.data[0].pm25 < 50) {
          that.setData({
            kongqi1: '空气清新'
          })
        } else if (res.data[0].pm25 > 50 && res.data[0].pm25 < 100) {
          that.setData({
            kongqi1: '轻污染'
          })
        } else {
          that.setData({
            kongqi1: '重度污染'
          })
        }
        if (res.data[0].pm10 < 50) {
          that.setData({
            huanjing1: '空气清新'
          })
        } else if (res.data[0].pm10 > 50 && res.data[0].pm10 < 100) {
          that.setData({
            huanjing1: '轻污染'
          })
        } else {
          that.setData({
            huanjing1: '重度污染'
          })
        }
        if (res.data[0].airflow == 1) {
          that.setData({
            fengsudang: '低速'
          })
        } else if (res.data[0].airflow == 2) {
          that.setData({
            fengsudang: '中速'
          })
        } else if (res.data[0].airflow == 3) {
          that.setData({
            fengsudang: '高速'
          })
        } else if (res.data[0].airflow == 4) {
          that.setData({
            fengsudang: '自动'
          })
        }
      },
      fail: function (res) {
      },
      complete: function () {
      }
    })
    try {
      var value = wx.getStorageSync('key3')
      if (value) {
        var str = value.split(' ');
        for (var i = 0; i < str.length; i++) {
          that.data.room.push(str[i]);
        }
        var s = that.data.room;
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
          room: newArr
        })
      }
    } catch (e) {
    }

  },
  // 获取用户信息
  onLoad: function (options){
    this.loadInfo();
      var that =this;
      wx.getUserInfo({
        success:function(res){
          getApp().globalData.userid = res.userInfo.nickName;
          that.setData({
            nickName:res.userInfo.nickName,
            userInfoAvatar:res.userInfo.avatarUrl,
            encryptedData: res.encryptedData,
            keting:getApp().globalData.roomName
          })
          if(getApp().globalData.roomName==null){
            that.setData({
              keting: getApp().globalData.room1
            })
          }
          wx.setStorage({
            key: 'key2',
            data: {
              nickName:res.userInfo.nickName,
              userInfoAvatar:res.userInfo.avatarUrl,
              userID: res.encryptedData
            },
          })
        },
        fail:function(res){
        },
        complete:function(){
        }
      });
      if(getApp().globalData.macAddress==null){
        try{
          var value6 = wx.getStorageSync('key4');
          if(value6){
            getApp().globalData.macAddress = value6[0][0];
            getApp().globalData.room1 = value6[0][1];
          }
        }catch (e){
        }
      }
      wx.request({
        url: 'https://airclean.store',
        data: {
          type: 'get',
          macaddress: getApp().globalData.macAddress,
          userid: getApp().globalData.userid
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            huanjing2: res.data[0].pm25,
            kongqi2: res.data[0].pm10,
            CO2: res.data[0].co2,
            wendu1: res.data[0].temperature1 + '/' + res.data[0].temperature2,
            fengsu: res.data[0].airflow,
            shijian: res.data[0].time,
            Mac_address: res.data[0].macaddress,
          })
          if(res.data[0].power==0){
            that.setData({
              power:'关机',
              img1:'../images/kaiguan.png'
            })
          }else if(res.data[0].power==1){
            that.setData({
              power:'开机',
              img1:'../images/kaiguan1.png'
            })
          }
          if(res.data[0].pm25<50){
            that.setData({
              kongqi1:'空气清新'
            })
          }else if(res.data[0].pm25>50&&res.data[0].pm25<100){
            that.setData({
              kongqi1:'轻污染'
            })
          }else{
            that.setData({
              kongqi1:'重度污染'
            })
          }
          if (res.data[0].pm10 < 50) {
            that.setData({
              huanjing1: '空气清新'
            })
          } else if (res.data[0].pm10 > 50 && res.data[0].pm10 < 100) {
            that.setData({
              huanjing1: '轻污染'
            })
          } else {
            that.setData({
              huanjing1: '重度污染'
            })
          }
          if (res.data[0].airflow == 1) {
            that.setData({
              fengsudang: '低速'
            })
          } else if (res.data[0].airflow == 2) {
            that.setData({
              fengsudang: '中速'
            })
          } else if (res.data[0].airflow == 3) {
            that.setData({
              fengsudang: '高速'
            })
          } else if (res.data[0].airflow == 4) {
            that.setData({
              fengsudang: '自动'
            })
          }
        },
        fail: function (res) {
        },
        complete: function () {
        }
      })
      var that = this;
      try {
        var value = wx.getStorageSync('key3')
        if (value) {
          var str = value.split(' ');
          for (var i = 0; i < str.length; i++) {
            that.data.room.push(str[i]);
          }
          var s = that.data.room;
          var newArr = new Array();
          function replaceEmptyItem(s) {
            for (var i = 0; i < s.length; i++) {
              if (s[i] && s[i] != ' ' && s[i] != undefined) {
                newArr.push(s[i]);
              }
            }
          }
          replaceEmptyItem(s);
          for(var i = 0;i<newArr.length;i++){
            for(var j = i+1;j<newArr.length;j++){
              if(newArr[i]==newArr[j]){
                newArr.splice(j,1);
              }
            }
          }
          that.setData({
            room: newArr
          })
        }
      } catch (e) {
      }
  },
  changeTab:function(){
    wx.switchTab({
      url: '../dingzhi/dingzhi',
    })
  },
  // 刷新发送请求
  shuaxin:function(e){
    var that = this;
    wx.request({
      url: 'https://airclean.store',
      data: {
        type: 'get',
        macaddress: getApp().globalData.macAddress,
        userid: getApp().globalData.userid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          huanjing2: res.data[0].pm25,
          kongqi2: res.data[0].pm10,
          CO2: res.data[0].co2,
          wendu1: res.data[0].temperature1 + '/' + res.data[0].temperature2,
          fengsu: res.data[0].airflow,
          shijian: res.data[0].time,
          Mac_address: res.data[0].macaddress
        })
        if (res.data[0].power == 0) {
          that.setData({
            power: '关机',
            img1: '../images/kaiguan.png'
          })
        } else if (that.data[0].power == 1) {
          that.setData({
            power: '开机',
            img1: '../images/kaiguan1.png'
          })
        }
        if (res.data[0].pm25 < 50) {
          that.setData({
            kongqi1: '空气清新'
          })
        } else if (res.data[0].pm25 > 50 && res.data[0].pm25 < 100) {
          that.setData({
            kongqi1: '轻污染'
          })
        } else {
          that.setData({
            kongqi1: '重度污染'
          })
        }
        if (res.data[0].pm10 < 50) {
          that.setData({
            huanjing1: '空气清新'
          })
        } else if (res.data[0].pm10 > 50 && res.data[0].pm10 < 100) {
          that.setData({
            huanjing1: '轻污染'
          })
        } else {
          that.setData({
            huanjing1: '重度污染'
          })
        }
        if (res.data[0].airflow == 1) {
          that.setData({
            fengsudang: '低速'
          })
        } else if (res.data[0].airflow == 2) {
          that.setData({
            fengsudang: '中速'
          })
        } else if (res.data[0].airflow == 3) {
          that.setData({
            fengsudang: '高速'
          })
        } else if (res.data[0].airflow == 4) {
          that.setData({
            fengsudang: '自动'
          })
        }
      },
      fail: function (res) {
      },
      complete: function () {
      }
    })
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
        var dizhi = res.data.result.formatted_address;
        page.setData({
          city: city,
          dizhi: dizhi
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
  // 改变开关机状态
  openOrClose:function(){
    var that = this;
    if(that.data.power=='关机'){
      that.setData({
        power:'开机',
        img1:'../images/kaiguan1.png'
      })
    }else if(that.data.power=='开机'){
      that.setData({
        power:'关机',
        img1:'../images/kaiguan.png'
      })
    };
    wx.request({
      url: 'https://airclean.store',
      data:{
        type:'set',
        macaddress: getApp().globalData.macAddress,
        userid: getApp().globalData.userid,
        power:that.data.power=='开机'?1:0
      },
      method:'GET',
      header:{
        'content-type':'application/json'
      },
      success:function(res){
      }
    })
  },
  // 改变风速
  changeFeng:function(){
    var that = this;
    if(that.data.fengsu<4){
      that.setData({
        fengsu:++that.data.fengsu
      })
    }else if(that.data.fengsu===4){
      that.setData({
        fengsu:1
      })
    };
    if (that.data.fengsu == 1) {
      that.setData({
        fengsudang: '低速'
      })
    } else if (that.data.fengsu == 2) {
      that.setData({
        fengsudang: '中速'
      })
    } else if (that.data.fengsu == 3) {
      that.setData({
        fengsudang: '高速'
      })
    } else if (that.data.fengsu == 4) {
      that.setData({
        fengsudang: '自动'
      })
    }
  wx.request({
    url: 'https://airclean.store',
    data: {
      type: 'set',
      macaddress: getApp().globalData.macAddress,
      userid: getApp().globalData.userid,
      airflow: that.data.fengsu
    },
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
    }
  })
  },
  fanhui:function(e){
    if (this.data.room == '') {
      wx.clearStorage();
      getApp().my_data.arr = [];
    }
    wx.navigateTo({
      url: '../neishi/neishi'
    })
  }
})
