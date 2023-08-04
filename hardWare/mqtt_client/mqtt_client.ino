#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#define LED 2

// WiFi
const char *ssid = "";     // 无线网名称
const char *password = ""; // 无线网密码

// MQTT Broker
const char *mqtt_broker = "";   // mqtt服务连接地址
const char *topic = "";         // 订阅主题
const char *mqtt_username = ""; // 用户名
const char *mqtt_password = ""; // 管理密码
const int mqtt_port = ;         // mqtt服务端口
const char *root_ca = ;         // mqttCA证书证书

WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup()
{
  // 初始化串口监视器
  Serial.begin(115200);
  // 连接局域网
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println("Connecting to WiFi..");
    flash(); // 连接成功后ESP32指示灯闪烁
  }
  Serial.println("Connected to the WiFi network");
  client.setServer(mqtt_broker, mqtt_port); // 连接mqtt服务端
  espClient.setCACert(root_ca);             // 设置CA证书
  client.setCallback(callback);             // 设置订阅消息处理函数
  while (!client.connected())
  {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public mqtt broker\n", client_id.c_str());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password))
    {
      Serial.println("Public emqx mqtt broker connected");
    }
    else
    {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  // 发布订阅消息
  client.publish(topic, "hello emqx");
  client.subscribe(topic);
}

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  StaticJsonDocument<200> jsonDoc;                                        // 创建一个JsonDocument对象来存储解析后的JSON数据
  DeserializationError error = deserializeJson(jsonDoc, payload, length); // 将payload数据解析为JsonDocument对象
  if (error)
  {
    Serial.print("JSON parsing failed! Error code: ");
    Serial.println(error.c_str());
    return;
  }
  // 使用JsonDocument对象操作解析后的数据
  //  const char* message = jsonDoc["msg"];
  // 这里的逻辑可以自行更换，我只是简单的点亮ESP32板上LED
  int value = jsonDoc["value"];
  if (value == 1)
  {
    changeState(true);
  }
  else
  {
    changeState(false);
  };
  Serial.print("value: ");
  Serial.println(value);
  Serial.println("-----------------------");
}

void loop()
{
  client.loop(); // 保持mqtt连接心跳
}
// 闪灯函数
void flash()
{
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
  delay(100);
  digitalWrite(LED, LOW);
  delay(100);
  digitalWrite(LED, HIGH);
  delay(100);
  digitalWrite(LED, LOW);
  delay(100);
  digitalWrite(LED, HIGH);
  delay(1500);
  digitalWrite(LED, LOW);
}
// 设备开启和关闭函数
void changeState(bool flag)
{
  pinMode(LED, OUTPUT);
  if (flag)
  {
    //    开启设备
    digitalWrite(LED, HIGH);
  }
  else
  {
    //    关闭设备
    digitalWrite(LED, LOW);
  }
}
