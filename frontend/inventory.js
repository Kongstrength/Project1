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
                    <th>product_id</th>
                    <th>product_name</th>
                    <th>quantity_in_stock</th>
                    <th>unit_price</th>
                    <th>transaction_date</th>
                    <th>quantity</th>
                    <th>person_in_charge</th>
                    <th>product_logist</th>
                    <th>remaining_quantity</th>
                    <th>Edit</th>
                    <th>Delete</th>
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
                        <td><button class='edit-button' data-id='${inventory.id}'>Edit</button></td>
                        <td><button class='delete-button' data-id='${inventory.id}'>Delete</button></td>
                    </tr>`;
            }

            htmlData += '</table>';
            inventoryDOM.innerHTML = htmlData;

            // Event delegation for edit buttons
            inventoryDOM.addEventListener('click', async (event) => {
                if (event.target.classList.contains('edit-button')) {
                    const id = event.target.dataset.id;
                    window.location.href = `Home.html?id=${id}`;
                }
            });

            // Event delegation for delete buttons
            inventoryDOM.addEventListener('click', async (event) => {
                if (event.target.classList.contains('delete-button')) {
                    const id = event.target.dataset.id;
                    try {
                        await axios.delete(`${BASE_URL}/inventory/${id}`);
                        await loadData(); // Load data again after deletion
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        } else {
            console.log('inventoryDOM not found');
        }
    } catch (error) {
        console.error(error);
        // Handle error appropriately, e.g., display a message to the user
    }
};
