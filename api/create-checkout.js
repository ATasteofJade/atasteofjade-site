export default {
    async fetch(request) {

        const corsHeaders = {
            "Access-Control-Allow-Origin": "https://atasteofjade.github.io",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        if (request.method !== "POST") {
            return Response.json(
                { error: "Method not allowed." },
                {
                    status: 405,
                    headers: corsHeaders
                }
            );
        }

        try {

            const body = await request.json();

            const bottleSize = String(body.bottleSize || "");

            const yellowQuantity =
                Number(body.yellowQuantity || 0);

            const redQuantity =
                Number(body.redQuantity || 0);

            const customQuantity =
                Number(body.customQuantity || 0);

            const customFlavor =
                String(body.customFlavor || "").trim();

            const fulfillment =
                String(body.fulfillment || "pickup");

            const customerName =
                String(body.customerName || "").trim();


            // ----------------------------------
            // VALIDATE BOTTLE SIZE
            // ----------------------------------

            if (
                bottleSize !== "12" &&
                bottleSize !== "16"
            ) {
                return Response.json(
                    { error: "Invalid bottle size." },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );
            }


            // ----------------------------------
            // VALIDATE QUANTITIES
            // ----------------------------------

            const quantities = [
                yellowQuantity,
                redQuantity,
                customQuantity
            ];

            const quantitiesValid =
                quantities.every(function (quantity) {
                    return (
                        Number.isInteger(quantity) &&
                        quantity >= 0 &&
                        quantity <= 50
                    );
                });

            if (!quantitiesValid) {
                return Response.json(
                    { error: "Invalid juice quantity." },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );
            }


            const totalBottles =
                yellowQuantity +
                redQuantity +
                customQuantity;


            if (totalBottles < 1) {
                return Response.json(
                    { error: "Your order is empty." },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );
            }


            if (
                customQuantity > 0 &&
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


            if (
                fulfillment !== "pickup" &&
                fulfillment !== "delivery"
            ) {
                return Response.json(
                    { error: "Invalid fulfillment option." },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );
            }


            // ----------------------------------
            // SECURE PRICE CALCULATION
            // ----------------------------------

            const bottlePriceInCents =
                bottleSize === "12"
                    ? 800
                    : 1100;

            const deliveryFeeInCents =
                fulfillment === "delivery"
                    ? 800
                    : 0;

            const totalInCents =
                (
                    totalBottles *
                    bottlePriceInCents
                ) +
                deliveryFeeInCents;


            // ----------------------------------
            // SQUARE CREDENTIALS
            // ----------------------------------

            const accessToken =
                process.env.SQUARE_ACCESS_TOKEN;

            const locationId =
                process.env.SQUARE_LOCATION_ID;


            if (!accessToken || !locationId) {

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


            // ----------------------------------
            // CREATE DESCRIPTION
            // ----------------------------------

            let description =
                `A Taste of Jade - ${totalBottles} Juice`;

            if (totalBottles !== 1) {
                description += "s";
            }

            description += ` - ${bottleSize} oz`;


            // ----------------------------------
            // CREATE SQUARE PAYMENT LINK
            // ----------------------------------

            const squareResponse =
                await fetch(
                    "https://connect.squareup.com/v2/online-checkout/payment-links",
                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                `Bearer ${accessToken}`,

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

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
                await squareResponse.json();


            if (!squareResponse.ok) {

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
                squareData?.payment_link?.url;


            if (!paymentUrl) {

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


            // ----------------------------------
            // SUCCESS
            // ----------------------------------

            return Response.json(
                {
                    success: true,

                    paymentUrl:
                        paymentUrl,

                    customerName:
                        customerName,

                    totalBottles:
                        totalBottles,

                    total:
                        (
                            totalInCents / 100
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
