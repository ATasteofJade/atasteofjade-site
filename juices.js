document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("juice-order");

    if (!form) {
        console.error("Juice order form not found.");
        return;
    }

    // ==========================================
    // PRICING
    // ==========================================

    const prices = {
        12: 8,
        16: 11
    };

    const deliveryFee = 8;

    // ==========================================
    // QUANTITIES
    // ==========================================

    const quantities = {
        "Yellow Watermelon": 0,
        "Red Watermelon": 0
    };

    let customQuantity = 0;

    // ==========================================
    // PAGE ELEMENTS
    // ==========================================

    const flavorArticles =
        document.querySelectorAll(".flavor[data-flavor]");

    const customFlavor =
        document.getElementById("custom-flavor");

    const customMinus =
        document.getElementById("custom-minus");

    const customPlus =
        document.getElementById("custom-plus");

    const customOutput =
        document.getElementById("custom-quantity");

    const orderDate =
        document.getElementById("order-date");

    const addressField =
        document.getElementById("address-field");

    const deliveryAddress =
        document.getElementById("delivery-address");

    const summarySize =
        document.getElementById("summary-size");

    const summaryCount =
        document.getElementById("summary-count");

    const summaryFulfillment =
        document.getElementById("summary-fulfillment");

    const summaryTotal =
        document.getElementById("summary-total");

    const errorBox =
        document.getElementById("order-error");

    // ==========================================
    // HELPERS
    // ==========================================

    function getSelectedSize() {
        const selected =
            document.querySelector(
                'input[name="size"]:checked'
            );

        return selected
            ? selected.value
            : null;
    }

    function getFulfillment() {
        const selected =
            document.querySelector(
                'input[name="fulfillment"]:checked'
            );

        return selected
            ? selected.value
            : "pickup";
    }

    function getTotalBottles() {
        return (
            quantities["Yellow Watermelon"] +
            quantities["Red Watermelon"] +
            customQuantity
        );
    }

    function calculateTotal() {
        const size =
            getSelectedSize();

        if (!size) {
            return 0;
        }

        let total =
            getTotalBottles() *
            prices[size];

        if (
            getFulfillment() === "delivery" &&
            getTotalBottles() > 0
        ) {
            total += deliveryFee;
        }

        return total;
    }

    function updateSummary() {
        const size =
            getSelectedSize();

        if (summarySize) {
            summarySize.textContent =
                size
                    ? `${size} oz · $${prices[size]} each`
                    : "None selected";
        }

        if (summaryCount) {
            summaryCount.textContent =
                getTotalBottles();
        }

        if (summaryFulfillment) {
            summaryFulfillment.textContent =
                getFulfillment() === "delivery"
                    ? "Delivery · $8"
                    : "Pickup · Free";
        }

        if (summaryTotal) {
            summaryTotal.textContent =
                "$" +
                calculateTotal().toFixed(2);
        }
    }

    function showError(message) {
        if (errorBox) {
            errorBox.textContent =
                message;

            errorBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } else {
            alert(message);
        }
    }

    function clearError() {
        if (errorBox) {
            errorBox.textContent = "";
        }
    }

    // ==========================================
    // YELLOW + RED WATERMELON BUTTONS
    // ==========================================

    flavorArticles.forEach(function (article) {
        const flavor =
            article.dataset.flavor;

        const minus =
            article.querySelector(".minus");

        const plus =
            article.querySelector(".plus");

        const output =
            article.querySelector("output");

        if (
            !Object.prototype.hasOwnProperty.call(
                quantities,
                flavor
            )
        ) {
            return;
        }

        if (plus) {
            plus.addEventListener(
                "click",
                function () {
                    if (!getSelectedSize()) {
                        showError(
                            "Please choose a bottle size first."
                        );
                        return;
                    }

                    quantities[flavor] += 1;

                    if (output) {
                        output.textContent =
                            quantities[flavor];
                    }

                    clearError();
                    updateSummary();
                }
            );
        }

        if (minus) {
            minus.addEventListener(
                "click",
                function () {
                    if (
                        quantities[flavor] > 0
                    ) {
                        quantities[flavor] -= 1;

                        if (output) {
                            output.textContent =
                                quantities[flavor];
                        }

                        updateSummary();
                    }
                }
            );
        }
    });

    // ==========================================
    // CUSTOM FLAVOR BUTTONS
    // ==========================================

    if (customPlus) {
        customPlus.addEventListener(
            "click",
            function () {
                if (!getSelectedSize()) {
                    showError(
                        "Please choose a bottle size first."
                    );
                    return;
                }

                if (
                    !customFlavor ||
                    !customFlavor.value.trim()
                ) {
                    showError(
                        "Please type your custom flavor first."
                    );
                    return;
                }

                customQuantity += 1;

                if (customOutput) {
                    customOutput.textContent =
                        customQuantity;
                }

                clearError();
                updateSummary();
            }
        );
    }

    if (customMinus) {
        customMinus.addEventListener(
            "click",
            function () {
                if (customQuantity > 0) {
                    customQuantity -= 1;

                    if (customOutput) {
                        customOutput.textContent =
                            customQuantity;
                    }

                    updateSummary();
                }
            }
        );
    }

    // ==========================================
    // SIZE CHANGE
    // ==========================================

    document
        .querySelectorAll(
            'input[name="size"]'
        )
        .forEach(function (input) {
            input.addEventListener(
                "change",
                function () {
                    clearError();
                    updateSummary();
                }
            );
        });

    // ==========================================
    // PICKUP / DELIVERY
    // ==========================================

    document
        .querySelectorAll(
            'input[name="fulfillment"]'
        )
        .forEach(function (input) {
            input.addEventListener(
                "change",
                function () {
                    const isDelivery =
                        getFulfillment() ===
                        "delivery";

                    if (addressField) {
                        addressField.hidden =
                            !isDelivery;
                    }

                    if (deliveryAddress) {
                        deliveryAddress.required =
                            isDelivery;

                        if (!isDelivery) {
                            deliveryAddress.value =
                                "";
                        }
                    }

                    updateSummary();
                }
            );
        });

    // ==========================================
    // BUILD ORDER DETAILS
    // ==========================================

    function buildOrderDetails() {
        const lines = [];

        if (
            quantities[
                "Yellow Watermelon"
            ] > 0
        ) {
            lines.push(
                `Yellow Watermelon: ${
                    quantities[
                        "Yellow Watermelon"
                    ]
                }`
            );
        }

        if (
            quantities[
                "Red Watermelon"
            ] > 0
        ) {
            lines.push(
                `Red Watermelon: ${
                    quantities[
                        "Red Watermelon"
                    ]
                }`
            );
        }

        if (
            customQuantity > 0 &&
            customFlavor
        ) {
            lines.push(
                `Custom Flavor: ${
                    customFlavor.value.trim()
                }`
            );

            lines.push(
                `Custom Quantity: ${customQuantity}`
            );
        }

        return lines.join("\n");
    }

    // ==========================================
    // SUBMIT ORDER
    // ==========================================

    form.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            clearError();

            const name =
                document.getElementById(
                    "name"
                );

            const phone =
                document.getElementById(
                    "phone"
                );

            const instagram =
                document.getElementById(
                    "instagram"
                );

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );

            // ==================================
            // VALIDATION
            // ==================================

            if (
                !name ||
                !name.value.trim()
            ) {
                showError(
                    "Please enter your full name."
                );
                return;
            }

            if (
                !phone ||
                !phone.value.trim()
            ) {
                showError(
                    "Please enter your phone number."
                );
                return;
            }

            const size =
                getSelectedSize();

            if (!size) {
                showError(
                    "Please choose a bottle size."
                );
                return;
            }

            if (
                getTotalBottles() < 1
            ) {
                showError(
                    "Please add at least one juice."
                );
                return;
            }

            if (
                customQuantity > 0 &&
                (
                    !customFlavor ||
                    !customFlavor.value.trim()
                )
            ) {
                showError(
                    "Please enter your custom flavor."
                );
                return;
            }

            if (
                customFlavor &&
                customFlavor.value.trim() &&
                customQuantity === 0
            ) {
                showError(
                    "Please choose a quantity for your custom flavor."
                );
                return;
            }

            if (
                !orderDate ||
                !orderDate.value
            ) {
                showError(
                    "Please choose your preferred order date."
                );
                return;
            }

            if (
                getFulfillment() ===
                    "delivery" &&
                (
                    !deliveryAddress ||
                    !deliveryAddress.value.trim()
                )
            ) {
                showError(
                    "Please enter your delivery address."
                );
                return;
            }

            const orderDetails =
                buildOrderDetails();

            const total =
                calculateTotal();

            // ==================================
            // ORDER REVIEW POPUP
            // ==================================

            let review =
                "ORDER REVIEW\n\n";

            review +=
                `Customer: ${name.value.trim()}\n`;

            review +=
                `Phone: ${phone.value.trim()}\n\n`;

            review +=
                `Bottle Size: ${size} oz\n\n`;

            review +=
                orderDetails + "\n\n";

            review +=
                `Total Bottles: ${getTotalBottles()}\n`;

            review +=
                "Fulfillment: " +
                (
                    getFulfillment() ===
                    "delivery"
                        ? "Delivery"
                        : "Pickup"
                ) +
                "\n";

            review +=
                `Requested Date: ${orderDate.value}\n`;

            if (
                getFulfillment() ===
                "delivery" &&
                deliveryAddress
            ) {
                review +=
                    "Delivery Address: " +
                    deliveryAddress
                        .value
                        .trim() +
                    "\n";
            }

            review +=
                `\nTOTAL: $${total.toFixed(2)}`;

            review +=
                "\n\nContinue to secure Square payment?";

            const confirmed =
                window.confirm(review);

            if (!confirmed) {
                return;
            }

            // ==================================
            // BUTTON STATE
            // ==================================

            if (submitButton) {
                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Preparing Payment...";
            }

            try {
                // ==================================
                // SAVE ORDER TO FORMSPREE
                // ==================================

                const formData =
                    new FormData();

                formData.append(
                    "Customer Name",
                    name.value.trim()
                );

                formData.append(
                    "Phone Number",
                    phone.value.trim()
                );

                formData.append(
                    "Instagram",
                    instagram &&
                    instagram.value.trim()
                        ? instagram.value.trim()
                        : "Not provided"
                );

                formData.append(
                    "Bottle Size",
                    size + " oz"
                );

                formData.append(
                    "Yellow Watermelon",
                    quantities[
                        "Yellow Watermelon"
                    ]
                );

                formData.append(
                    "Red Watermelon",
                    quantities[
                        "Red Watermelon"
                    ]
                );

                formData.append(
                    "Custom Flavor",
                    customFlavor &&
                    customFlavor.value.trim()
                        ? customFlavor.value.trim()
                        : "None"
                );

                formData.append(
                    "Custom Quantity",
                    customQuantity
                );

                formData.append(
                    "Total Bottles",
                    getTotalBottles()
                );

                formData.append(
                    "Fulfillment",
                    getFulfillment()
                );

                formData.append(
                    "Requested Date",
                    orderDate.value
                );

                formData.append(
                    "Delivery Address",
                    getFulfillment() ===
                        "delivery" &&
                    deliveryAddress
                        ? deliveryAddress
                              .value
                              .trim()
                        : "N/A"
                );

                formData.append(
                    "Order Total",
                    "$" +
                    total.toFixed(2)
                );

                formData.append(
                    "Payment Status",
                    "Awaiting Square payment"
                );

                formData.append(
                    "_subject",
                    "NEW A TASTE OF JADE JUICE ORDER"
                );

                const formspreeResponse =
                    await fetch(
                        "https://formspree.io/f/mvzewrnk",
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );

                if (
                    !formspreeResponse.ok
                ) {
                    throw new Error(
                        "Order could not be saved to Formspree."
                    );
                }

                // ==================================
                // CREATE SQUARE CHECKOUT
                // ==================================

                if (submitButton) {
                    submitButton.textContent =
                        "Opening Square...";
                }

                const checkoutResponse =
                    await fetch(
                        "https://atasteofjade-site.vercel.app/api/create-checkout",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    customerName:
                                        name.value.trim(),

                                    bottleSize:
                                        size,

                                    yellowQuantity:
                                        quantities[
                                            "Yellow Watermelon"
                                        ],

                                    redQuantity:
                                        quantities[
                                            "Red Watermelon"
                                        ],

                                    customQuantity:
                                        customQuantity,

                                    customFlavor:
                                        customFlavor &&
                                        customFlavor.value.trim()
                                            ? customFlavor.value.trim()
                                            : "",

                                    fulfillment:
                                        getFulfillment()
                                })
                        }
                    );

                let checkoutData;

                try {
                    checkoutData =
                        await checkoutResponse.json();
                } catch (jsonError) {
                    console.error(
                        "Checkout JSON error:",
                        jsonError
                    );

                    throw new Error(
                        "Square checkout returned an invalid response."
                    );
                }

                if (
                    !checkoutResponse.ok ||
                    !checkoutData.paymentUrl
                ) {
                    console.error(
                        "Square checkout error:",
                        checkoutData
                    );

                    throw new Error(
                        checkoutData &&
                        checkoutData.error
                            ? checkoutData.error
                            : "Square checkout could not be created."
                    );
                }

                // ==================================
                // REDIRECT TO SQUARE
                // ==================================

                window.location.assign(
                    checkoutData.paymentUrl
                );

            } catch (error) {
                console.error(error);

                showError(
                    "We couldn't open Square payment. Your card was not charged. Please try again."
                );

                if (submitButton) {
                    submitButton.disabled =
                        false;

                    submitButton.innerHTML =
                        "Review Order <span>→</span>";
                }
            }
        }
    );

    // ==========================================
    // RETURN FROM SQUARE
    // ==========================================

    const pageParams =
        new URLSearchParams(
            window.location.search
        );

    if (
        pageParams.get("payment") ===
        "complete"
    ) {
        alert(
            "Thank you! 💚 Your Square checkout is complete. A Taste of Jade will confirm your order details."
        );

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    updateSummary();
});
