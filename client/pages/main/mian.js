import Message from 'tdesign-miniprogram/message/index';
const globalData = getApp().globalData;

Page({

  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.subMessage(globalData.client);
    this.pubMessage(globalData.client, {
      "msg": "设备成功订阅！！!"
    });
    globalData.client.on("connect", () => {
      wx.hideLoading();
    })
  },
  // 消息订阅函数
  subMessage: function (client) {
    // 信息监听事件
    client.on("message", (topic, message) => {
      console.log("收到消息", JSON.parse(message.toString()).msg)
      this.showBtnMessage(JSON.parse(message.toString()).msg);
    })
  },
  // 消息发布函数
  pubMessage: function (client, msg) {
    client.publish(globalData.topic, msg, (error) => {
      if (!error) {
        // 发布成功
        // wx.showToast({
        //   title: '发送成功',
        //   duration: 1500,
        //   icon: "none"
        // })
      } else {
        wx.showToast({
          title: '发送失败',
          duration: 1500,
          icon: "error"
        })
      }
    })
  },
  // 消息展示函数
  showBtnMessage: function (msg) {
    Message.info({
      context: this,
      icon: 'notification-filled',
      offset: ['100rpx', '32rpx'],
      duration: 2000,
      content: msg,
    });
  },
  // 开启设备
  openDevice: function () {
    this.pubMessage(globalData.client, `{"msg":"设备开启","value":"1"}`)
  },
  // 关闭设备
  closeDevice: function () {
    this.pubMessage(globalData.client, `{"msg":"设备关闭","value":"0"}`)
  },
  onUnload() {
    console.log("页面卸载，连接关闭！")
    globalData.client.end()
  },

})