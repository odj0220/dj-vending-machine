// === 상태 객체 ===
const vendingMachine = {
    products: { "콜라": 1100, "물": 600, "커피": 700 },
    selectedProduct: null,
    paymentMethod: null,
    insertedCash: 0,
    changeAvailable: 3000
};

const logElement = document.getElementById("log");

// === UC1: 음료 선택 ===
function setupProductSelection() {
    const buttons = document.querySelectorAll(".product-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            vendingMachine.selectedProduct = btn.dataset.product;
            log(`✅ 음료 선택: ${vendingMachine.selectedProduct}`);
        });
    });
}

// === UC2: 결제 수단 선택 ===
function setupPaymentMethod() {
    const radios = document.querySelectorAll('input[name="paymentMethod"]');
    radios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            vendingMachine.paymentMethod = e.target.value;
            document.getElementById("cash-payment").style.display =
                e.target.value === "cash" ? "block" : "none";
            log(`✅ 결제 수단 선택: ${vendingMachine.paymentMethod}`);
        });
    });
}

// === UC3: 현금 투입 ===
function setupCashButtons() {
    document.querySelectorAll('[data-cash]').forEach(btn => {
        btn.addEventListener("click", () => {
            const amount = Number(btn.dataset.cash);
            vendingMachine.insertedCash += amount;
            updateInsertedDisplay();
            log(`💰 현금 투입: ${amount}원 (총: ${vendingMachine.insertedCash}원)`);
        });
    });
}

function updateInsertedDisplay() {
    document.getElementById("insertedDisplay").textContent =
        `투입 금액: ${vendingMachine.insertedCash}원`;
}

// === UC4: 결제 확인 및 처리 ===
function setupPaymentConfirmation() {
    document.getElementById("confirmPaymentBtn").addEventListener("click", () => {
        const { selectedProduct, paymentMethod } = vendingMachine;
        if (!selectedProduct) {
            alert("음료를 선택해주세요.");
            return;
        }
        if (!paymentMethod) {
            alert("결제 수단을 선택해주세요.");
            return;
        }
        if (paymentMethod === "cash") {
            processCashPayment();
        } else {
            processCardPayment();
        }
    });
}


// === UC5: 현금 결제 처리 ===
function processCashPayment() {
    const { selectedProduct, insertedCash, products, changeAvailable } = vendingMachine;
    const price = products[selectedProduct];
    const change = insertedCash - price;

    if (insertedCash < price) {
        alert("금액이 부족합니다.");
        log(`❌ 금액 부족 (${insertedCash}원 / ${price}원)`);
        return;
    }

    if (change > changeAvailable) {
        alert("거스름돈 부족으로 결제 취소됩니다.");
        log(`❌ 거스름돈 부족 (필요: ${change}원, 보유: ${changeAvailable}원)`);
        resetTransaction();
        return;
    }

    vendingMachine.changeAvailable -= change;
    alert(`${selectedProduct} 제공 완료! 거스름돈 ${change}원`);
    log(`✅ ${selectedProduct} 제공 완료. 거스름돈: ${change}원`);
    resetTransaction();
}

// === UC6: 카드 결제 처리 ===
function processCardPayment() {
    const { selectedProduct, products } = vendingMachine;
    const price = products[selectedProduct];
    const approved = Math.random() < 0.95;

    if (approved) {
        alert(`${selectedProduct} 결제 완료 (${price}원)`);
        log(`✅ 카드 결제 성공: ${selectedProduct} (${price}원)`);
    } else {
        alert("❌ 카드 결제 실패");
        log(`❌ 카드 결제 실패`);
    }

    resetTransaction();
}

// === UC7: 거래 초기화 ===
function resetTransaction() {
    vendingMachine.selectedProduct = null;
    vendingMachine.paymentMethod = null;
    vendingMachine.insertedCash = 0;

    // UI 초기화
    updateInsertedDisplay();
    document.querySelectorAll(".product-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll('input[name="paymentMethod"]').forEach(r => r.checked = false);
    document.getElementById("cash-payment").style.display = "none";
}

// === UC8: 로그 출력 ===
function log(message) {
    logElement.textContent += message + "\n";
}

// === 초기 실행 ===
function init() {
    setupProductSelection();   // UC1
    setupPaymentMethod();      // UC2
    setupCashButtons();        // UC3
    setupPaymentConfirmation(); // UC4/UC5
    updateInsertedDisplay();
}

init(); // 실행
