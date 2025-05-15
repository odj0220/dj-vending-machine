const vendingMachine = {
    products: {
        "콜라": 1100,
        "물": 600,
        "커피": 700
    },
    selectedProduct: null, // 음료 선택
    paymentMethod: null, // "cash" or "card"
    insertedCash: 0, // 초기 투입 금액
    changeAvailable: 3000 // 초기 거스름돈 잔액
};

const logElement = document.getElementById("log");

function log(message) {
    logElement.textContent += message + "\n";
}

// UC1: 음료 선택
const productButtons = document.querySelectorAll(".product-btn");
productButtons.forEach(button => {
    button.addEventListener("click", () => {
        productButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        vendingMachine.selectedProduct = button.dataset.product;
        log(`음료 선택: ${vendingMachine.selectedProduct}`);
    });
});

// UC2: 결제 수단 선택
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
        vendingMachine.paymentMethod = e.target.value;
        document.getElementById("cash-payment").style.display = (e.target.value === "cash") ? "block" : "none";
        log(`결제 수단 선택: ${vendingMachine.paymentMethod}`);
    });
});

// UC3: 화폐 버튼으로 현금 투입
document.querySelectorAll('[data-cash]').forEach(button => {
    button.addEventListener("click", () => {
        const amount = Number(button.dataset.cash);
        insertCash(amount);
        updateInsertedDisplay();
        log(`현금 투입: ${amount}원 (총 ${vendingMachine.insertedCash}원)`);
    });
});

function insertCash(amount) {
    vendingMachine.insertedCash += amount;
}

function updateInsertedDisplay() {
    document.getElementById("insertedDisplay").textContent = `투입 금액: ${vendingMachine.insertedCash}원`;
}

// UC3/4: 결제하기 버튼 처리
document.getElementById("confirmPaymentBtn").addEventListener("click", () => {
    if (!vendingMachine.selectedProduct) {
        alert("음료를 선택해주세요.");
        return;
    }
    if (!vendingMachine.paymentMethod) {
        alert("결제 수단을 선택해주세요.");
        return;
    }
    if (vendingMachine.paymentMethod === "cash") {
        processCashPayment();
    } else {
        processCardPayment();
    }
});

function processCashPayment() {
    const product = vendingMachine.selectedProduct;
    const price = vendingMachine.products[product];
    const inserted = vendingMachine.insertedCash;

    if (inserted < price) {
        alert(`금액이 부족합니다. ${price - inserted}원이 더 필요합니다.`);
        log(`❌ 금액 부족: ${inserted}원 < ${price}원`);
        return;
    }

    const change = inserted - price;

    if (vendingMachine.changeAvailable < change) {
        alert("거스름돈이 부족합니다. 거래를 취소합니다.");
        log(`❌ 거스름돈 부족: 필요 ${change}원, 보유 ${vendingMachine.changeAvailable}원`);
        resetTransaction();
        return;
    }

    vendingMachine.changeAvailable -= change;
    alert(`${product} 제공 완료!\n거스름돈: ${change}원`);
    log(`✅ ${product} 제공 완료. 거스름돈: ${change}원\n남은 거스름돈 잔액: ${vendingMachine.changeAvailable}원`);
    resetTransaction();
}

function processCardPayment() {
    const product = vendingMachine.selectedProduct;
    const price = vendingMachine.products[product];
    const approved = Math.random() < 0.95;

    if (approved) {
        alert(`${product} 결제 완료! 금액: ${price}원`);
        log(`✅ 카드 결제 성공: ${product} (${price}원)`);
    } else {
        alert("❌ 카드 결제 실패! 다른 수단을 선택해주세요.");
        log(`❌ 카드 결제 실패`);
    }

    resetTransaction();
}

function resetTransaction() {
    vendingMachine.insertedCash = 0;
    vendingMachine.selectedProduct = null;
    vendingMachine.paymentMethod = null;

    // UI 초기화
    updateInsertedDisplay();
    productButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll('input[name="paymentMethod"]').forEach(r => r.checked = false);
    document.getElementById("cash-payment").style.display = "none";
}
