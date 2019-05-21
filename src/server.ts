import * as express from 'express';
import * as http from 'http';
import * as sqlite3 from 'sqlite3'

const app = express();

const server = http.createServer(app);

// Database connection
let db = new sqlite3.Database('../datalogger/database/database.db', (err) => {
    if (err) {
        // Cannot open database
        console.log('Error connecting to database!');
        throw err;
    }
    else {
        console.log('Connected to SQLite3 database.')
    }
});

app.get("/api/temperature", function (req, res) {
    let sql = `SELECT ? FROM data LIMIT 1440 OFFSET (SELECT COUNT(*) FROM data)-1440;`;
    db.each(sql, ["hrtemp"], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(JSON.stringify(rows));
    })
})

server.listen(4000, () => {
    console.log(`Server started on port 4000`);
})