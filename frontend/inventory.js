const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
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

            for (let i = 0; i < response.data.length; i++) {
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
                        <td>${inventory.remaining_quantity.toLocaleString()}</td>
                        <td><a href='Home.html?id=${inventory.id}' class='edit-button'>Edit</a></td>
                        <td><button class='delete-button' data-id='${inventory.id}'>Delete</button></td>
                    </tr>`;
            }

            htmlData += '</table>';
            inventoryDOM.innerHTML = htmlData;

            const deleteDOMs = document.getElementsByClassName('delete-button');
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
