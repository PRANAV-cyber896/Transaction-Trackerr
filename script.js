document.addEventListener('DOMContentLoaded', () => {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    function addTransaction() {
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        const dateTime = new Date().toLocaleString(); // Capture date and time

        if (description === "" || isNaN(amount)) {
            alert("Please enter a valid description and amount.");
            return;
        }

        const transaction = {
            description,
            amount: type === 'paid' ? -amount : amount,
            type,
            category,
            dateTime // Store date and time in transaction
        };

        transactions.push(transaction);
        updateLocalStorage();
        updateTable();
        updateBalance();
        clearInputs();
        showSummary();
    }

    function updateTable() {
        const table = document.getElementById('transactionTable');
        table.innerHTML = "";

        transactions.forEach((transaction) => {
            const row = document.createElement('tr');
            const dateTimeCell = document.createElement('td'); // Changed to dateTimeCell
            const descriptionCell = document.createElement('td');
            const amountCell = document.createElement('td');
            const typeCell = document.createElement('td');
            const categoryCell = document.createElement('td');

            dateTimeCell.textContent = transaction.dateTime; // Display date and time
            descriptionCell.textContent = transaction.description;
            amountCell.textContent = `₹${Math.abs(transaction.amount).toFixed(2)}`;
            typeCell.textContent = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
            categoryCell.textContent = transaction.category;

            row.appendChild(dateTimeCell);
            row.appendChild(descriptionCell);
            row.appendChild(amountCell);
            row.appendChild(typeCell);
            row.appendChild(categoryCell);
            table.appendChild(row);
        });
    }

    function updateBalance() {
        const totalBalance = transactions.reduce((total, transaction) => total + transaction.amount, 0);
        document.getElementById('totalBalance').textContent = `Total Balance: ₹${totalBalance.toFixed(2)}`;
    }

    function clearInputs() {
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('type').value = 'received';
        document.getElementById('category').value = '';
    }

    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function deleteAllTransactions() {
        if (confirm("Are you sure you want to delete all transactions?")) {
            transactions = [];
            updateLocalStorage();
            updateTable();
            updateBalance();
        }
    }

    function showSummary() {
        document.getElementById('summaryView').style.display = 'block';
        document.getElementById('transactionForm').style.display = 'none';
        document.getElementById('transactionList').style.display = 'none';
        updateBalance();
    }

    function showAddTransactionForm() {
        document.getElementById('summaryView').style.display = 'none';
        document.getElementById('transactionForm').style.display = 'block';
        document.getElementById('transactionList').style.display = 'none';
    }

    function showAllTransactions() {
        document.getElementById('summaryView').style.display = 'none';
        document.getElementById('transactionForm').style.display = 'none';
        document.getElementById('transactionList').style.display = 'block';
        updateTable();
    }

    // Initialize on page load
    showSummary();

    // Register the service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    // Expose functions to global scope for button event handlers
    window.addTransaction = addTransaction;
    window.deleteAllTransactions = deleteAllTransactions;
    window.showSummary = showSummary;
    window.showAddTransactionForm = showAddTransactionForm;
    window.showAllTransactions = showAllTransactions;
});
