const express = require('express')
const path = require('path')
const app = express()

const mysql = require('mysql2')

app.use(express.json())

//请提前创建一个名叫testout，包含ID,name,age,phone属性的mysql表
const client = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',//输入mysql用户名
  password: '123456',//输入mysql密码
  database: 'gua'//输入mysql所使用数据库名
})

//数据库交互函数
function get_sql(callback) {
  let sqlStr = 'select * from testout'
  client.query(sqlStr, (err, results) => {
    if (err) {
      console.log('Database query error:', err.message)
      callback(err, null)
    }
    else {
      callback(null, results)
    }
  })
}

function post_sql(callback, data) {
  let sqlStr = 'INSERT INTO testout (name,age,phone) VALUES(?,?,?)'

  client.query(sqlStr, [data.name, data.age, data.phone], (err, results) => {
    if (err) {
      console.log('Database query error:', err.message)
    }
    else {
      callback(null, results)
    }
  })
}

function delete_sql(callback, id) {

  let sqlStr = 'DELETE FROM testout WHERE id=?'
  client.query(sqlStr, id, (err, results) => {
    if (err) {
      console.log('Database query error:', err.message)
      callback(err, null)
    }
    else {
      callback(null, results)
    }
  })
}

function find_sql(callback, id) {
  let sqlStr = 'select * from testout WHERE id=?'
  client.query(sqlStr, id, (err, results) => {
    if (err) {
      console.log('Database query error:', err.message)
      callback(err, null)
    }
    else {
      callback(null, results)
    }
  })
}

function patch_sql(callback, data) {
  let sqlStr = 'update testout set name=?,age=?,phone=? where id=?'

  client.query(sqlStr, [data.name, data.age, data.phone, data.ID], (err, results) => {
    if (err) {
      console.log('Database query error:', err.message)
      callback(err, null)
    }
    else {
      callback(null, results)
    }
  })
}











//各类路由接口


let url = path.join(__dirname, "../font_end")//前端代码存放位置
app.use(express.static(url))
//获取数据

//取数据
app.get('/get', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  get_sql((err, results) => {
    if (err) {
      console.error('Error fetching data:', err)
      res.status(500).send('Internal Server Error')
    }
    else {
      console.log(results)
      res.send(results)
    }
  })
})

//存数据
app.post('/post', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  console.log(req.body)
  post_sql((err, results) => {
    if (err) {
      console.error('Error fetching data')
      res.status(500).send('Internal Server Error')
    }
    else {
      console.log("存储成功")
      res.send("存储成功")
      console.log('-------------------------------------')
    }
  }, req.body)
})

//删数据
app.delete('/delete', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  let id = req.body.ID
  console.log(req)

  delete_sql((err, results) => {
    if (err) {
      console.error('Error fetching data:', err)
      res.status(500).send('Internal Server Error')
    }
    else {
      console.log("删除成功")
      res.send("删除成功")
      console.log('-------------------------------------')
    }
  }, id)
})

//查找数据
app.get('/find', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  let id = req.query.ID
  console.log(id)

  find_sql((err, results) => {
    if (err) {
      console.error('Error fetching data:', err)
      res.status(500).send('Internal Server Error')
    }
    else {
      console.log("寻找成功")
      res.send(results)
    }
  }, id)
})

//修改数据
app.post('/patch', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  console.log(req.body)

  patch_sql((err, results) => {
    if (err) {
      console.error('Error fetching data:', err)
      res.status(500).send('Internal Server Error')
    }
    else {
      console.log("替换成功")
      res.send(results)
    }
  }, req.body)
})

app.listen(3000, () => {
  console.log("http://127.0.0.1:3000/", "服务器已启动 ")
})