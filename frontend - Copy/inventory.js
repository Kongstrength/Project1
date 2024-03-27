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
        if(inventoryDOM){
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
                htmlData += `
                    <tr>
                        <td>${inventory.id}</td>
                        <td>${inventory.product_id}</td>
                        <td>${inventory.product_name}</td>
                        <td>${inventory.quantity_in_stock}</td>
                        <td>${inventory.unit_price}</td>
                        <td>${inventory.transaction_date}</td>
                        <td>${inventory.quantity}</td>
                        <td>${inventory.person_in_charge}</td>
                        <td>${inventory.product_logist}</td>
                        <td>${inventory.remaining_quantity}</td>
                        <td><a href='Home.html?id=${inventory.id}' class='edit-button'>Edit</a></td>
                        <td><button class='delete-button' data-id='${inventory.id}'>Delete</button></td>
                    </tr>`;
            }

            htmlData += '</table>';
            inventoryDOM.innerHTML = htmlData;

            // Event delegation for delete buttons
            const deleteDOMs = document.getElementsByClassName('delete-button');
            for(let i = 0; i < deleteDOMs.length; i++) {
                deleteDOMs[i].addEventListener('click', async (event) => {
                    const id = event.target.dataset.id;
                    try {
                        await axios.delete(`${BASE_URL}/inventory/${id}`);
                        loadData();
                    } catch (error) {
                        console.error(error);
                    }
                });
            }   
        } else {
            console.log('inventoryDOM not found');
        }
    } catch (error) {
        console.error(error);
    }
};