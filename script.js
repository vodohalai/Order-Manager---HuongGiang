document.addEventListener('DOMContentLoaded', () => {
    const productTableBody = document.getElementById('product-table-body');
    const cartTableBody = document.getElementById('cart-table-body');
    const orderForm = document.getElementById('order-form');
    const clearCartButton = document.getElementById('clear-cart');
    const tongTruocVatInput = document.getElementById('tong-truoc-vat');
    const chietKhauPtInput = document.getElementById('chiet-khau-pt');
    const chietKhauVndInput = document.getElementById('chiet-khau-vnd');
    const vatInput = document.getElementById('vat');
    const tongSauVatInput = document.getElementById('tong-sau-vat');
    const productLoader = document.getElementById('product-loader');
    const modal = document.getElementById('add-to-cart-modal');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductImage = document.getElementById('modal-product-image');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalQuantityInput = document.getElementById('modal-quantity');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    const closeModalBtn = document.querySelector('.close-button');
    const toastContainer = document.getElementById('toast-container');

    // Placeholder product data
    const products = [
        { id: 'SP001', name: 'Sản phẩm A', unit: 'Cái', price: 100000, image: 'https://via.placeholder.com/50' },
        { id: 'SP002', name: 'Sản phẩm B', unit: 'Hộp', price: 250000, image: 'https://via.placeholder.com/50' },
        { id: 'SP003', name: 'Sản phẩm C', unit: 'Chiếc', price: 50000, image: 'https://via.placeholder.com/50' },
    ];

    let cart = [];

    function renderProducts(filteredProducts = products) {
        productTableBody.innerHTML = '';
        filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.unit}</td>
                <td>${product.price.toLocaleString()}</td>
                <td><button class="btn-add-to-cart" data-id="${product.id}">Thêm</button></td>
            `;
            productTableBody.appendChild(row);
        });
    }

    function fetchProducts() {
        productLoader.style.display = 'block';
        productTableBody.style.display = 'none';
        // Simulate network request
        setTimeout(() => {
            renderProducts();
            productLoader.style.display = 'none';
            productTableBody.style.display = '';
        }, 1500);
    }

    function renderCart() {
        cartTableBody.innerHTML = '';
        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                <td>${item.price.toLocaleString()}</td>
                <td><input type="number" class="cart-item-quantity" data-id="${item.id}" value="${item.quantity}" min="1"></td>
                <td>${(item.price * item.quantity).toLocaleString()}</td>
            `;
            cartTableBody.appendChild(row);
        });
        updateTotals();
    }

    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountPercentage = parseFloat(chietKhauPtInput.value) || 0;
        const vatPercentage = parseFloat(vatInput.value) || 0;

        const discountAmount = (subtotal * discountPercentage) / 100;
        const totalBeforeVat = subtotal - discountAmount;
        const vatAmount = (totalBeforeVat * vatPercentage) / 100;
        const finalTotal = totalBeforeVat + vatAmount;

        tongTruocVatInput.value = subtotal.toLocaleString();
        chietKhauVndInput.value = discountAmount.toLocaleString();
        tongSauVatInput.value = finalTotal.toLocaleString();
    }

    function addToCart(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }
        renderCart();
        showToast(`${quantity} ${product.name} đã được thêm vào giỏ hàng.`, 'success');
    }

    function openAddToCartModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        modalProductName.textContent = product.name;
        modalProductImage.src = product.image;
        modalProductPrice.textContent = product.price.toLocaleString() + ' VNĐ';
        modalQuantityInput.value = 1;
        modalAddToCartBtn.dataset.id = productId;
        modal.style.display = 'block';
    }

    function closeAddToCartModal() {
        modal.style.display = 'none';
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100); 

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    productTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-to-cart')) {
            openAddToCartModal(e.target.dataset.id);
        }
    });

    closeModalBtn.addEventListener('click', closeAddToCartModal);

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeAddToCartModal();
        }
    });

    modalAddToCartBtn.addEventListener('click', () => {
        const productId = modalAddToCartBtn.dataset.id;
        const quantity = parseInt(modalQuantityInput.value, 10);
        if (quantity > 0) {
            addToCart(productId, quantity);
            closeAddToCartModal();
        } else {
            showToast('Số lượng phải lớn hơn 0.', 'error');
        }
    });

    cartTableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('cart-item-quantity')) {
            const productId = e.target.dataset.id;
            const newQuantity = parseInt(e.target.value, 10);
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem && newQuantity > 0) {
                cartItem.quantity = newQuantity;
                renderCart();
            }
        }
    });

    clearCartButton.addEventListener('click', () => {
        cart = [];
        renderCart();
    });

    [chietKhauPtInput, vatInput].forEach(input => {
        input.addEventListener('input', updateTotals);
    });

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }

        const formData = new FormData(orderForm);
        const orderData = Object.fromEntries(formData.entries());
        
        orderData.cart = cart;
        orderData.subtotal = tongTruocVatInput.value;
        orderData.discountPercentage = chietKhauPtInput.value;
        orderData.discountAmount = chietKhauVndInput.value;
        orderData.vatPercentage = vatInput.value;
        orderData.total = tongSauVatInput.value;

        console.log('Submitting order:', orderData);
        // Replace with actual Google Apps Script URL for submission
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzWpmTSddWcagT4KdwjYHnoix94VOT0LvXtaPoqqJl3tpWvJPPF3PBpuc4NAblM3OHWAQ/exec';
        
        fetch(scriptURL, { 
            method: 'POST', 
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            showToast('Đặt hàng thành công!', 'success');
            cart = [];
            renderCart();
            orderForm.reset();
            chietKhauPtInput.value = 0;
            vatInput.value = 0;
            updateTotals();
        })
        .catch(error => {
            console.error('Error!', error.message);
            showToast('Có lỗi xảy ra khi đặt hàng!', 'error');
        });
    });

    // Initial render
    fetchProducts();
});