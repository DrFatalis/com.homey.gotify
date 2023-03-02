Gotify is a simple server for sending and receiving messages (in real time per WebSocket) that can be self hosted.
This application will allow you to send messages from Homey flows to your gotify server. 

From your Gotify UI, create a new application(s) (eg. homey-indoor, homey-outdoor) and save the token.

In Homey, create one or multiple device. Each of them needs the server url with port if needed:
    eg. http://192.168.0.2:9084

as well as the application token you saved from the Gotify UI configuration.
That's it !