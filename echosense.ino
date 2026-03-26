#include <FS.h>
#include <SPIFFS.h>
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "EchoSense";
const char* password = "12345678";  // Minimum 8 chars

const int squarePin = 16;
const int circlePin = 2;
const int crossPin = 15;
const int trianglePin = 4;

const int upPin = -1;
const int rightPin = -1;
const int downPin = -1;
const int leftPin = -1;

const int psPin = 17;

WebServer server(80);

void serveFile(const String& path) {
  if (SPIFFS.exists(path)) {
    File file = SPIFFS.open(path, "r");
    String contentType = "text/html";
    if (path.endsWith(".js")) {
      contentType = "application/javascript";
    } else if (path.endsWith(".css")) {
      contentType = "text/css";
    } else if (path.endsWith(".json")) {
      contentType = "application/json";
    }
    server.streamFile(file, contentType);
    file.close();

  } else {
    server.send(404, "text/plain", "File not found");
  }
}

void buttonPress() {
  String pin = server.pathArg(0);
  int gpio = pin.toInt();

  digitalWrite(gpio, HIGH);
  delay(100);
  digitalWrite(gpio, LOW);

  server.send(200, "text/plain", "GPIO " + pin + " turned ON");
}

void buttonHold() {
  String pin = server.pathArg(0);
  String state = server.pathArg(1);
  String holdMs = server.pathArg(2);
  int gpio = pin.toInt();
  
  digitalWrite(gpio, HIGH);
  delay(holdMs.toInt());
  digitalWrite(gpio, LOW);

  server.send(200, "text/plain", "GPIO " + pin + " turned ON");
}

void handleRoot() {
  serveFile("/index.html");
}

void setup() {
  Serial.begin(115200);

  WiFi.softAP(ssid, password);
  Serial.println("Access Point Started");
  Serial.print("IP address: ");
  Serial.println(WiFi.softAPIP());

  /**
   * TODO: Setup rest of pins here
   * 
   * Pin 16 = Cross
   * ...
   */
  pinMode(15, OUTPUT);

  // Web server route
  server.on("/", HTTP_GET, handleRoot);
  server.on("/gpio/<int>", HTTP_GET, buttonPress);
  server.on("/gpio/<int>/hold/<int>", HTTP_GET, buttonHold);

  server.begin();
}

void loop() {
  server.handleClient();
}
