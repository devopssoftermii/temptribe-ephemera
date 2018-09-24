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
It runs in node.js (installed on the windows box) as a service under a local service account.

## Environment Config
Ephemera’s per-installation configuration is in ENV file format, in .env in its root directory. Example configuration fields can be found in .env.example

## How does traffic get to it
Web requests to api.temptribe.co.uk are directred to nginx and passed to the api.

## Start/Stop/Restart
It can be stopped and restarted from the services manager on the server like any other windows service.

## API Versions
It currently serves two versions of the API (v2 / v3) - however, v2 is considered deprecated and is not used by anything anymore, except in some cases a very old and unsupported version of the TT mobile app. v3 is not backwards-compatible with v2 due to response format changes between the two, and v2 should generally not be used.

## Why on the same server as the .net app?
The database is located on this server and is not exposed to the outside world. The API needs access to the database so it is located here.

## Authentication to use the API
The API is split at the first level into authenticated (/private) and unauthenticated (/public) endpoints. Unauthenticated endpoints provide login and session refresh functionality, while everything else sits behind the authentication middleware. Initial login provides two JWTs - a short-lived access token for making user claims, and a long-lived refresh token for refreshing a session against the database. A 401 response to an access token-authenticated request should, in the first instance, provoke an attempted session refresh using the stored refresh token, followed by a repeated attempt at the initial request, without displaying the 401 to the end user. The ephemera-client JS library handles this functionality transparently, to ensure that sessions appear uninterrupted while still ensuring that each session is occasionally checked against the database for validity.

## Good to know

- The API is versioned but most things use v3.
- An ORM called Sequilize is used to interface to the database
- This uses the main SQL Server database located on the production server
- The data layer is available at all times to requests
- Response handlers should send a JSend-compatible response through the included Response.jsend(...object) extension
- It also provides a cache interface that can be used to create any number of short-lived cache objects at the JS layer

## Error reporting
Errors are reported in Sentry in this project https://sentry.io/temptribe/ephemera/

## Logging
The normal log file output is currently turned off due to an issue where loggin caused a specific error to happen and possible crashes.  This needs some further investigation. 

As Nginx logs all incoming requests there is a record of what traffic is sent to the api so this may be sufficient.

## Know issues

- The logging issue see the logging section of this readme
