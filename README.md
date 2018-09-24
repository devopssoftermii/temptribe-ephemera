# Ephemera - TempTribe API

## What is this
This is the API for temptribe. It is a node.js application which uses express.js framework.

It is used by the following:

- mobile app
- react web app for admin recruitment
- react web app for staff book interviews
- legacy VB.net app for sending some emails onto the mail queue
- legacy VB.net app for sending notifications onto the mail queue

## Where does it run
It runs in node.js (installed on the windows box) in a windows service.

## How does traffic get to it
Web requests to api.temptribe.co.uk are directred to nginx and passed to the api.

## Start/Stop/Restart
It can be stopped and restarted from the services manager on the server like any other service.

## Why on the same server as the .net app?
The database is located on this server and is not exposed to the outside world. The API needs access to the database so it is located here.

## Good to know

- The API is versioned but most things use v3.
- An ORM called Sequilize is used to interface to the database
- This uses the main SQL Server database located on the production server 


## Error reporting
Errors are reported in Sentry

## Logging
The normal log file output is currently turned off due to an issue where loggin caused a specific error to happen. 

This needs some investigation. As Nginx logs all incoming requests there is a record of what traffic is sent to the api

## Know issues

- The logging issue see the logging section of this readme
- 
