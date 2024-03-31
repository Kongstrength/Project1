const BASE_URL = 'http://localhost:8000';

window.onload = async () => { // ฟังก์ชันที่จะถูกเรียกเมื่อหน้าเว็บโหลดเสร็จ
    await loadData();
};

const loadData = async () => { // ฟังก์ชันที่ใช้ในการดึงข้อมูลจาก backend มาแสดง
    console.log('loaded');
    try {
        const response = await axios.get(`${BASE_URL}/inventory`); 
        console.log(response.data);

        const inventoryDOM = document.getElementById('inventory'); 
        if (inventoryDOM) {
            let htmlData = `<table>`;
            htmlData += `
                <tr>
                    <th>id</th>
                    <th>รหัสสินค้า</th>
                    <th>ชื่อสินค้า</th>
                    <th>จำนวนคงเหลือในสต็อก</th>
                    <th>ราคาต่อหน่วย</th>
                    <th>วันที่เบิกจ่าย</th>
                    <th>จำนวนสินค้า</th>
                    <th>ผู้รับผิดชอบ</th>
                    <th>การเคลื่อนไหวของสินค้า</th>
                    <th>สินค้าเหลือคงคลัง</th>
                    <th>แก้ไข</th>
                    <th>ลบ</th>
                </tr>`;

            for (let i = 0; i < response.data.length; i++)  { // วนลูปเพื่อดึงข้อมูลที่ได้จาก index.js backend มาแสดง
                let inventory = response.data[i];
                let formattedDate = new Date(inventory.transaction_date).toLocaleString('th-TH');// เปลี่ยนเป็นวันที่และเวลาในรูปแบบไทย
                htmlData += `
                    <tr>
                        <td>${inventory.id}</td>
                        <td>${inventory.product_id}</td>
                        <td>${inventory.product_name}</td>
                        <td>${inventory.quantity_in_stock.toLocaleString()}</td>
                        <td>${inventory.unit_price}</td> 
                        <td>${formattedDate}</td>
                        <td>${inventory.quantity.toLocaleString()}</td>
                        <td>${inventory.person_in_charge}</td>
                        <td>${inventory.product_logist.toLocaleString()}</td>
                        <td>${inventory.remaining_quantity}</td>
                        <td><a href='Home.html?id=${inventory.id}' class='edit-button'>แก้ไข</a></td>
                        <td><button class='delete-button' data-id='${inventory.id}'>ลบ</button></td>
                    </tr>`;
            }

            htmlData += '</table>';
            inventoryDOM.innerHTML = htmlData;

            const deleteDOMs = document.getElementsByClassName('delete-button'); // ดึงปุ่มลบทั้งหมด
            for (let i = 0; i < deleteDOMs.length; i++) { 
                deleteDOMs[i].addEventListener('click', async (event) => {
                    const id = event.target.dataset.id;
                    try {
                        await axios.delete(`${BASE_URL}/inventory/${id}`);
                        loadData();
                    } catch (error) {
                        console.log(error);
                    }
                });
            }
        } else {
            console.log('inventoryDOM not found');
        }
    } catch (error) {
        console.error(error);
        // Handle error appropriately, e.g., display a message to the user
    }
};
