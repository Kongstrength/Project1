const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();


app.use(bodyParser.json());
app.use(cors());

const port = 8000;

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
  let errors = []
  if (!userData.product_id) {
    errors.push("กรุณากรอกรหัสสินค้า")
  }
  if (!userData.product_name) {
    errors.push("กรุณากรอกชื่อสินค้า")
  }
  if (!userData.quantity_in_stock) {
    errors.push("กรุณากรอกจำนวนสินค้าในสต๊อก")
  }
  if (!userData.unit_price) {
    errors.push("กรุณากรอกราคาต่อหน่วย")
  }
  if (!userData.transaction_date) {
    errors.push("กรุณากรอกวันที่ทำรายการ")
  }
  if (!userData.quantity) {
    errors.push("กรุณากรอกจำนวนที่ทำรายการ")
  }
  if (!userData.person_in_charge) {
    errors.push("กรุณากรอกชื่อผู้รับผิดชอบ")
  }
  if (!userData.product_logist) {
    errors.push("กรุณาเลือกความเคลื่อนไหวของสินค้า")
  }

  return errors
}


app.get('/inventory', async (req, res) => {
  try {
    const results = await conn.query('SELECT * FROM inventory');
    res.json(results[0]);
  } catch (error) {
    console.error('Error message:', error.message);
    res.status(500).json({
      message: 'something wrong',
      errorMessage: error.message
    });
  }
});

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

app.post('/inventory', async (req, res) => {
  try {
    let inventory = req.body;
    const errors = validateData(inventory);
    if (errors.length > 0) {
      throw {
        message: "กรอกข้อมูลไม่ถูกต้อง",
        errors: errors
      };
    }
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
    let id = req.params.id;
    let updateUser = req.body;

    

    const updateQuery = 'UPDATE inventory SET ? WHERE id = ?';
    const updateResult = await conn.query(updateQuery, [updateUser, id]);
    

    if (updateResult[0].affectedRows === 0) {
      res.status(404).json({
        message: "ไม่พบ ID ที่ระบุในฐานข้อมูล",
      });
    } else {
      res.json({
        message: "อัปเดตข้อมูลสินค้าสำเร็จ",
        data: updateResult[0],
      });
    }
  } catch (error) {
    console.error('Error message:', error.message);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดบางอย่าง',
    });
  }
});





app.delete('/inventory/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query('DELETE FROM inventory WHERE id = ?', id);
    res.json({
      message: 'Delete inventory successfully',
      data: results[0]
    });
  } catch (error) {
    console.log('errorMessage', error.message);
    res.status(500).json({
      message: 'something went wrong'
    });
  }
});

app.listen(port, async () => {
  await initMYSQL();
  console.log('Server is running on port', port);
});
