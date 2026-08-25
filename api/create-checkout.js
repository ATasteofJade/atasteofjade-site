export default {

    async fetch(request) {


        const corsHeaders = {

            "Access-Control-Allow-Origin":
                "https://atasteofjade.github.io",

            "Access-Control-Allow-Methods":
                "POST, OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type"

        };


        // ==========================================
        // CORS
        // ==========================================

        if (
            request.method ===
            "OPTIONS"
        ) {

            return new Response(
                null,
                {
                    status: 204,
                    headers: corsHeaders
                }
            );

        }


        if (
            request.method !==
            "POST"
        ) {

            return Response.json(
                {
                    error:
                        "Method not allowed."
                },
                {
                    status: 405,
                    headers: corsHeaders
                }
            );

        }


        try {


            const body =
                await request.json();


            // ==========================================
            // SECURE PACKAGE PRICING
            // ==========================================

            const packages = {

                "4": {

                    label:
                        "4-Pack",

                    count:
                        4,

                    price:
                        4400

                },


                "8": {

                    label:
                        "8-Pack",

                    count:
                        8,

                    price:
                        8800

                },


                "64": {

                    label:
                        "64 oz Half Gallon",

                    count:
                        1,

                    price:
                        3500

                }

            };


            const packageId =
                String(
                    body.packageId ||
                    ""
                );


            const selectedPackage =
                packages[
                    packageId
                ];


            if (
                !selectedPackage
            ) {

                return Response.json(
                    {
                        error:
                            "Invalid juice package."
                    },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );

            }


            // ==========================================
            // FLAVOR QUANTITIES
            // ==========================================

            const quantities =
                body.quantities ||
                {};


            const greenQuantity =
                Number(
                    quantities[
                        "Green Pastures"
                    ] ||
                    0
                );


            const rootedQuantity =
                Number(
                    quantities[
                        "Rooted"
                    ] ||
                    0
                );


            const restoreQuantity =
                Number(
                    quantities[
                        "Restore"
                    ] ||
                    0
                );


            const customQuantity =
                Number(
                    body.customQuantity ||
                    0
                );


            const customFlavor =
                String(
                    body.customFlavor ||
                    ""
                ).trim();


            const fulfillment =
                String(
                    body.fulfillment ||
                    "pickup"
                );


            const customerName =
                String(
                    body.customerName ||
                    ""
                ).trim();


            // ==========================================
            // VALIDATE QUANTITIES
            // ==========================================

            const quantityValues = [

                greenQuantity,

                rootedQuantity,

                restoreQuantity,

                customQuantity

            ];


            const quantitiesValid =
                quantityValues.every(
                    function (quantity) {

                        return (

                            Number.isInteger(
                                quantity
                            ) &&

                            quantity >= 0 &&

                            quantity <= 50

                        );

                    }
                );


            if (
                !quantitiesValid
            ) {

                return Response.json(
                    {
                        error:
                            "Invalid juice quantity."
                    },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );

            }


            const totalSelected =
                greenQuantity +
                rootedQuantity +
                restoreQuantity +
                customQuantity;


            if (
                totalSelected !==
                selectedPackage.count
            ) {

                return Response.json(
                    {
                        error:
                            "Please select exactly " +
                            selectedPackage.count +
                            " item(s)."
                    },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );

            }


            if (
                customQuantity >
                0 &&
                !customFlavor
            ) {

                return Response.json(
                    {
                        error:
                            "Custom flavor description is required."
                    },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );

            }


            // ==========================================
            // VALIDATE FULFILLMENT
            // ==========================================

            if (
                fulfillment !==
                "pickup" &&
                fulfillment !==
                "delivery"
            ) {

                return Response.json(
                    {
                        error:
                            "Invalid fulfillment option."
                    },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );

            }


            // ==========================================
            // SECURE TOTAL
            // ==========================================

            const deliveryFeeInCents =
                fulfillment ===
                "delivery"
                    ? 800
                    : 0;


            const totalInCents =
                selectedPackage.price +
                deliveryFeeInCents;


            // ==========================================
            // SQUARE CREDENTIALS
            // ==========================================

            const accessToken =
                process.env
                    .SQUARE_ACCESS_TOKEN;


            const locationId =
                process.env
                    .SQUARE_LOCATION_ID;


            if (
                !accessToken ||
                !locationId
            ) {

                console.error(
                    "Missing Square credentials."
                );


                return Response.json(
                    {
                        error:
                            "Square payment configuration is incomplete."
                    },
                    {
                        status: 500,
                        headers: corsHeaders
                    }
                );

            }


            // ==========================================
            // DESCRIPTION
            // ==========================================

            const flavorParts = [];


            if (
                greenQuantity >
                0
            ) {

                flavorParts.push(
                    "Green Pastures x" +
                    greenQuantity
                );

            }


            if (
                rootedQuantity >
                0
            ) {

                flavorParts.push(
                    "Rooted x" +
                    rootedQuantity
                );

            }


            if (
                restoreQuantity >
                0
            ) {

                flavorParts.push(
                    "Restore x" +
                    restoreQuantity
                );

            }


            if (
                customQuantity >
                0
            ) {

                flavorParts.push(
                    customFlavor +
                    " x" +
                    customQuantity
                );

            }


            let description =
                "A Taste of Jade - " +
                selectedPackage.label;


            if (
                flavorParts.length >
                0
            ) {

                description +=
                    " - " +
                    flavorParts.join(
                        ", "
                    );

            }


            // ==========================================
            // CREATE SQUARE PAYMENT LINK
            // ==========================================

            const squareResponse =
                await fetch(

                    "https://connect.squareup.com/v2/online-checkout/payment-links",

                    {

                        method:
                            "POST",


                        headers: {

                            "Authorization":
                                `Bearer ${accessToken}`,

                            "Content-Type":
                                "application/json"

                        },


                        body:
                            JSON.stringify({

                                idempotency_key:
                                    crypto.randomUUID(),


                                quick_pay: {

                                    name:
                                        description,


                                    price_money: {

                                        amount:
                                            totalInCents,

                                        currency:
                                            "USD"

                                    },


                                    location_id:
                                        locationId

                                },


                                checkout_options: {

                                    redirect_url:
                                        "https://atasteofjade.github.io/atasteofjade-site/juices.html?payment=complete"

                                }

                            })

                    }

                );


            const squareData =
                await squareResponse
                    .json();


            if (
                !squareResponse.ok
            ) {

                console.error(
                    "Square API error:",
                    squareData
                );


                return Response.json(
                    {
                        error:
                            "Square could not create the payment page."
                    },
                    {
                        status: 500,
                        headers: corsHeaders
                    }
                );

            }


            const paymentUrl =
                squareData
                    ?.payment_link
                    ?.url;


            if (
                !paymentUrl
            ) {

                return Response.json(
                    {
                        error:
                            "Square did not return a payment URL."
                    },
                    {
                        status: 500,
                        headers: corsHeaders
                    }
                );

            }


            // ==========================================
            // SUCCESS
            // ==========================================

            return Response.json(
                {

                    success:
                        true,


                    paymentUrl:
                        paymentUrl,


                    customerName:
                        customerName,


                    package:
                        selectedPackage.label,


                    total:
                        (
                            totalInCents /
                            100
                        ).toFixed(2)

                },
                {
                    status: 200,
                    headers: corsHeaders
                }
            );


        } catch (error) {


            console.error(
                "Checkout error:",
                error
            );


            return Response.json(
                {
                    error:
                        "Checkout could not be created."
                },
                {
                    status: 500,
                    headers: corsHeaders
                }
            );

        }

    }

};
