const BASE_URL = 'http://localhost:8000';

let mode = "CREATE"; // default mode
let selectedId = "";

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        mode = "EDIT";
        selectedId = id;
        await loadProductData(id);
    }
}

const loadProductData = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/inventory/${id}`);
        const inventory = response.data;
        
        let product_idDOM = document.querySelector("input[name=product_id]")
        let product_nameDOM = document.querySelector("input[name=product_name]")
        let quantity_in_stockDOM = document.querySelector("input[name=quantity_in_stock]")
        let unit_priceDOM = document.querySelector("input[name=unit_price]")
        let transaction_dateDOM = document.querySelector("input[name=transaction_date]")
        
        let quantityDOM = document.querySelector("input[name=quantity]")
        let person_in_chargeDOM = document.querySelector("input[name=person_in_charge]")
        let product_logistDOM = document.querySelector("select[name=product_logist]")
        let remaining_quantityDOM = document.querySelector("input[name=remaining_quantity]")

         product_idDOM.value = inventory.product_id;
        
        product_nameDOM.value = inventory.product_name;
        quantity_in_stockDOM.value = inventory.quantity_in_stock;
        unit_priceDOM.value = inventory.unit_price;
        transaction_dateDOM.value = inventory.transaction_date;
        quantityDOM.value = inventory.quantity;
        person_in_chargeDOM.value = inventory.person_in_charge;
        product_logistDOM.value = inventory.product_logist;
        remaining_quantityDOM.value = inventory.remaining_quantity;

    } catch (error) {
        console.log("Error", error);
    }
}
const validateData = (userData) => {
    let errors = [];
    if (!userData.product_id) {
        errors.push("กรุณากรอกรหัสสินค้า");
    }
    if (!userData.product_name) {
        errors.push("กรุณากรอกชื่อสินค้า");
    }
    if (!userData.quantity_in_stock) {
        errors.push("กรุณากรอกจำนวนสินค้าในสต๊อก");
    }
    if (!userData.unit_price) {
        errors.push("กรุณากรอกราคาต่อหน่วย");
    }
    if (!userData.transaction_date) {
        errors.push("กรุณาเลือกวันที่ทำรายการ");
    }
    if (!userData.quantity) {
        errors.push("กรุณากรอกจำนวนที่ทำรายการ");
    }
    if (!userData.person_in_charge) {
        errors.push("กรุณากรอกชื่อผู้รับผิดชอบ");
    }
    if (!userData.product_logist) {
        errors.push("กรุณาเลือกความเคลื่อนไหวของสินค้า");
    }
    return errors; 
};



const submitData = async () => {
    let messageDOM = document.getElementById('message');

    try {
        let product_idDOM = document.querySelector("input[name=product_id]");
        let product_nameDOM = document.querySelector("input[name=product_name]");
        let quantity_in_stockDOM = document.querySelector("input[name=quantity_in_stock]");
        let unit_priceDOM = document.querySelector("input[name=unit_price]");
        let transaction_dateDOM = document.querySelector("input[name=transaction_date]");
        let quantityDOM = document.querySelector("input[name=quantity]");
        let person_in_chargeDOM = document.querySelector("input[name=person_in_charge]");
        let product_logistDOM = document.querySelector("select[name=product_logist]");
        
        
        

        let userData = {
            product_id: product_idDOM.value,
            product_name: product_nameDOM.value,
            quantity_in_stock: quantity_in_stockDOM.value,
            unit_price: unit_priceDOM.value,
            transaction_date: transaction_dateDOM.value,
            quantity: quantityDOM.value,
            person_in_charge: person_in_chargeDOM.value,
            product_logist: product_logistDOM.value,          
        };
    
        console.log("submitData", userData);

        const errors = validateData(userData);
        if (errors.length > 0) {
            throw {
                message: "กรอกข้อมูลไม่ครบถ้วนนะจ๊ะ",
                errors: errors
            };
        }

        let message = "บันทึกข้อมูลเรียบร้อย";
        if (mode === "CREATE") {
            const response = await axios.post(`${BASE_URL}/inventory`, userData);
            console.log('response', response.data);
        } else {
            const response = await axios.put(`${BASE_URL}/inventory/${selectedId}`, userData);
            message = "แก้ไขข้อมูลเรียบร้อย";
            console.log('response', response.data);
        }

        messageDOM.innerText = message;
        messageDOM.className = "message success";
    } catch (error) {
        console.log('error message', error.message);
        console.log("error", error.errors);

        if (error.response) {
            console.log(error.response.data.message);
            error.message = error.response.data.message;
            error.errors = error.response.data.errors;
        }

        let htmlData = '<div>';
        htmlData += `<div>${error.message}</div>`;
        htmlData += '<ul>';
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</li>`;
        }
        htmlData += '</ul>';
        htmlData += '</div>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = "message danger";
    }
};

