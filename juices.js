document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("juice-order");


    if (!form) {

        console.error(
            "Juice order form not found."
        );

        return;

    }


    // ==========================================
    // PACKAGE PRICING
    // ==========================================

    const packages = {

        "1": {
            label: "1 Bottle",
            count: 1,
            price: 11
        },

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
    // GUARANTEE FLAVOR STATE
    // ==========================================

    flavorArticles.forEach(function (article) {

        const flavor =
            article.dataset.flavor;


        if (
            typeof quantities[flavor] !== "number" ||
            Number.isNaN(
                quantities[flavor]
            )
        ) {

            quantities[flavor] = 0;

        }

    });


    // ==========================================
    // MINIMUM ORDER DATE
    // CUSTOMERS CAN CHOOSE TODAY OR LATER
    // ==========================================

    if (orderDate) {

        const today =
            new Date();


        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        orderDate.min =
            `${year}-${month}-${day}`;

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


        return packageId
            ? packages[packageId] || null
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


    function normalizeFlavor(
        flavor
    ) {

        if (
            typeof quantities[flavor] !== "number" ||
            Number.isNaN(
                quantities[flavor]
            )
        ) {

            quantities[flavor] = 0;

        }


        return quantities[flavor];

    }


    function getSelectedCount() {

        let total = 0;


        Object.keys(
            quantities
        ).forEach(function (flavor) {

            normalizeFlavor(
                flavor
            );


            total +=
                quantities[flavor];

        });


        customQuantity =
            Number(customQuantity) || 0;


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


    function showError(
        message
    ) {

        if (errorBox) {

            errorBox.textContent =
                message;


            errorBox.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        } else {

            alert(
                message
            );

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

            quantities[flavor] = 0;

        });


        customQuantity = 0;


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


        const packageId =
            getSelectedPackageId();


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

            if (!packageInfo) {

                flavorHelp.textContent =
                    "Choose a package first.";

            } else if (
                packageId === "1"
            ) {

                flavorHelp.textContent =
                    "Choose 1 flavor for your 16 oz bottle.";

            } else if (
                packageId === "64"
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

        }


        flavorArticles.forEach(
            function (article) {

                const flavor =
                    article.dataset.flavor;


                normalizeFlavor(
                    flavor
                );


                const output =
                    article.querySelector(
                        "output"
                    );


                const plus =
                    article.querySelector(
                        ".plus"
                    );


                const minus =
                    article.querySelector(
                        ".minus"
                    );


                if (output) {

                    output.textContent =
                        quantities[flavor];

                }


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


        if (customOutput) {

            customOutput.textContent =
                customQuantity;

        }


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
    // FLAVOR + / -
    // ==========================================

    flavorArticles.forEach(
        function (article) {

            const flavor =
                article.dataset.flavor;


            normalizeFlavor(
                flavor
            );


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


                        normalizeFlavor(
                            flavor
                        );


                        if (
                            getSelectedCount() >=
                            packageInfo.count
                        ) {

                            return;

                        }


                        quantities[flavor] =
                            quantities[flavor] +
                            1;


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

                        normalizeFlavor(
                            flavor
                        );


                        if (
                            quantities[flavor] >
                            0
                        ) {

                            quantities[flavor] =
                                quantities[flavor] -
                                1;

                        }


                        if (output) {

                            output.textContent =
                                quantities[flavor];

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


                customQuantity =
                    Number(customQuantity) || 0;


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

                customQuantity =
                    Number(customQuantity) || 0;


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
    // ORDER DETAILS
    // ==========================================

    function buildOrderDetails() {

        const lines =
            [];


        Object.keys(
            quantities
        ).forEach(function (flavor) {

            normalizeFlavor(
                flavor
            );


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
            customFlavor &&
            customFlavor.value.trim()
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


            const total =
                calculateTotal();


            const orderDetails =
                buildOrderDetails();


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
                    ] || 0
                );


                formData.append(
                    "Rooted",
                    quantities[
                        "Rooted"
                    ] || 0
                );


                formData.append(
                    "Restore",
                    quantities[
                        "Restore"
                    ] || 0
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

                                    quantities: {

                                        "Green Pastures":
                                            quantities[
                                                "Green Pastures"
                                            ] || 0,

                                        "Rooted":
                                            quantities[
                                                "Rooted"
                                            ] || 0,

                                        "Restore":
                                            quantities[
                                                "Restore"
                                            ] || 0

                                    },

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


    updateSummary();

});
