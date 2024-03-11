import express from 'express'
import bodyParser from 'body-parser'
import mysql from 'mysql'



const app = express()
const port = process.env.PORT || 5000;

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false })); // Remove 

const pool  = mysql.createPool({
    
})
app.use(express.urlencoded({extended: true})); // New
// Parse application/json
// app.use(bodyParser.json()); // Remove
app.use(express.json()); // New

// MySQL Code goes here
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from users', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from users table are: \n', rows)
        })
    })
})
app.post('/register',(req,res)=>{
    pool.getConnection((err, connection) => {
        if(err) throw err
        const sql = 'INSERT INTO users SET ?';
        const params = req.body
        connection.query(sql, params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`User is registed`)
        } else {
            console.log(err)
        }
        
        console.log('The data from users table are:11 \n', rows)

        })
    })

});
app.post('/login', (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
  
      const email = req.body.email; // Extract email from request body
      const sql = 'SELECT * FROM users WHERE email = ?'; // Use prepared statement with placeholder
  
      connection.query(sql, [email], (err, rows) => {
        connection.release(); // Return the connection to pool
  
        if (!err) {
          if (rows.length > 0) {
            // User found (check password in a separate step)
            res.send(`User found`);
          } else {
            res.send(`Invalid email or password`);
          }
        } else {
          console.log(err);
        }
      });
    });
  });
  
// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))