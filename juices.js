document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("juice-order");

    if (!form) {
        console.error("Juice order form not found.");
        return;
    }


    // ==========================================
    // WEEKLY MENU + PRICING
    // ==========================================

    const prices = {
        "Jade's Greens Glow": 8,
        "Yellow Watermelon Iced Tea": 7,
        "Custom Flavor": 8
    };

    const quantities = {
        "Jade's Greens Glow": 0,
        "Yellow Watermelon Iced Tea": 0
    };

    const deliveryFee = 8;

    let customQuantity = 0;


    // ==========================================
    // ELEMENTS
    // ==========================================

    const flavorArticles =
        document.querySelectorAll(
            ".flavor[data-flavor]"
        );

    const customFlavor =
        document.getElementById(
            "custom-flavor"
        );

    const customMinus =
        document.getElementById(
            "custom-minus"
        );

    const customPlus =
        document.getElementById(
            "custom-plus"
        );

    const customOutput =
        document.getElementById(
            "custom-quantity"
        );

    const orderDate =
        document.getElementById(
            "order-date"
        );

    const addressField =
        document.getElementById(
            "address-field"
        );

    const deliveryAddress =
        document.getElementById(
            "delivery-address"
        );

    const summaryCount =
        document.getElementById(
            "summary-count"
        );

    const summaryFulfillment =
        document.getElementById(
            "summary-fulfillment"
        );

    const summaryTotal =
        document.getElementById(
            "summary-total"
        );

    const errorBox =
        document.getElementById(
            "order-error"
        );


    // ==========================================
    // FULFILLMENT
    // ==========================================

    function getFulfillment() {

        const selected =
            document.querySelector(
                'input[name="fulfillment"]:checked'
            );

        return selected
            ? selected.value
            : "pickup";
    }


    // ==========================================
    // TOTAL BOTTLES
    // ==========================================

    function getTotalBottles() {

        return (
            quantities["Jade's Greens Glow"] +
            quantities["Yellow Watermelon Iced Tea"] +
            customQuantity
        );
    }


    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    function calculateTotal() {

        let total = 0;

        total +=
            quantities["Jade's Greens Glow"] *
            prices["Jade's Greens Glow"];

        total +=
            quantities["Yellow Watermelon Iced Tea"] *
            prices["Yellow Watermelon Iced Tea"];

        total +=
            customQuantity *
            prices["Custom Flavor"];

        if (
            getFulfillment() === "delivery" &&
            getTotalBottles() > 0
        ) {
            total += deliveryFee;
        }

        return total;
    }


    // ==========================================
    // SUMMARY
    // ==========================================

    function updateSummary() {

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


    // ==========================================
    // ERRORS
    // ==========================================

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
    // REGULAR FLAVOR BUTTONS
    // ==========================================

    flavorArticles.forEach(
        function (article) {

            const flavor =
                article.dataset.flavor;

            const plus =
                article.querySelector(
                    ".plus"
                );

            const minus =
                article.querySelector(
                    ".minus"
                );

            const output =
                article.querySelector(
                    "output"
                );

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

                        quantities[flavor]++;

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

                            quantities[flavor]--;

                            if (output) {
                                output.textContent =
                                    quantities[flavor];
                            }

                            updateSummary();
                        }
                    }
                );
            }
        }
    );


    // ==========================================
    // CUSTOM FLAVOR
    // ==========================================

    if (customPlus) {

        customPlus.addEventListener(
            "click",
            function () {

                if (
                    !customFlavor ||
                    !customFlavor.value.trim()
                ) {

                    showError(
                        "Please type your custom flavor first."
                    );

                    return;
                }

                customQuantity++;

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

                    customQuantity--;

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
    // DELIVERY
    // ==========================================

    document
        .querySelectorAll(
            'input[name="fulfillment"]'
        )
        .forEach(
            function (input) {

                input.addEventListener(
                    "change",
                    function () {

                        const delivery =
                            getFulfillment() === "delivery";

                        if (addressField) {

                            addressField.hidden =
                                !delivery;
                        }

                        if (deliveryAddress) {

                            deliveryAddress.required =
                                delivery;

                            if (!delivery) {

                                deliveryAddress.value =
                                    "";
                            }
                        }

                        updateSummary();
                    }
                );
            }
        );


    // ==========================================
    // ORDER DETAILS
    // ==========================================

    function buildOrderDetails() {

        const lines = [];

        if (
            quantities["Jade's Greens Glow"] > 0
        ) {

            lines.push(
                "Jade's Greens Glow: " +
                quantities["Jade's Greens Glow"]
            );
        }


        if (
            quantities["Yellow Watermelon Iced Tea"] > 0
        ) {

            lines.push(
                "Yellow Watermelon Iced Tea: " +
                quantities["Yellow Watermelon Iced Tea"]
            );
        }


        if (customQuantity > 0) {

            lines.push(
                "Custom Flavor: " +
                customFlavor.value.trim()
            );

            lines.push(
                "Custom Quantity: " +
                customQuantity
            );
        }


        return lines.join("\n");
    }


    // ==========================================
    // SUBMIT
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
                getFulfillment() === "delivery" &&
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


            const total =
                calculateTotal();

            const orderDetails =
                buildOrderDetails();


            // ==================================
            // REVIEW
            // ==================================

            let review =
                "ORDER REVIEW\n\n";

            review +=
                "Customer: " +
                name.value.trim() +
                "\n";

            review +=
                "Phone: " +
                phone.value.trim() +
                "\n\n";

            review +=
                "Bottle Size: 12 oz\n\n";

            review +=
                orderDetails +
                "\n\n";

            review +=
                "Total Bottles: " +
                getTotalBottles() +
                "\n";

            review +=
                "Fulfillment: " +
                (
                    getFulfillment() === "delivery"
                        ? "Delivery"
                        : "Pickup"
                ) +
                "\n";

            review +=
                "Requested Date: " +
                orderDate.value +
                "\n";


            if (
                getFulfillment() === "delivery" &&
                deliveryAddress
            ) {

                review +=
                    "Delivery Address: " +
                    deliveryAddress.value.trim() +
                    "\n";
            }


            review +=
                "\nTOTAL: $" +
                total.toFixed(2);

            review +=
                "\n\nContinue to secure Square payment?";


            if (
                !window.confirm(review)
            ) {

                return;
            }


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Preparing Payment...";
            }


            try {

                // ==================================
                // FORMSPREE
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
                    "12 oz"
                );


                formData.append(
                    "Jade's Greens Glow",
                    quantities["Jade's Greens Glow"]
                );


                formData.append(
                    "Yellow Watermelon Iced Tea",
                    quantities["Yellow Watermelon Iced Tea"]
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
                    getFulfillment() === "delivery" &&
                    deliveryAddress
                        ? deliveryAddress.value.trim()
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

                            body:
                                formData,

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
                        "Order could not be saved."
                    );
                }


                // ==================================
                // SQUARE
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

                                    greensQuantity:
                                        quantities["Jade's Greens Glow"],

                                    teaQuantity:
                                        quantities["Yellow Watermelon Iced Tea"],

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


                const checkoutData =
                    await checkoutResponse.json();


                if (
                    !checkoutResponse.ok ||
                    !checkoutData.paymentUrl
                ) {

                    console.error(
                        checkoutData
                    );

                    throw new Error(
                        "Square checkout could not be created."
                    );
                }


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
        pageParams.get("payment") === "complete"
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


    updateSummary();

});
