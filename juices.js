document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // A TASTE OF JADE — JUICE ORDER PAGE
    // ==========================================

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
    // PAGE ELEMENTS
    // ==========================================

    const sizeInputs =
        document.querySelectorAll('input[name="size"]');

    const fulfillmentInputs =
        document.querySelectorAll('input[name="fulfillment"]');

    const flavorArticles =
        document.querySelectorAll(".flavor");

    const orderDate =
        document.getElementById("order-date");

    const addressField =
        document.getElementById("address-field");

    const deliveryAddress =
        document.getElementById("delivery-address");

    const errorBox =
        document.getElementById("order-error");


    // ==========================================
    // SUMMARY ELEMENTS
    // ==========================================

    const summarySize =
        document.getElementById("summary-size");

    const summaryCount =
        document.getElementById("summary-count");

    const summaryTotal =
        document.getElementById("summary-total");

    const summaryFulfillment =
        document.getElementById("summary-fulfillment");


    // ==========================================
    // JUICE QUANTITIES
    // ==========================================

    let quantities = {};

    flavorArticles.forEach(function (article) {

        const flavorName = article.dataset.flavor;

        quantities[flavorName] = 0;

        const minusButton =
            article.querySelector(".minus");

        const plusButton =
            article.querySelector(".plus");

        const output =
            article.querySelector("output");


        // PLUS BUTTON

        if (plusButton) {

            plusButton.addEventListener("click", function () {

                quantities[flavorName]++;

                if (output) {
                    output.textContent =
                        quantities[flavorName];
                }

                updateSummary();

            });

        }


        // MINUS BUTTON

        if (minusButton) {

            minusButton.addEventListener("click", function () {

                if (quantities[flavorName] > 0) {

                    quantities[flavorName]--;

                    if (output) {
                        output.textContent =
                            quantities[flavorName];
                    }

                    updateSummary();

                }

            });

        }

    });


    // ==========================================
    // CUSTOM FLAVOR
    // ==========================================

    const customFlavor =
        document.getElementById("custom-flavor");

    const customMinus =
        document.getElementById("custom-minus");

    const customPlus =
        document.getElementById("custom-plus");

    const customOutput =
        document.getElementById("custom-quantity");

    let customQuantity = 0;


    // CUSTOM PLUS

    if (customPlus) {

        customPlus.addEventListener("click", function () {

            customQuantity++;

            if (customOutput) {
                customOutput.textContent =
                    customQuantity;
            }

            updateSummary();

        });

    }


    // CUSTOM MINUS

    if (customMinus) {

        customMinus.addEventListener("click", function () {

            if (customQuantity > 0) {

                customQuantity--;

                if (customOutput) {
                    customOutput.textContent =
                        customQuantity;
                }

                updateSummary();

            }

        });

    }


    // ==========================================
    // BOTTLE SIZE
    // ==========================================

    sizeInputs.forEach(function (input) {

        input.addEventListener("change", function () {

            updateSummary();

        });

    });


    // ==========================================
    // PICKUP / DELIVERY
    // ==========================================

    fulfillmentInputs.forEach(function (input) {

        input.addEventListener("change", function () {

            const fulfillment =
                document.querySelector(
                    'input[name="fulfillment"]:checked'
                );

            if (
                fulfillment &&
                fulfillment.value === "delivery"
            ) {

                if (addressField) {
                    addressField.hidden = false;
                }

                if (deliveryAddress) {
                    deliveryAddress.required = true;
                }

            } else {

                if (addressField) {
                    addressField.hidden = true;
                }

                if (deliveryAddress) {
                    deliveryAddress.required = false;
                    deliveryAddress.value = "";
                }

            }

            updateSummary();

        });

    });


    // ==========================================
    // GET SELECTED BOTTLE SIZE
    // ==========================================

    function getSelectedSize() {

        const selected =
            document.querySelector(
                'input[name="size"]:checked'
            );

        if (!selected) {
            return null;
        }

        return selected.value;

    }


    // ==========================================
    // TOTAL NUMBER OF BOTTLES
    // ==========================================

    function getTotalBottles() {

        let total = 0;

        Object.values(quantities).forEach(
            function (quantity) {

                total += quantity;

            }
        );

        total += customQuantity;

        return total;

    }


    // ==========================================
    // CALCULATE ORDER TOTAL
    // ==========================================

    function calculateTotal() {

        const size =
            getSelectedSize();

        if (!size) {
            return 0;
        }

        const bottles =
            getTotalBottles();

        let total =
            bottles * prices[size];

        const fulfillment =
            document.querySelector(
                'input[name="fulfillment"]:checked'
            );

        if (
            fulfillment &&
            fulfillment.value === "delivery" &&
            bottles > 0
        ) {

            total += deliveryFee;

        }

        return total;

    }


    // ==========================================
    // UPDATE ORDER SUMMARY
    // ==========================================

    function updateSummary() {

        const size =
            getSelectedSize();

        const bottleCount =
            getTotalBottles();

        const total =
            calculateTotal();

        const fulfillment =
            document.querySelector(
                'input[name="fulfillment"]:checked'
            );


        // SIZE

        if (summarySize) {

            if (size) {

                summarySize.textContent =
                    size +
                    " oz · $" +
                    prices[size] +
                    " each";

            } else {

                summarySize.textContent =
                    "None selected";

            }

        }


        // BOTTLE COUNT

        if (summaryCount) {

            summaryCount.textContent =
                bottleCount;

        }


        // TOTAL

        if (summaryTotal) {

            summaryTotal.textContent =
                "$" + total.toFixed(2);

        }


        // FULFILLMENT

        if (summaryFulfillment) {

            if (
                fulfillment &&
                fulfillment.value === "delivery"
            ) {

                summaryFulfillment.textContent =
                    "Delivery · $8";

            } else {

                summaryFulfillment.textContent =
                    "Pickup · Free";

            }

        }

    }


    // ==========================================
    // BUILD JUICE ORDER DETAILS
    // ==========================================

    function buildOrderDetails() {

        let details = "";

        Object.keys(quantities).forEach(
            function (flavor) {

                if (quantities[flavor] > 0) {

                    details +=
                        flavor +
                        ": " +
                        quantities[flavor] +
                        "\n";

                }

            }
        );


        // CUSTOM FLAVOR

        if (
            customQuantity > 0 &&
            customFlavor &&
            customFlavor.value.trim() !== ""
        ) {

            details +=
                "Custom Flavor: " +
                customFlavor.value.trim() +
                "\n";

            details +=
                "Custom Flavor Quantity: " +
                customQuantity +
                "\n";

        }

        return details;

    }


    // ==========================================
    // FORM SUBMISSION
    // ==========================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (errorBox) {
                errorBox.textContent = "";
            }


            // CUSTOMER INFORMATION

            const name =
                document.getElementById("name");

            const phone =
                document.getElementById("phone");

            const instagram =
                form.querySelector(
                    '[name="instagram"]'
                );


            // ==================================
            // VALIDATION
            // ==================================


            // NAME

            if (
                !name ||
                name.value.trim() === ""
            ) {

                showError(
                    "Please enter your full name."
                );

                return;

            }


            // PHONE

            if (
                !phone ||
                phone.value.trim() === ""
            ) {

                showError(
                    "Please enter your phone number."
                );

                return;

            }


            // SIZE

            const size =
                getSelectedSize();

            if (!size) {

                showError(
                    "Please choose a bottle size."
                );

                return;

            }


            // JUICE QUANTITY

            const bottleCount =
                getTotalBottles();

            if (bottleCount < 1) {

                showError(
                    "Please add at least one juice to your order."
                );

                return;

            }


            // CUSTOM FLAVOR CHECK

            if (
                customQuantity > 0 &&
                (
                    !customFlavor ||
                    customFlavor.value.trim() === ""
                )
            ) {

                showError(
                    "Please enter the custom flavor you are requesting."
                );

                return;

            }


            // CUSTOM FLAVOR TEXT BUT NO QUANTITY

            if (
                customFlavor &&
                customFlavor.value.trim() !== "" &&
                customQuantity === 0
            ) {

                showError(
                    "Please choose a quantity for your custom flavor."
                );

                return;

            }


            // ORDER DATE

            if (
                orderDate &&
                orderDate.value === ""
            ) {

                showError(
                    "Please choose your preferred order date."
                );

                return;

            }


            // FULFILLMENT

            const fulfillment =
                document.querySelector(
                    'input[name="fulfillment"]:checked'
                );


            // DELIVERY ADDRESS

            if (
                fulfillment &&
                fulfillment.value === "delivery"
            ) {

                if (
                    !deliveryAddress ||
                    deliveryAddress.value.trim() === ""
                ) {

                    showError(
                        "Please enter your delivery address."
                    );

                    return;

                }

            }


            // ==================================
            // BUILD ORDER REVIEW
            // ==================================

            const orderDetails =
                buildOrderDetails();

            const total =
                calculateTotal();


            let review =
                "ORDER REVIEW\n\n";


            review +=
                "Customer: " +
                name.value.trim() +
                "\n";


            review +=
                "Phone: " +
                phone.value.trim() +
                "\n";


            if (
                instagram &&
                instagram.value.trim() !== ""
            ) {

                review +=
                    "Instagram: " +
                    instagram.value.trim() +
                    "\n";

            }


            review +=
                "\nBottle Size: " +
                size +
                " oz\n\n";


            review +=
                orderDetails +
                "\n";


            review +=
                "Total Bottles: " +
                bottleCount +
                "\n";


            review +=
                "Fulfillment: " +
                (
                    fulfillment &&
                    fulfillment.value === "delivery"
                        ? "Delivery"
                        : "Pickup"
                ) +
                "\n";


            if (
                orderDate &&
                orderDate.value
            ) {

                review +=
                    "Requested Date: " +
                    orderDate.value +
                    "\n";

            }


            if (
                fulfillment &&
                fulfillment.value === "delivery" &&
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


            // ==================================
            // CUSTOMER REVIEWS ORDER
            // ==================================

            const confirmed =
                window.confirm(review);


            if (!confirmed) {

                return;

            }


            // ==================================
            // DISABLE BUTTON WHILE SENDING
            // ==================================

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Sending Order...";

            }


            // ==================================
            // PREPARE FORMSPREE ORDER
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


            if (
                instagram &&
                instagram.value.trim() !== ""
            ) {

                formData.append(
                    "Instagram",
                    instagram.value.trim()
                );

            }


            formData.append(
                "Bottle Size",
                size + " oz"
            );


            // INDIVIDUAL JUICE FLAVORS

            Object.keys(quantities).forEach(
                function (flavor) {

                    if (quantities[flavor] > 0) {

                        formData.append(
                            flavor,
                            quantities[flavor]
                        );

                    }

                }
            );


            // CUSTOM FLAVOR

            if (
                customFlavor &&
                customFlavor.value.trim() !== "" &&
                customQuantity > 0
            ) {

                formData.append(
                    "Custom Flavor Request",
                    customFlavor.value.trim()
                );


                formData.append(
                    "Custom Flavor Quantity",
                    customQuantity
                );

            }


            formData.append(
                "Total Bottles",
                bottleCount
            );


            formData.append(
                "Fulfillment",
                fulfillment &&
                fulfillment.value === "delivery"
                    ? "Delivery"
                    : "Pickup"
            );


            if (
                orderDate &&
                orderDate.value
            ) {

                formData.append(
                    "Requested Order Date",
                    orderDate.value
                );

            }


            if (
                fulfillment &&
                fulfillment.value === "delivery" &&
                deliveryAddress
            ) {

                formData.append(
                    "Delivery Address",
                    deliveryAddress.value.trim()
                );

            }


            formData.append(
                "Order Total",
                "$" + total.toFixed(2)
            );


            formData.append(
                "Full Order Details",
                orderDetails
            );


            formData.append(
                "_subject",
                "NEW A TASTE OF JADE JUICE ORDER"
            );


            // ==================================
            // SEND ORDER TO FORMSPREE
            // ==================================

            try {

                const response =
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


                if (response.ok) {

                    alert(
                        "Order received! 💚\n\nYour A Taste of Jade order request was successfully submitted. You'll receive confirmation before your order is finalized."
                    );


                    // ==================================
                    // SQUARE PAYMENT WILL GO HERE NEXT
                    // ==================================

                } else {

                    const responseData =
                        await response.json();

                    console.error(
                        "Formspree error:",
                        responseData
                    );

                    throw new Error(
                        "Formspree submission failed."
                    );

                }


            } catch (error) {

                console.error(error);

                showError(
                    "Your order could not be submitted. Please try again."
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        "Review Order <span>→</span>";

                }

            }

        }
    );


    // ==========================================
    // SHOW ERROR MESSAGE
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


    // ==========================================
    // INITIALIZE PAGE
    // ==========================================

    updateSummary();

});
