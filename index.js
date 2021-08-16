const express = require("express");
const router = express.Router()
const app = express()
const http = require('http');
const bodyParser = require("body-parser");
const { Pool, Client } = require('pg')

var _ = require("underscore");
app.use(bodyParser.json());

const client = new Client({
  user: 'comstice',
  host: '127.0.0.1',
  database: 'quartzUcce',
  password: 'LCpJ5nWPYR',
  port: 5433,
})
client.connect()

app.get('/users',async function(req,res){

 var a= await client.query('SELECT * FROM test_table')
 res.json(a.rows)

})


var getPostJsonName=['uname','pass']
app.post("/", async function(req, res) {
  let body = _.pick(req.body, getPostJsonName)
  await client.query(`INSERT INTO test_table(username, pass) VALUES('${body.uname}', '${body.pass}');`)
  res.sendStatus(200);
})



app.delete('/delete',async function(req,res){
  let body = _.pick(req.body, 'itemId')
  await client.query(`DELETE FROM test_table WHERE id = ${body.itemId};`)
  res.sendStatus(200)
})
//DELETE FROM test_table WHERE id = ${body.itemId};

var getPutJsonName=['itemId','item']
app.put('/put',async function(req,res){
  let body = _.pick(req.body, getPutJsonName)
  await client.query(`UPDATE test_table SET username = '${body.item.uname}', pass = '${body.item.pass}' WHERE id = ${body.itemId};`)
  res.sendStatus(200)
})
//UPDATE table_name SET usename = '${body.item.uname}', pass = '${body.item.pass}', WHERE ${body.itemId};


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public/'));
  app.get(/.*/, (req, res) => res.sendfile(__dirname + 'index.html'));

}

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => console.log(`Server started on port ${port}`));