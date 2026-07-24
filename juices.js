/* ==================================================
   A TASTE OF JADE
   JUICE ORDER PAGE
   ================================================== */


/* ==================================================
   CURRENT ORDER
   ================================================== */

const order = {
    yellow: 0,
    red: 0
};


/* ==================================================
   PAGE ELEMENTS
   ================================================== */

const yellowCount =
    document.getElementById("yellow-count");

const redCount =
    document.getElementById("red-count");

const summaryYellow =
    document.getElementById("summary-yellow");

const summaryRed =
    document.getElementById("summary-red");

const summaryCount =
    document.getElementById("summary-count");

const summarySize =
    document.getElementById("summary-size");

const summaryFulfillment =
    document.getElementById("summary-fulfillment");

const summaryTotal =
    document.getElementById("summary-total");

const flavorHelp =
    document.getElementById("flavor-help");

const orderError =
    document.getElementById("order-error");

const addressField =
    document.getElementById("address-field");

const deliveryAddress =
    document.getElementById("delivery-address");


/* ==================================================
   GET SELECTED BOTTLE SIZE
   ================================================== */

function getSelectedSize() {

    return document.querySelector(
        'input[name="size"]:checked'
    );

}


/* ==================================================
   GET PICKUP OR DELIVERY
   ================================================== */

function getFulfillment() {

    return document.querySelector(
        'input[name="fulfillment"]:checked'
    );

}


/* ==================================================
   GET PRICE PER BOTTLE
   ================================================== */

function getBottlePrice() {

    const size = getSelectedSize();

    if (!size) {
        return 0;
    }

    return Number(size.dataset.price);

}


/* ==================================================
   COUNT TOTAL BOTTLES
   ================================================== */

function getBottleCount() {

    return order.yellow + order.red;

}


/* ==================================================
   DELIVERY FEE
   ================================================== */

function getDeliveryFee() {

    const fulfillment =
        getFulfillment();

    if (
        fulfillment &&
        fulfillment.value === "delivery"
    ) {

        return 8;

    }

    return 0;

}


/* ==================================================
   CALCULATE TOTAL
   ================================================== */

function calculateTotal() {

    const bottlePrice =
        getBottlePrice();

    const bottleCount =
        getBottleCount();

    const deliveryFee =
        getDeliveryFee();

    return (
        bottlePrice * bottleCount
    ) + deliveryFee;

}


/* ==================================================
   PLUS BUTTONS
   ================================================== */

document
    .querySelectorAll(".plus")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const size =
                    getSelectedSize();

                if (!size) {

                    showError(
                        "Please choose a bottle size first."
                    );

                    return;
                }

                const flavor =
                    button.dataset.flavor;

                if (flavor === "yellow") {
                    order.yellow++;
                }

                if (flavor === "red") {
                    order.red++;
                }

                clearError();

                updateOrder();

            }
        );

    });


/* ==================================================
   MINUS BUTTONS
   ================================================== */

document
    .querySelectorAll(".minus")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const flavor =
                    button.dataset.flavor;

                if (
                    flavor === "yellow" &&
                    order.yellow > 0
                ) {

                    order.yellow--;

                }

                if (
                    flavor === "red" &&
                    order.red > 0
                ) {

                    order.red--;

                }

                clearError();

                updateOrder();

            }
        );

    });


/* ==================================================
   BOTTLE SIZE CHANGES
   ================================================== */

document
    .querySelectorAll(
        'input[name="size"]'
    )
    .forEach(function(input) {

        input.addEventListener(
            "change",
            function() {

                flavorHelp.textContent =
                    "Add as many bottles as you'd like.";

                clearError();

                updateOrder();

            }
        );

    });


/* ==================================================
   PICKUP / DELIVERY CHANGES
   ================================================== */

document
    .querySelectorAll(
        'input[name="fulfillment"]'
    )
    .forEach(function(input) {

        input.addEventListener(
            "change",
            function() {

                const fulfillment =
                    getFulfillment();

                if (
                    fulfillment &&
                    fulfillment.value === "delivery"
                ) {

                    addressField.hidden = false;

                    deliveryAddress.required = true;

                } else {

                    addressField.hidden = true;

                    deliveryAddress.required = false;

                }

                updateOrder();

            }
        );

    });


/* ==================================================
   UPDATE ORDER SUMMARY
   ================================================== */

function updateOrder() {

    const size =
        getSelectedSize();

    const fulfillment =
        getFulfillment();


    /* YELLOW WATERMELON */

    yellowCount.textContent =
        order.yellow;

    summaryYellow.textContent =
        order.yellow;


    /* RED WATERMELON */

    redCount.textContent =
        order.red;

    summaryRed.textContent =
        order.red;


    /* TOTAL NUMBER OF BOTTLES */

    summaryCount.textContent =
        getBottleCount();


    /* BOTTLE SIZE */

    if (size) {

        summarySize.textContent =
            size.value +
            " oz · $" +
            size.dataset.price +
            " each";

    } else {

        summarySize.textContent =
            "None selected";

    }


    /* PICKUP OR DELIVERY */

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


    /* TOTAL PRICE */

    summaryTotal.textContent =
        "$" +
        calculateTotal().toFixed(2);

}


/* ==================================================
   ERROR MESSAGE
   ================================================== */

function showError(message) {

    orderError.textContent =
        message;

}


function clearError() {

    orderError.textContent = "";

}


/* ==================================================
   SUBMIT ORDER TO FORMSPREE
   ================================================== */

document
    .getElementById("juice-order")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            clearError();


            /* -------------------------------
               CUSTOMER INFORMATION
            -------------------------------- */

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const instagram =
                document
                    .getElementById("instagram")
                    .value
                    .trim();


            /* -------------------------------
               ORDER INFORMATION
            -------------------------------- */

            const size =
                getSelectedSize();


            const fulfillment =
                getFulfillment();


            const date =
                document
                    .getElementById("order-date")
                    .value;


            const customRequest =
                document
                    .getElementById("custom-request")
                    .value
                    .trim();


            /* ==================================================
               VALIDATION
               ================================================== */


            /* NAME */

            if (!name) {

                showError(
                    "Please enter your full name."
                );

                return;

            }


            /* PHONE */

            if (!phone) {

                showError(
                    "Please enter your phone number."
                );

                return;

            }


            /* BOTTLE SIZE */

            if (!size) {

                showError(
                    "Please choose a bottle size."
                );

                return;

            }


            /* JUICE SELECTION */

            if (
                getBottleCount() === 0 &&
                !customRequest
            ) {

                showError(
                    "Please add at least one juice or enter a custom flavor request."
                );

                return;

            }


            /* ORDER DATE */

            if (!date) {

                showError(
                    "Please choose your preferred order date."
                );

                return;

            }


            /* DELIVERY ADDRESS */

            if (
                fulfillment &&
                fulfillment.value === "delivery" &&
                !deliveryAddress.value.trim()
            ) {

                showError(
                    "Please enter your delivery address."
                );

                return;

            }


            /* ==================================================
               BUILD ORDER INFORMATION
               ================================================== */

            const orderData = {

                _subject:
                    "🍉 NEW A TASTE OF JADE JUICE ORDER",

                customer_name:
                    name,

                phone:
                    phone,

                instagram:
                    instagram || "Not provided",

                bottle_size:
                    size.value + " oz",

                price_per_bottle:
                    "$" + size.dataset.price,

                yellow_watermelon:
                    order.yellow,

                red_watermelon:
                    order.red,

                total_bottles:
                    getBottleCount(),

                custom_flavor_request:
                    customRequest || "None",

                fulfillment:
                    fulfillment
                        ? fulfillment.value
                        : "pickup",

                preferred_order_date:
                    date,

                delivery_address:
                    deliveryAddress.value.trim()
                        || "N/A",

                delivery_fee:
                    getDeliveryFee() > 0
                        ? "$8.00"
                        : "$0.00",

                total_due:
                    "$" +
                    calculateTotal().toFixed(2)

            };


            /* ==================================================
               SEND ORDER TO FORMSPREE
               ================================================== */

            try {

                const submitButton =
                    document.querySelector(
                        ".complete-order"
                    );


                /* CHANGE BUTTON WHILE SENDING */

                submitButton.disabled = true;

                submitButton.innerHTML =
                    "Sending Order...";


                const response =
                    await fetch(
                        "https://formspree.io/f/mvzewrnk",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    orderData
                                )

                        }
                    );


                /* ==================================================
                   CHECK RESPONSE
                   ================================================== */

                if (!response.ok) {

                    throw new Error(
                        "Order could not be submitted."
                    );

                }


                /* ==================================================
                   SUCCESS
                   ================================================== */

                submitButton.innerHTML =
                    "Order Received ✓";


                alert(

                    "Your order has been received! 💚\n\n" +

                    "Yellow Watermelon: " +
                    order.yellow +
                    "\n" +

                    "Red Watermelon: " +
                    order.red +
                    "\n" +

                    "Total Bottles: " +
                    getBottleCount() +
                    "\n\n" +

                    "Total: $" +
                    calculateTotal().toFixed(2) +
                    "\n\n" +

                    "Next step: secure payment."

                );


                /*
                ==================================================
                NEXT STEP

                SQUARE PAYMENT WILL GO HERE.

                Once we connect Square, the customer will
                automatically continue to secure payment
                AFTER Formspree successfully saves the order.
                ==================================================
                */


            } catch (error) {


                console.error(error);


                showError(

                    "Something went wrong submitting your order. Please try again."

                );


                const submitButton =
                    document.querySelector(
                        ".complete-order"
                    );


                submitButton.disabled = false;


                submitButton.innerHTML =
                    "Review Order <span>→</span>";

            }

        }
    );


/* ==================================================
   INITIAL PAGE LOAD
   ================================================== */

updateOrder();
