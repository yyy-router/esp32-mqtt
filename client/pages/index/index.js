import {
  host,
  port,
  topic,
  options
} from "../../utils/config";
import mqtt from "../../utils/mqtt.min";
const globalData = getApp().globalData;
Page({
  data: {
    host: host,
    port: port,
    username: "",
    password: "",
    // 默认是一号设备
    topic: topic,
    // 重连时间间隔 1000毫秒
    reconnectPeriod: 1000,
    // 连接超时时间间隔 30秒
    connectTimeout: 30 * 1000,
    product: {
      options,
      value: topic
    }
  },
  // 下拉框函数
  onChange: function (e) {
    this.setData({
      'product.value': e.detail.value,
      topic: e.detail.value
    });
    globalData.topic = e.detail.value;
  },
  connectMqtt: function () {
    let clientId = "mqtt_" + Math.random().toString(16).substr(2, 8);
    const options = {
      username: this.data.username,
      password: this.data.password,
      clientId,
      connectTimeout: this.data.connectTimeout,
      reconnectPeriod: this.data.reconnectPeriod
    }
    // 非空校验
    if (this.data.username && this.data.password && this.data.topic) {
      wx.showLoading({
        title: '连接订阅中',
      })
      globalData.client = mqtt.connect(`${this.data.host}:${this.data.port}/mqtt`, options)
      globalData.client.on("connect", () => {
        console.log("连接成功")
        //订阅消息
        globalData.client.subscribe(this.data.topic, {
          qos: 0
        }, (error) => {
          if (!error) {
            console.log("订阅成功")
            wx.hideLoading();
            wx.showToast({
              title: '订阅成功',
              duration: 1500
            });
            wx.navigateTo({
              url: '/pages/main/mian',
            });
            // 跳转到详情页进行消息订阅和发布
          }
        })
      })

      globalData.client.on("error", () => {
        console.log("连接失败")
        wx.showToast({
          title: '连接失败',
          duration: 2000,
          icon: "error"
        })
      })
      globalData.client.on("reconnect", () => {
        console.log("正在重连")
        wx.showLoading({
          title: '重连中...',
        })
      })
    } else {
      wx.showToast({
        title: '信息填写不完整',
        duration: 1000,
        icon: "error"
      })
    }
  },

  getUsername: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  getPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    globalData.topic = this.data.topic;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})