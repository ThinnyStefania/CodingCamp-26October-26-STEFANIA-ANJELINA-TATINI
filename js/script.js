// Elemen DOM
const form = document.getElementById('transaction-form');
const itemNameInput = document.getElementById('item-name');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const transactionList = document.getElementById('transaction-list');
const totalBalanceEl = document.getElementById('total-balance');

// Data Transaksi dari LocalStorage atau array kosong
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart = null;

// Inisialisasi Grafik Chart.js
function initChart() {
    const ctx = document.getElementById('spending-chart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Makanan', 'Transportasi', 'Hiburan'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#2ecc71', '#3498db', '#e67e22']
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Memperbarui Tampilan UI & Grafik
function updateUI() {
    // 1. Bersihkan daftar transaksi
    transactionList.innerHTML = '';

    let total = 0;
    let categoryTotals = { Food: 0, Transport: 0, Fun: 0 };

    // 2. Render item transaksi
    transactions.forEach((item, index) => {
        total += item.amount;
        if (categoryTotals[item.category] !== undefined) {
            categoryTotals[item.category] += item.amount;
        }

        const div = document.createElement('div');
        div.classList.add('transaction-item');
        div.innerHTML = `
            <div class="transaction-info">
                <span class="item-name">${item.name}</span>
                <span class="item-amount">$${item.amount.toFixed(2)}</span>
                <span class="item-category">${item.category}</span>
            </div>
            <button class="delete-btn" onclick="deleteTransaction(${index})">Hapus</button>
        `;
        transactionList.appendChild(div);
    });

    // 3. Perbarui Total Saldo
    totalBalanceEl.textContent = `$${total.toFixed(2)}`;

    // 4. Perbarui Data Grafik
    if (myChart) {
        myChart.data.datasets[0].data = [
            categoryTotals.Food,
            categoryTotals.Transport,
            categoryTotals.Fun
        ];
        myChart.update();
    }

    // 5. Simpan ke LocalStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Menambah Transaksi
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = itemNameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;

    if (name && !isNaN(amount) && amount > 0) {
        transactions.push({ name, amount, category });
        updateUI();

        // Reset form
        itemNameInput.value = '';
        amountInput.value = '';
    }
});

// Menghapus Transaksi
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

// Jalankan saat halaman pertama dibuka
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    updateUI();
});