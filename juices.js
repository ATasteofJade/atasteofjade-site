<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Order Juices | A Taste of Jade</title>

    <style>

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #163822;
            color: #23482d;
        }

        .order-page {
            width: 92%;
            max-width: 880px;
            margin: 0 auto;
            padding: 28px 0 70px;
        }

        .page-intro,
        .order-card {
            background: #fffaf0;
            border: 2px solid #d4af37;
            border-radius: 26px;
        }

        .page-intro {
            text-align: center;
            padding: 28px 20px;
            margin-bottom: 25px;
        }

        .juice-logo {
            display: block;
            width: 105px;
            height: auto;
            margin: 12px auto;
        }

        .back-link {
            display: inline-block;
            color: #285a38;
            font-weight: bold;
            text-decoration: none;
            margin-bottom: 5px;
        }

        .eyebrow {
            color: #aa8425;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 1.8px;
        }

        .page-intro h1 {
            margin: 8px 0;
            font-family: Georgia, serif;
            font-size: 42px;
        }

        .intro-copy {
            color: #687461;
            line-height: 1.6;
        }

        .notice {
            background: #285a38;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 20px;
            margin-bottom: 25px;
            line-height: 1.6;
        }

        .notice strong {
            color: #f0ca5b;
        }

        .order-card {
            padding: 32px;
            margin-bottom: 25px;
        }

        .order-card h2 {
            display: flex;
            align-items: center;
            gap: 13px;
            margin: 0 0 24px;
            font-family: Georgia, serif;
            font-size: 32px;
        }

        .section-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 54px;
            height: 54px;
            background: #285a38;
            border-radius: 14px;
            font-family: Arial, sans-serif;
            font-size: 24px;
        }

        .field-grid,
        .fulfillment-fields {
            display: grid;
            gap: 19px;
        }

        label {
            display: block;
            font-size: 16px;
            font-weight: bold;
        }

        label small,
        .custom-note {
            display: block;
            margin-top: 7px;
            color: #697561;
            font-size: 13px;
            font-weight: normal;
            line-height: 1.5;
        }

        input[type="text"],
        input[type="tel"],
        input[type="email"],
        input[type="date"],
        textarea {
            width: 100%;
            margin-top: 8px;
            padding: 16px;
            border: 2px solid #d9cfb9;
            border-radius: 15px;
            background: white;
            font: inherit;
        }

        textarea {
            min-height: 135px;
            resize: vertical;
        }

        input:focus,
        textarea:focus {
            outline: none;
            border-color: #285a38;
        }

        .choice-grid {
            display: grid;
            gap: 16px;
        }

        .two-columns {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .choice-card {
            cursor: pointer;
        }

        .choice-card input {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }

        .choice-card span {
            min-height: 140px;
            padding: 22px 14px;
            border: 3px solid #ddd3bd;
            border-radius: 20px;
            background: white;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            text-align: center;
            transition: 0.2s ease;
        }

        .choice-card strong {
            font-family: Georgia, serif;
            font-size: 29px;
        }

        .choice-card em {
            margin-top: 9px;
            color: #718069;
            font-style: normal;
            font-weight: normal;
        }

        .choice-card input:checked + span {
            border-color: #285a38;
            background: #edf5e7;
            box-shadow: 0 0 0 2px #285a38;
        }

        .help-text {
            padding: 12px 14px;
            border-radius: 12px;
            background: #eef4e9;
            color: #66715f;
        }

        .flavor {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;

            padding: 24px 0;
            border-bottom: 1px solid #d9cfb9;
        }

        .flavor:last-child {
            border-bottom: none;
        }

        .flavor h3 {
            margin: 0 0 7px;
            font-size: 22px;
        }

        .flavor p,
        .flavor small {
            display: block;
            margin: 5px 0;
            color: #697561;
            line-height: 1.5;
        }

        .flavor q,
        .flavor cite {
            display: block;
            margin-top: 6px;
            color: #4c6148;
        }

        .sold-out {
            opacity: 0.47;
        }

        .sold-badge {
            display: inline-block;
            padding: 5px 10px;
            margin-left: 6px;
            border-radius: 100px;
            background: #842e2e;
            color: white;
            font-size: 11px;
            letter-spacing: 0.5px;
        }

        .stepper {
            display: flex;
            align-items: center;
            gap: 11px;
            flex-shrink: 0;
        }

        .stepper button {
            width: 43px;
            height: 43px;
            border: 2px solid #285a38;
            border-radius: 50%;
            background: white;
            color: #285a38;
            font-size: 24px;
            cursor: pointer;
        }

        .stepper button:hover {
            background: #285a38;
            color: white;
        }

        .stepper output {
            min-width: 24px;
            text-align: center;
            font-size: 21px;
            font-weight: bold;
        }

        .custom-request {
            margin-top: 28px;
            padding: 22px;
            border: 2px solid #6b9858;
            border-radius: 20px;
            background: #f0f7e9;
        }

        .custom-request h3 {
            margin-top: 0;
            font-size: 22px;
        }

        .custom-quantity-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            margin-top: 18px;
        }

        .summary {
            margin-bottom: 25px;
            padding: 27px;
            border-radius: 24px;
            background: #285a38;
            color: white;
        }

        .summary h2 {
            margin-top: 0;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 11px 0;
            border-bottom: 1px solid rgba(255,255,255,0.25);
        }

        .summary-total {
            padding-top: 16px;
            color: #f0ca5b;
            font-size: 26px;
            font-weight: bold;
        }

        .confirmation-note {
            padding: 14px;
            border-radius: 13px;
            background: #eef4e9;
            color: #5f7059;
            line-height: 1.5;
        }

        .payment-placeholder {
            padding: 22px;
            border: 2px dashed #c4a14a;
            border-radius: 17px;
            background: #fff7e5;
            text-align: center;
            color: #6f6037;
        }

        .order-error {
            min-height: 24px;
            color: #ffe2e2;
            font-weight: bold;
            text-align: center;
        }

        .complete-order {
            width: 100%;
            padding: 18px;
            border: none;
            border-radius: 50px;
            background: #d4af37;
            color: #173d27;
            font-size: 19px;
            font-weight: bold;
            cursor: pointer;
        }

        .complete-order:disabled {
            opacity: 0.65;
        }

        .payment-note {
            color: white;
            text-align: center;
            font-size: 14px;
        }

        @media (max-width: 650px) {

            .two-columns {
                grid-template-columns: 1fr;
            }

            .order-card {
                padding: 23px 18px;
            }

            .order-card h2 {
                font-size: 26px;
            }

            .page-intro h1 {
                font-size: 33px;
            }

            .flavor {
                align-items: flex-start;
            }

            .custom-quantity-row {
                align-items: flex-start;
                flex-direction: column;
            }
        }

    </style>
</head>


<body>

<main class="order-page">

    <!-- HEADER -->

    <header class="page-intro">

        <a class="back-link" href="index.html">
            ← Back to A Taste of Jade
        </a>

        <img
            src="images/logo.png"
            alt="A Taste of Jade"
            class="juice-logo"
        >

        <p class="eyebrow">
            COLD-PRESSED JUICES · MADE WITH LOVE
        </p>

        <h1>Order Fresh Juices</h1>

        <p class="intro-copy">
            Choose your bottle size and add as many juices as you need.
        </p>

    </header>


    <!-- ORDER NOTICE -->

    <div class="notice">

        <strong>
            Orders close every Sunday at 8 PM.
        </strong>

        <br>

        Available while supplies last.

    </div>


    <form id="juice-order" novalidate>


        <!-- CUSTOMER INFORMATION -->

        <section class="order-card">

            <h2>
                <span class="section-icon">👤</span>
                Your Info
            </h2>

            <div class="field-grid">

                <label>

                    Full Name *

                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="First and last name"
                        required
                    >

                </label>


                <label>

                    Phone Number *

                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(713) 555-0000"
                        required
                    >

                </label>


                <label>

                    Email

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                    >

                </label>


                <label>

                    Instagram Handle

                    <input
                        id="instagram"
                        name="instagram"
                        type="text"
                        placeholder="@yourhandle"
                    >

                    <small>
                        Optional
                    </small>

                </label>

            </div>

        </section>


        <!-- BOTTLE SIZE -->

        <section class="order-card">

            <h2>
                <span class="section-icon">🧃</span>
                Choose Your Bottle Size
            </h2>


            <div class="choice-grid two-columns">


                <label class="choice-card">

                    <input
                        type="radio"
                        name="size"
                        value="12"
                        data-price="8"
                    >

                    <span>

                        <strong>12 oz</strong>

                        <em>
                            $8 each
                        </em>

                    </span>

                </label>


                <label class="choice-card">

                    <input
                        type="radio"
                        name="size"
                        value="16"
                        data-price="11"
                    >

                    <span>

                        <strong>16 oz</strong>

                        <em>
                            $11 each
                        </em>

                    </span>

                </label>


            </div>

        </section>


        <!-- JUICE FLAVORS -->

        <section class="order-card">

            <h2>
                <span class="section-icon">🌱</span>
                Select Your Juices
            </h2>


            <p
                class="help-text"
                id="flavor-help"
            >
                Choose a bottle size before adding juices.
            </p>


            <div class="flavors">


                <!-- EDEN GLOW -->

                <article class="flavor sold-out">

                    <div>

                        <h3>

                            🍍 Eden Glow

                            <span class="sold-badge">
                                SOLD OUT
                            </span>

                        </h3>

                        <p>
                            Radiant · Cleansing · Rebirth
                        </p>

                        <q>
                            Behold, I make all things new.
                        </q>

                        <cite>
                            Revelation 21:5
                        </cite>

                        <small>
                            Pineapple · Apple · Lemon · Ginger
                        </small>

                    </div>

                </article>


                <!-- GREEN PASTURES -->

                <article class="flavor sold-out">

                    <div>

                        <h3>

                            🌿 Green Pastures

                            <span class="sold-badge">
                                SOLD OUT
                            </span>

                        </h3>

                        <p>
                            Peace · Rest · Provision
                        </p>

                        <q>
                            He makes me lie down in green pastures.
                        </q>

                        <cite>
                            Psalm 23:2
                        </cite>

                        <small>
                            Cucumber · Celery · Apple · Lemon · Spinach
                        </small>

                    </div>

                </article>


                <!-- RESTORE -->

                <article class="flavor sold-out">

                    <div>

                        <h3>

                            🍉 Restore

                            <span class="sold-badge">
                                SOLD OUT
                            </span>

                        </h3>

                        <p>
                            Healing · Refreshing · Calm
                        </p>

                        <q>
                            He restores my soul.
                        </q>

                        <cite>
                            Psalm 23:3
                        </cite>

                        <small>
                            Watermelon · Cucumber · Mint · Lime
                        </small>

                    </div>

                </article>


                <!-- YELLOW WATERMELON -->

                <article class="flavor">

                    <div>

                        <h3>
                            💛 Yellow Watermelon
                        </h3>

                        <p>
                            Sweet · Crisp · Refreshing
                        </p>

                        <small>
                            Fresh Yellow Watermelon
                        </small>

                    </div>


                    <div class="stepper">

                        <button
                            type="button"
                            class="minus"
                            data-flavor="yellow"
                        >
                            −
                        </button>

                        <output id="yellow-count">
                            0
                        </output>

                        <button
                            type="button"
                            class="plus"
                            data-flavor="yellow"
                        >
                            +
                        </button>

                    </div>

                </article>


                <!-- RED WATERMELON -->

                <article class="flavor">

                    <div>

                        <h3>
                            ❤️ Red Watermelon
                        </h3>

                        <p>
                            Juicy · Hydrating · Refreshing
                        </p>

                        <small>
                            Fresh Red Watermelon
                        </small>

                    </div>


                    <div class="stepper">

                        <button
                            type="button"
                            class="minus"
                            data-flavor="red"
                        >
                            −
                        </button>

                        <output id="red-count">
                            0
                        </output>

                        <button
                            type="button"
                            class="plus"
                            data-flavor="red"
                        >
                            +
                        </button>

                    </div>

                </article>


            </div>


            <!-- CUSTOM FLAVOR -->

            <div class="custom-request">

                <h3>
                    ✨ Request a Custom Flavor
                </h3>

                <p>
                    Tell me the custom flavor or flavor combination you want.
                </p>


                <label>

                    Custom Flavor Request

                    <textarea
                        id="custom-request"
                        name="custom-request"
                        placeholder="Example: Pineapple Strawberry or Green Apple Cucumber"
                    ></textarea>

                </label>


                <div class="custom-quantity-row">

                    <strong>
                        Custom Flavor Quantity
                    </strong>


                    <div class="stepper">

                        <button
                            type="button"
                            id="custom-minus"
                        >
                            −
                        </button>

                        <output id="custom-count">
                            0
                        </output>

                        <button
                            type="button"
                            id="custom-plus"
                        >
                            +
                        </button>

                    </div>

                </div>


                <small class="custom-note">

                    Custom requests depend on ingredient availability
                    and must be confirmed by A Taste of Jade.

                </small>

            </div>

        </section>


        <!-- PICKUP / DELIVERY -->

        <section class="order-card">

            <h2>
                <span class="section-icon">📍</span>
                Pickup or Delivery
            </h2>


            <div class="choice-grid two-columns">


                <label class="choice-card">

                    <input
                        type="radio"
                        name="fulfillment"
                        value="pickup"
                        checked
                    >

                    <span>

                        <strong>
                            Pickup
                        </strong>

                        <em>
                            Free
                        </em>

                    </span>

                </label>


                <label class="choice-card">

                    <input
                        type="radio"
                        name="fulfillment"
                        value="delivery"
                    >

                    <span>

                        <strong>
                            Delivery
                        </strong>

                        <em>
                            $8 delivery fee
                        </em>

                    </span>

                </label>


            </div>


            <div class="fulfillment-fields">


                <label>

                    Preferred Order Date *

                    <input
                        id="order-date"
                        name="order-date"
                        type="date"
                        required
                    >

                    <small>

                        Your requested date is not confirmed until
                        you receive confirmation from A Taste of Jade.

                    </small>

                </label>


                <label
                    id="address-field"
                    hidden
                >

                    Delivery Address *

                    <input
                        id="delivery-address"
                        name="delivery-address"
                        type="text"
                        placeholder="Street address, city, state and ZIP"
                    >

                </label>


            </div>


            <p class="confirmation-note">

                Pickup or delivery details will be confirmed
                after your order is reviewed.

            </p>

        </section>


        <!-- ORDER SUMMARY -->

        <section class="summary">

            <h2>
                🛒 Your Order
            </h2>


            <div class="summary-row">

                <span>
                    Bottle Size
                </span>

                <strong id="summary-size">
                    None selected
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Yellow Watermelon
                </span>

                <strong id="summary-yellow">
                    0
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Red Watermelon
                </span>

                <strong id="summary-red">
                    0
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Custom Flavor
                </span>

                <strong id="summary-custom">
                    0
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Total Bottles
                </span>

                <strong id="summary-count">
                    0
                </strong>

            </div>


            <div class="summary-row">

                <span>
                    Fulfillment
                </span>

                <strong id="summary-fulfillment">
                    Pickup · Free
                </strong>

            </div>


            <div class="summary-row summary-total">

                <span>
                    Total Due
                </span>

                <strong id="summary-total">
                    $0.00
                </strong>

            </div>

        </section>


        <!-- PAYMENT -->

        <section class="order-card">

            <h2>
                <span class="section-icon">💳</span>
                Payment
            </h2>

            <div class="payment-placeholder">

                🔒 Secure payment through Square will be connected next.

            </div>

        </section>


        <p
            class="order-error"
            id="order-error"
            role="alert"
        ></p>


        <button
            class="complete-order"
            type="submit"
        >
            Submit Order
        </button>


        <p class="payment-note">

            Your full order details will be sent to A Taste of Jade.

        </p>


    </form>

</main>


<script>

    /* =========================================
       ORDER COUNTS
    ========================================= */

    const order = {
        yellow: 0,
        red: 0,
        custom: 0
    };


    /* =========================================
       ELEMENTS
    ========================================= */

    const yellowCount =
        document.getElementById("yellow-count");

    const redCount =
        document.getElementById("red-count");

    const customCount =
        document.getElementById("custom-count");


    const summaryYellow =
        document.getElementById("summary-yellow");

    const summaryRed =
        document.getElementById("summary-red");

    const summaryCustom =
        document.getElementById("summary-custom");

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
       SELECTED OPTIONS
    ========================================= */

    function getSelectedSize() {

        return document.querySelector(
            'input[name="size"]:checked'
        );

    }


    function getFulfillment() {

        return document.querySelector(
            'input[name="fulfillment"]:checked'
        );

    }


    /* =========================================
       PRICE
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


    function getBottleCount() {

        return (
            order.yellow +
            order.red +
            order.custom
        );

    }


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


    function calculateTotal() {

        return (
            getBottlePrice() *
            getBottleCount()
        ) + getDeliveryFee();

    }


    /* =========================================
       ERROR MESSAGES
    ========================================= */

    function showError(message) {

        orderError.textContent =
            message;

    }


    function clearError() {

        orderError.textContent = "";

    }


    /* =========================================
       CHECK SIZE BEFORE ADDING
    ========================================= */

    function canAddJuice() {

        if (!getSelectedSize()) {

            showError(
                "Please choose a bottle size first."
            );

            return false;

        }

        clearError();

        return true;

    }


    /* =========================================
       YELLOW + RED PLUS BUTTONS
    ========================================= */

    document
        .querySelectorAll(".plus")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    if (!canAddJuice()) {
                        return;
                    }

                    const flavor =
                        button.dataset.flavor;

                    order[flavor]++;

                    updateOrder();

                }
            );

        });


    /* =========================================
       YELLOW + RED MINUS BUTTONS
    ========================================= */

    document
        .querySelectorAll(".minus")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const flavor =
                        button.dataset.flavor;

                    if (
                        order[flavor] > 0
                    ) {

                        order[flavor]--;

                    }

                    updateOrder();

                }
            );

        });


    /* =========================================
       CUSTOM PLUS
    ========================================= */

    document
        .getElementById("custom-plus")
        .addEventListener(
            "click",
            function() {

                if (!canAddJuice()) {
                    return;
                }


                const customRequest =
                    document
                        .getElementById("custom-request")
                        .value
                        .trim();


                if (!customRequest) {

                    showError(
                        "Please describe your custom flavor first."
                    );

                    return;

                }


                order.custom++;

                clearError();

                updateOrder();

            }
        );


    /* =========================================
       CUSTOM MINUS
    ========================================= */

    document
        .getElementById("custom-minus")
        .addEventListener(
            "click",
            function() {

                if (
                    order.custom > 0
                ) {

                    order.custom--;

                }

                updateOrder();

            }
        );


    /* =========================================
       SIZE CHANGE
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
                        "Add as many bottles as you need.";

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

                    const isDelivery =
                        fulfillment &&
                        fulfillment.value === "delivery";


                    addressField.hidden =
                        !isDelivery;


                    deliveryAddress.required =
                        isDelivery;


                    updateOrder();

                }
            );

        });


    /* =========================================
       UPDATE SUMMARY
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


        customCount.textContent =
            order.custom;


        summaryYellow.textContent =
            order.yellow;


        summaryRed.textContent =
            order.red;


        summaryCustom.textContent =
            order.custom;


        summaryCount.textContent =
            getBottleCount();


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


        summaryTotal.textContent =
            "$" +
            calculateTotal().toFixed(2);

    }


    /* =========================================
       SUBMIT TO FORMSPREE
    ========================================= */

    document
        .getElementById("juice-order")
        .addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();

                clearError();


                const submitButton =
                    document.querySelector(
                        ".complete-order"
                    );


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


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const instagram =
                    document
                        .getElementById("instagram")
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


                /* VALIDATION */


                if (!name) {

                    showError(
                        "Please enter your full name."
                    );

                    return;

                }


                if (!phone) {

                    showError(
                        "Please enter your phone number."
                    );

                    return;

                }


                if (!size) {

                    showError(
                        "Please choose a bottle size."
                    );

                    return;

                }


                if (
                    getBottleCount() === 0
                ) {

                    showError(
                        "Please add at least one juice."
                    );

                    return;

                }


                if (
                    order.custom > 0 &&
                    !customRequest
                ) {

                    showError(
                        "Please describe your custom flavor."
                    );

                    return;

                }


                if (!date) {

                    showError(
                        "Please select your preferred order date."
                    );

                    return;

                }


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


                /* ORDER INFORMATION */


                const orderData = {

                    _subject:
                        "NEW A TASTE OF JADE JUICE ORDER",

                    customer_name:
                        name,

                    phone:
                        phone,

                    email:
                        email || "Not provided",

                    instagram:
                        instagram || "Not provided",

                    bottle_size:
                        size.value + " oz",

                    price_per_bottle:
                        "$" + size.dataset.price,

                    yellow_watermelon_quantity:
                        order.yellow,

                    red_watermelon_quantity:
                        order.red,

                    custom_flavor_request:
                        customRequest || "None",

                    custom_flavor_quantity:
                        order.custom,

                    total_bottles:
                        getBottleCount(),

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


                /* SEND ORDER */


                try {

                    submitButton.disabled =
                        true;


                    submitButton.textContent =
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


                    if (!response.ok) {

                        throw new Error(
                            "Order was not submitted."
                        );

                    }


                    submitButton.textContent =
                        "Order Received ✓";


                    alert(

                        "Your order has been received! 💚\n\n" +

                        "Yellow Watermelon: " +
                        order.yellow +
                        "\n" +

                        "Red Watermelon: " +
                        order.red +
                        "\n" +

                        "Custom Flavor: " +
                        order.custom +
                        "\n\n" +

                        "Total Bottles: " +
                        getBottleCount() +
                        "\n" +

                        "Total Due: $" +
                        calculateTotal().toFixed(2)

                    );


                } catch (error) {

                    console.error(error);


                    showError(

                        "Something went wrong submitting your order. Please try again."

                    );


                    submitButton.disabled =
                        false;


                    submitButton.textContent =
                        "Submit Order";

                }

            }
        );


    /* =========================================
       INITIAL LOAD
    ========================================= */

    updateOrder();

</script>


</body>

</html>
