#### 项目简介

> + 本项目前端使用微信小程序原生开发
> + 后端使用[EMQX Cloud: 全托管的 MQTT 消息云服务](https://www.emqx.com/zh/cloud)平台提供的免费mqtt服务
> + 硬件部分使用ESP32芯片

##### 前端部分

> + 界面使用了[TDesign](https://tdesign.tencent.com/)作为UI框架
> + 使用了mqttjs库

###### 使用方法：

> + 先在EMQX平台注册账号，并开启一个mqtt云空间
> + 在后台设置管理员和密码，并开启若干订阅主题
> + 将后台信息，配置到前端`client/utils`文件路径下的`config.js`中
>
> ```
> 注意事项：
> 这里如果是在本地调试小程序，需要在项目配置里勾选，不校验域名选项；
> 如果是想真机调试，则需要在小程序后台配置域白名单。
> PS：现在微信小程序，可以一键生成app
> ```

##### 硬件部分

> + 因为使用的是ESP32芯片，则先需要安装[arduinoIDE](https://www.arduino.cc/en/software/)
> + 详情请参照博客[安装 Arduino 开发环境 | 极客侠GeeksMan](https://docs.geeksman.com/esp32/Arduino/02.esp32-arduino-install.html#下载-arduino)
> + 本项目主要使用如下几个依赖，均需要手动安装
>
> ```
> 1.PubSubClient
> 2.WiFiClientSecure
> 3.ArduinoJson
> ```
>
> + 在`hardWare`文件中的`mqtt_client.ino`配置无线网名称和密码，以及mqtt的相关配置
>
> ```
> 这里的mqtt相关的配置均可以在EMQX后台查看。
> 这里有一个特别坑的地方，必须得配置CA证书：
> 先在EMQX后台下载到本地，然后需要更改证书格式，才可以拿到mqtt_client文件中配置，具体格式可以参考下面链接：
> https://stackoverflow.com/questions/72465786/esp32-pubsubclient-connection-with-self-signed-certificate-fails-with-state-2
> ```
>
> + 配置完成后，将代码通过数据线烧录到ESP32当中。

###### 调试硬件

> + 可以打开串口监视器，看芯片打印出来的日志
> + 如果配置选项正确的话，可以观察到的现象如下
>
> ```
> 片上LDE先闪烁几下，表示网络连接成功；
> 然后可以看到监视器打印出Public emqx mqtt broker connected，即表示mqtt服务连接正确；
> 此时便可以用MQTTX工具进行测试了，也可以直接用小程序端测试；
> 在上面两端中发送数据，端口监视器上会打印出来；
> 如何有问题，未显示连接成功字样，大概率是mqtt配置信息有误，请去mqtt后台查看配置。
> ```

##### 项目意义

该项目把软件和硬件通过mqtt服务连接起来，实现了远程控制硬件。ESP32的拓展有很多，网络层面跑通了，后面有很多的可玩性。可以做远程开关，远程浇花等功能。



