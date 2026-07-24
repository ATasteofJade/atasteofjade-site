export default {
    async fetch(request) {

        // Allow requests only from your website
        const allowedOrigin =
            "https://atasteofjade.github.io";

        const corsHeaders = {
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        // Handle browser preflight request
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        if (request.method !== "POST") {
            return Response.json(
                {
                    error: "Method not allowed."
                },
                {
                    status: 405,
                    headers: corsHeaders
                }
            );
        }

        try {

            const {
                total,
                bottleSize,
                totalBottles,
                customerName,
                description
            } = await request.json();


            // -----------------------------
            // VALIDATE ORDER
            // -----------------------------

            const numericTotal =
                Number(total);

            const bottleCount =
                Number(totalBottles);


            if (
                !Number.isFinite(numericTotal) ||
                numericTotal <= 0
            ) {
                return Response.json(
                    {
                        error: "Invalid order total."
                    },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );
            }


            if (
                !Number.isInteger(bottleCount) ||
                bottleCount < 1
            ) {
                return Response.json(
                    {
                        error: "Invalid bottle quantity."
                    },
                    {
                        status: 400,
                        headers: corsHeaders
                    }
                );
            }


            // Convert dollars to cents
            const amountInCents =
                Math.round(numericTotal * 100);


            // -----------------------------
            // SQUARE CREDENTIALS
            // -----------------------------

            const accessToken =
                process.env.SQUARE_ACCESS_TOKEN;

            const locationId =
                process.env.SQUARE_LOCATION_ID;


            if (!accessToken || !locationId) {

                console.error(
                    "Missing Square environment variables."
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


            // -----------------------------
            // CREATE SQUARE PAYMENT LINK
            // -----------------------------

            const squareResponse =
                await fetch(
                    "https://connect.squareup.com/v2/online-checkout/payment-links",
                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                `Bearer ${accessToken}`,

                            "Content-Type":
                                "application/json",

                            "Square-Version":
                                "2026-01-22"
                        },

                        body: JSON.stringify({

                            idempotency_key:
                                crypto.randomUUID(),

                            quick_pay: {

                                name:
                                    description ||
                                    "A Taste of Jade Juice Order",

                                price_money: {
                                    amount:
                                        amountInCents,

                                    currency:
                                        "USD"
                                },

                                location_id:
                                    locationId

                            },

                            checkout_options: {

                                redirect_url:
                                    "https://atasteofjade.github.io/atasteofjade-site/juices.html"

                            },

                            pre_populated_data: {

                                buyer_email:
                                    undefined

                            }

                        })
                    }
                );


            const squareData =
                await squareResponse.json();


            if (!squareResponse.ok) {

                console.error(
                    "Square error:",
                    squareData
                );

                return Response.json(
                    {
                        error:
                            "Square could not create the payment page.",

                        square:
                            squareData
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
                            "Square did not return a payment link."
                    },
                    {
                        status: 500,
                        headers: corsHeaders
                    }
                );
            }


            // -----------------------------
            // SEND PAYMENT URL TO WEBSITE
            // -----------------------------

            return Response.json(
                {
                    success: true,

                    paymentUrl:
                        paymentUrl,

                    customer:
                        customerName || "",

                    bottleSize:
                        bottleSize || "",

                    totalBottles:
                        bottleCount,

                    total:
                        numericTotal.toFixed(2)
                },
                {
                    status: 200,
                    headers: corsHeaders
                }
            );


        } catch (error) {

            console.error(
                "Checkout function error:",
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
