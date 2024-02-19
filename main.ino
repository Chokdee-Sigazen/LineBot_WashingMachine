#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Sigazen"; //change to wifi username
const char* password = "00440044Cc"; //change to wifi-password
const char* ngrokUrl = "http://60f1-2001-44c8-4181-99f4-104f-d916-e904-3cca.ngrok-free.app"; //change to ip
const char* path = "/remove-from-queue"; 

const int sensorPin = D5; 
const int threshold = 150; 
const int soundPin = A0;

int Count = 0;


void setup() {
  Serial.begin(115200);
  delay(100);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  pinMode(soundPin, INPUT);
  pinMode(sensorPin, INPUT);
  sendPostRequest();
}

void loop() {
  int sensorValue = digitalRead(sensorPin);
  int soundValue = analogRead(soundPin);
  Serial.print(soundValue);
  Serial.print(" ");
  Serial.println(sensorValue);
  if (sensorValue == LOW && soundValue >= threshold) {
    Count++;
    if (Count >= 3) {
      sendPostRequest();
      Count = 0;
    }
  }

  delay(200);
}

void sendPostRequest() {
  HTTPClient http;
  WiFiClient client;
  String url = String(ngrokUrl) + path;
  Serial.print("Sending POST request to: ");
  Serial.println(url);
  const char* urlCharArray = url.c_str();
  http.begin(client, urlCharArray);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  int httpResponseCode = http.POST("data=remove_from_queue_data");
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    String payload = http.getString();
    Serial.println("Response payload:");
    Serial.println(payload);
  } else {
    Serial.println("Error sending POST request");
  }
  http.end();
}