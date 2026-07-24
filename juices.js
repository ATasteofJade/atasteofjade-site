/* =========================================
   A TASTE OF JADE
   JUICE ORDER PAGE
========================================= */


/* =========================================
   CURRENT ORDER
========================================= */

const order = {
    yellow: 0,
    red: 0
};


/* =========================================
   ELEMENTS
========================================= */

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


/* =========================================
   GET SELECTED SIZE
========================================= */

function getSelectedSize() {

    return document.querySelector(
        'input[name="size"]:checked'
    );

}


/* =========================================
   GET SELECTED FULFILLMENT
========================================= */

function getFulfillment() {

    return document.querySelector(
        'input[name="fulfillment"]:checked'
    );

}


/* =========================================
   PRICE PER BOTTLE
========================================= */

function getBottlePrice() {

    const size =
        getSelectedSize();


    if (!size) {
        return 0;
    }


    return Number(
        size.dataset.price
    );

}


/* =========================================
   TOTAL BOTTLES
========================================= */

function getBottleCount() {

    return order.yellow + order.red;

}


/* =========================================
   DELIVERY FEE
========================================= */

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


/* =========================================
   TOTAL PRICE
========================================= */

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


/* =========================================
   QUANTITY BUTTONS
========================================= */

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



/* =========================================
   SIZE CHANGES
========================================= */

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



/* =========================================
   PICKUP / DELIVERY
========================================= */

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



/* =========================================
   UPDATE PAGE
========================================= */

function updateOrder() {

    const size =
        getSelectedSize();


    const fulfillment =
        getFulfillment();


    yellowCount.textContent =
        order.yellow;


    redCount.textContent =
        order.red;


    summaryYellow.textContent =
        order.yellow;


    summaryRed.textContent =
        order.red;


    summaryCount.textContent =
        getBottleCount();


    /* SIZE */

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


    /* FULFILLMENT */

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


    /* TOTAL */

    summaryTotal.textContent =
        "$" +
        calculateTotal().toFixed(2);

}


/* =========================================
   ERRORS
========================================= */

function showError(message) {

    orderError.textContent =
        message;

}


function clearError() {

    orderError.textContent = "";

}


/* =========================================
   FORM SUBMISSION
========================================= */

document
    .getElementById("juice-order")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            clearError();


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


            /* SIZE */

            if (!size) {

                showError(
                    "Please choose a bottle size."
                );

                return;

            }


            /* JUICES */

            if (
                getBottleCount() === 0 &&
                !customRequest
            ) {

                showError(
                    "Please add at least one juice or enter a custom flavor request."
                );

                return;

            }


            /* DATE */

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


            /* =================================
               TEMPORARY REVIEW MESSAGE

               NEXT:
               SAVE ORDER + EMAIL + SQUARE
            ================================= */


            let message =
                "ORDER REVIEW\n\n";


            message +=
                "Customer: " +
                name +
                "\n";


            message +=
                "Phone: " +
                phone +
                "\n\n";


            message +=
                "Bottle Size: " +
                size.value +
                " oz\n";


            message +=
                "Yellow Watermelon: " +
                order.yellow +
                "\n";


            message +=
                "Red Watermelon: " +
                order.red +
                "\n";


            message +=
                "Total Bottles: " +
                getBottleCount() +
                "\n";


            if (customRequest) {

                message +=
                    "\nCustom Request:\n" +
                    customRequest +
                    "\n";

            }


            message +=
                "\nTotal: $" +
                calculateTotal()
                    .toFixed(2);


            message +=
                "\n\nNext step: secure payment through Square.";


            alert(message);

        }
    );


/* =========================================
   INITIAL PAGE LOAD
========================================= */

updateOrder();
