import * as express from 'express';
import * as http from 'http';
import * as sqlite3 from 'sqlite3';

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

app.get("/api/:parameter", function (req, res) {
    let param = req.params.parameter;
    let sql = `SELECT "${param}" AS "y", "t" FROM data LIMIT 1440 OFFSET (SELECT COUNT(*) FROM data)-1440`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(JSON.stringify(rows));
    })
});

app.use(express.static('../datalogger-v2-react/build'));

app.get("/*", function (req, res) {
    res.sendFile('/home/pi/Documents/datalogger-v2-react/build/index.html', (err) => { 
	if(err) throw err;
    });
});

server.listen(4000, () => {
    console.log(`Server started on port 4000`);
})
