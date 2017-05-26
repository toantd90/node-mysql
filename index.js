const mysql = require('mysql')
const express = require('express')
let app = express()
let pool = mysql.createPool({connectionLimit: 1000, host: 'localhost', user: 'root', password: 'root', debug: false})

function handleDatabase (req, res) {
  pool.getConnection((err, connection) => {
    if (err) {
      res.json({'code': 100, 'status': 'Error in connection database'})
      return
    }

    console.log('Connected as id ' + connection.threadId)

    connection.query('SELECT * FROM user', (err, rows) => {
      connection.release()
      if (!err) {
        res.json(rows)
      }
    })

    connection.on('error', (err) => {
      if (err) {
        console.error(err)
      }
      res.json({'code': 100, 'status': 'Error in connection database'})
      return
    })
  })
}

app.get('/', (req, res) => {
  handleDatabase(req, res)
})

app.listen(3000)
