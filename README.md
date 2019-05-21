# datalogger-v2-backend
Node backend for datalogger-v2

This backend is written in TypeScript, uses Express as the base, and aims to replace the old datalogger code that I wrote a year ago.  To this day I still have the old code running, and I wanted to challenge myself to improve on that code by cutting out the waste.

The core functionality of this revision remains the same: the data is logged in a SQLite3 database.  However, this code adds the following:

* Websockets for instant and live updating of the frontend with `ws`.
* Hosts the Angular frontend application
* Connects directly to the serialport with the use of `serialport`.