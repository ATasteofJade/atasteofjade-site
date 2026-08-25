document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("juice-order");

    if (!form) {
        console.error("Juice order form not found.");
        return;
    }


    // ==========================================
    // PACKAGE PRICING
    // ==========================================

    const packages = {

        "4": {
            label: "4-Pack",
            count: 4,
            price: 44
        },

        "8": {
            label: "8-Pack",
            count: 8,
            price: 88
        },

        "64": {
            label: "64 oz Half Gallon",
            count: 1,
            price: 35
        }

    };


    const deliveryFee = 8;


    // ==========================================
    // FLAVOR QUANTITIES
    // ==========================================

    const quantities = {

        "Green Pastures": 0,

        "Rooted": 0,

        "Restore": 0

    };


    let customQuantity = 0;


    // ==========================================
    // PAGE ELEMENTS
    // ==========================================

    const flavorArticles =
        Array.from(
            document.querySelectorAll(
                ".flavor[data-flavor]"
            )
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


    const errorBox =
        document.getElementById(
            "order-error"
        );


    // ==========================================
    // MINIMUM ORDER DATE
    // ==========================================

    if (orderDate) {

        const fiveDaysAhead =
            new Date();

        fiveDaysAhead.setDate(
            fiveDaysAhead.getDate() + 5
        );

        orderDate.min =
            fiveDaysAhead
                .toISOString()
                .split("T")[0];

    }


    // ==========================================
    // HELPERS
    // ==========================================

    function getSelectedPackageId() {

        const selected =
            document.querySelector(
                'input[name="package"]:checked'
            );

        return selected
            ? selected.value
            : null;

    }


    function getPackageInfo() {

        const packageId =
            getSelectedPackageId();

        if (!packageId) {
            return null;
        }

        return packages[packageId];

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


    function getSelectedCount() {

        let total = 0;

        Object.values(
            quantities
        ).forEach(function (quantity) {

            total += quantity;

        });

        total +=
            customQuantity;

        return total;

    }


    function calculateTotal() {

        const packageInfo =
            getPackageInfo();

        if (!packageInfo) {
            return 0;
        }

        let total =
            packageInfo.price;

        if (
            getFulfillment() ===
            "delivery"
        ) {

            total +=
                deliveryFee;

        }

        return total;

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

            errorBox.textContent =
                "";

        }

    }


    // ==========================================
    // RESET QUANTITIES
    // ==========================================

    function resetQuantities() {

        Object.keys(
            quantities
        ).forEach(function (flavor) {

            quantities[flavor] =
                0;

        });


        customQuantity =
            0;


        flavorArticles.forEach(
            function (article) {

                const output =
                    article.querySelector(
                        "output"
                    );

                if (output) {

                    output.textContent =
                        "0";

                }

            }
        );


        if (customOutput) {

            customOutput.textContent =
                "0";

        }

    }


    // ==========================================
    // UPDATE SUMMARY
    // ==========================================

    function updateSummary() {

        const packageInfo =
            getPackageInfo();


        const count =
            getSelectedCount();


        const packageSummary =
            document.getElementById(
                "summary-package"
            );


        const countSummary =
            document.getElementById(
                "summary-count"
            );


        const fulfillmentSummary =
            document.getElementById(
                "summary-fulfillment"
            );


        const totalSummary =
            document.getElementById(
                "summary-total"
            );


        const flavorHelp =
            document.getElementById(
                "flavor-help"
            );


        if (packageSummary) {

            packageSummary.textContent =
                packageInfo
                    ? packageInfo.label +
                      " · $" +
                      packageInfo.price
                    : "None selected";

        }


        if (countSummary) {

            countSummary.textContent =
                packageInfo
                    ? count +
                      " of " +
                      packageInfo.count
                    : count;

        }


        if (fulfillmentSummary) {

            fulfillmentSummary.textContent =
                getFulfillment() ===
                "delivery"
                    ? "Delivery · $8"
                    : "Pickup · Free";

        }


        if (totalSummary) {

            totalSummary.textContent =
                "$" +
                calculateTotal()
                    .toFixed(2);

        }


        if (flavorHelp) {

            if (packageInfo) {

                if (
                    getSelectedPackageId() ===
                    "64"
                ) {

                    flavorHelp.textContent =
                        "Choose 1 flavor for your 64 oz half gallon.";

                } else {

                    flavorHelp.textContent =
                        "Choose exactly " +
                        packageInfo.count +
                        " bottles for your " +
                        packageInfo.label +
                        ".";

                }

            } else {

                flavorHelp.textContent =
                    "Choose a package first.";

            }

        }


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


                if (plus) {

                    plus.disabled =
                        !packageInfo ||
                        count >=
                        packageInfo.count;

                }


                if (minus) {

                    minus.disabled =
                        quantities[flavor] <=
                        0;

                }

            }
        );


        if (customPlus) {

            customPlus.disabled =
                !packageInfo ||
                count >=
                packageInfo.count;

        }


        if (customMinus) {

            customMinus.disabled =
                customQuantity <=
                0;

        }

    }


    // ==========================================
    // PACKAGE RADIO BUTTONS
    // ==========================================

    document
        .querySelectorAll(
            'input[name="package"]'
        )
        .forEach(function (input) {

            input.addEventListener(
                "change",
                function () {

                    resetQuantities();

                    clearError();

                    updateSummary();

                }
            );

        });


    // ==========================================
    // FLAVOR BUTTONS
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


            if (plus) {

                plus.addEventListener(
                    "click",
                    function () {

                        const packageInfo =
                            getPackageInfo();


                        if (!packageInfo) {

                            showError(
                                "Please choose a package first."
                            );

                            return;

                        }


                        if (
                            getSelectedCount() >=
                            packageInfo.count
                        ) {

                            return;

                        }


                        quantities[flavor] +=
                            1;


                        if (output) {

                            output.textContent =
                                quantities[
                                    flavor
                                ];

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
                            quantities[flavor] >
                            0
                        ) {

                            quantities[flavor] -=
                                1;

                        }


                        if (output) {

                            output.textContent =
                                quantities[
                                    flavor
                                ];

                        }


                        updateSummary();

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

                const packageInfo =
                    getPackageInfo();


                if (!packageInfo) {

                    showError(
                        "Please choose a package first."
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


                if (
                    getSelectedCount() >=
                    packageInfo.count
                ) {

                    return;

                }


                customQuantity +=
                    1;


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

                if (
                    customQuantity >
                    0
                ) {

                    customQuantity -=
                        1;

                }


                if (customOutput) {

                    customOutput.textContent =
                        customQuantity;

                }


                updateSummary();

            }
        );

    }


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


        Object.keys(
            quantities
        ).forEach(function (flavor) {

            if (
                quantities[flavor] >
                0
            ) {

                lines.push(
                    flavor +
                    ": " +
                    quantities[flavor]
                );

            }

        });


        if (
            customQuantity >
            0 &&
            customFlavor
        ) {

            lines.push(
                "Custom Flavor: " +
                customFlavor
                    .value
                    .trim()
            );


            lines.push(
                "Custom Quantity: " +
                customQuantity
            );

        }


        return lines.join(
            "\n"
        );

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


            const packageId =
                getSelectedPackageId();


            const packageInfo =
                getPackageInfo();


            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


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


            if (!packageInfo) {

                showError(
                    "Please choose a juice package."
                );

                return;

            }


            if (
                getSelectedCount() !==
                packageInfo.count
            ) {

                showError(
                    "Please select exactly " +
                    packageInfo.count +
                    (
                        packageInfo.count ===
                        1
                            ? " flavor."
                            : " bottles."
                    )
                );

                return;

            }


            if (
                customQuantity >
                0 &&
                (
                    !customFlavor ||
                    !customFlavor
                        .value
                        .trim()
                )
            ) {

                showError(
                    "Please enter your custom flavor."
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
                    !deliveryAddress
                        .value
                        .trim()
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
            // ORDER REVIEW
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
                "Package: " +
                packageInfo.label +
                "\n\n";


            review +=
                orderDetails +
                "\n\n";


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
                "Requested Date: " +
                orderDate.value +
                "\n";


            if (
                getFulfillment() ===
                "delivery"
            ) {

                review +=
                    "Delivery Address: " +
                    deliveryAddress
                        .value
                        .trim() +
                    "\n";

            }


            review +=
                "\nTOTAL: $" +
                total.toFixed(2);


            review +=
                "\n\nContinue to secure Square payment?";


            const confirmed =
                window.confirm(
                    review
                );


            if (!confirmed) {

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
                    "Package",
                    packageInfo.label
                );


                formData.append(
                    "Green Pastures",
                    quantities[
                        "Green Pastures"
                    ]
                );


                formData.append(
                    "Rooted",
                    quantities[
                        "Rooted"
                    ]
                );


                formData.append(
                    "Restore",
                    quantities[
                        "Restore"
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
                    "delivery"
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

                            method:
                                "POST",

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

                            method:
                                "POST",


                            headers: {

                                "Content-Type":
                                    "application/json"

                            },


                            body:
                                JSON.stringify({

                                    customerName:
                                        name.value.trim(),

                                    packageId:
                                        packageId,

                                    quantities:
                                        quantities,

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
                    await checkoutResponse
                        .json();


                if (
                    !checkoutResponse.ok ||
                    !checkoutData.paymentUrl
                ) {

                    throw new Error(
                        checkoutData.error ||
                        "Square checkout could not be created."
                    );

                }


                window.location.assign(
                    checkoutData.paymentUrl
                );


            } catch (error) {


                console.error(
                    error
                );


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
        pageParams.get(
            "payment"
        ) ===
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


    updateSummary();

});
