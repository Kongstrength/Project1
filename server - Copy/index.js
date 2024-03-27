const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')
const app = express()


app.use(bodyparser.json())
app.use(cors())

const port = 8000;

let inventory =[]
let count = 1;
let conn = null;

const initMYSQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8820
  });
};

const validateData = (userData) => {
  let errors = [];
  if (!userData.product_id) {
      errors.push("กรุณากรอกรหัสสินค้า");
  }
  if (!userData.product_name) {
      errors.push("กรุณากรอกชื่อสินค้า");
  }
  if (!userData.quantity_in_stock) {
      errors.push("กรุณากรอกจำนวนคงเหลือ");
  }
  if (!userData.unit_price) {
      errors.push("กรุณากรอกราคาต่อหน่วย");
  }
  if (!userData.transaction_date) {
      errors.push("กรุณากรอกวันที่เบิกจ่าย");
  }
  if (!userData.quantity) {
      errors.push("กรุณากรอกจำนวนสินค้า");
  }
  if (!userData.person_in_charge) {
      errors.push("กรุณากรอกผู้รับผิดชอบ");
  }
  if (!userData.product_logist) {
      errors.push("กรุณากรอกการเคลื่อนไหวของสินค้า");
  }
  
  return errors;
};

// path = GET /inventory สำหรับ get inventory ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/inventory', async (req, res) => {
  

  const results = await conn.query('SELECT * FROM inventory')
  res.json(results[0])
});

// GET /inventory/:id สำหรับการดึง inventory รายคนออกมา
app.get('/inventory/:id', async (req, res) => {
  try {

    let id = req.params.id;
    const results = await conn.query('SELECT * FROM inventory WHERE id = ?', id);
    if (results[0].length === 0) {
      throw { statusCode: 404, message: 'ไม่พบข้อมูล' };
    }
    res.json(results[0][0]);
  } catch (error) {
    console.error('Error message:', error.message);
    let statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: 'something wrong',
      errorMessage: error.message
    });
  }
});

// POST /inventory สำหรับการสร้าง inventory ใหม่บันทึกเข้าไป
app.post('/inventory', async (req, res) => {
  try {
    let current_date = moment().format("YYYY-MM-DD HH:mm:ss");


    let inventory = req.body;
    // ทำการเพิ่มข้อมูล transaction_date ให้เพิ่มขึ้น 1 วันให้ตรงกับเวลาที่เราใส่เข้าไป
    inventory.transaction_date = moment(inventory.transaction_date).add(1, 'day').format("YYYY-MM-DD HH:mm:ss");

    const errors = validateData(inventory);
    if (errors.length > 0) {
      throw {
        message: "กรอกข้อมูลไม่ถูกต้อง",
        errors: errors
      };
    }

    // เพิ่มข้อมูล inventory ลงในฐานข้อมูล
    const results = await conn.query("INSERT INTO inventory SET ?", inventory);
    
    res.json({
      message: "สร้างข้อมูลใหม่สำเร็จ",
      data: results[0]
    });

  } catch (error) {
    const errorMessage = error.message || 'something went wrong';
    const errors = error.errors || [];
    console.error('errorMessage', errorMessage);
    res.status(500).json({
      message: errorMessage,
      errors: errors
    });
  }
});



app.put('/inventory/:id', async (req, res) => {
  try {
    let current_date = moment().format("YYYY-MM-DD HH:mm:ss");

    
    let id = req.params.id;
    let updateUser = req.body;

    // Format the transaction_date if it exists in the request body
    if (updateUser.transaction_date) {
      updateUser.transaction_date = moment(updateUser.transaction_date).add(1, 'day').format("YYYY-MM-DD HH:mm:ss");
    }

    // ทำการอัปเดตข้อมูลของรายการสินค้า
    const results = await conn.query(
      'UPDATE inventory SET ? WHERE id = ?', 
      [updateUser, id]);
    
    res.json({
      message: "อัปเดตข้อมูลสินค้าสำเร็จ",
      data: results[0],
    });

  } catch (error) {
    console.error('Error message:', error.message);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดบางอย่าง',
    });
  }
});



//DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/inventory/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query('DELETE FROM inventory WHERE id = ?', id)
    res.json({
      message: 'Delete user successfully',
      data: results[0]
    })
  } catch (error) {
    console.log('errorMessage', error.message)
    res.status(500).json({
      message: 'something went wrong'
    })
  }
})

app.listen(port, async () => {
  await initMYSQL();
  console.log('Server is running on port',+ port);
});
