export default async function handler(req, res) {

    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://atasteofjade.github.io"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // Browser preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }


    // Only allow POST
    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed."
        });

    }


    try {

        const body = req.body || {};


        // ======================================
        // PACKAGES
        // ======================================

        const packages = {

            "1": {
                label: "1 Bottle - 16 oz",
                count: 1,
                price: 1100
            },

            "4": {
                label: "4-Pack",
                count: 4,
                price: 4400
            },

            "8": {
                label: "8-Pack",
                count: 8,
                price: 8800
            },

            "64": {
                label: "64 oz Half Gallon",
                count: 1,
                price: 3500
            }

        };


        const packageId =
            String(body.packageId || "");


        const selectedPackage =
            packages[packageId];


        if (!selectedPackage) {

            return res.status(400).json({
                error: "Invalid juice package."
            });

        }


        // ======================================
        // FLAVOR QUANTITIES
        // ======================================

        const quantities =
            body.quantities || {};


        const greenPasturesQty =
            Number(
                quantities["Green Pastures"] || 0
            );


        const rootedQty =
            Number(
                quantities["Rooted"] || 0
            );


        const restoreQty =
            Number(
                quantities["Restore"] || 0
            );


        const customQty =
            Number(
                body.customQuantity || 0
            );


        const customFlavor =
            String(
                body.customFlavor || ""
            ).trim();


        const fulfillment =
            String(
                body.fulfillment || "pickup"
            );


        const customerName =
            String(
                body.customerName || ""
            ).trim();


        // ======================================
        // VALIDATION
        // ======================================

        const quantityValues = [
            greenPasturesQty,
            rootedQty,
            restoreQty,
            customQty
        ];


        const quantitiesValid =
            quantityValues.every(
                function (qty) {

                    return (
                        Number.isInteger(qty) &&
                        qty >= 0 &&
                        qty <= 50
                    );

                }
            );


        if (!quantitiesValid) {

            return res.status(400).json({
                error: "Invalid juice quantity."
            });

        }


        const totalSelected =
            greenPasturesQty +
            rootedQty +
            restoreQty +
            customQty;


        if (
            totalSelected !==
            selectedPackage.count
        ) {

            return res.status(400).json({
                error:
                    "Please select exactly " +
                    selectedPackage.count +
                    " item(s)."
            });

        }


        if (
            customQty > 0 &&
            !customFlavor
        ) {

            return res.status(400).json({
                error:
                    "Custom flavor description is required."
            });

        }


        if (
            fulfillment !== "pickup" &&
            fulfillment !== "delivery"
        ) {

            return res.status(400).json({
                error:
                    "Invalid fulfillment option."
            });

        }


        // ======================================
        // TOTAL
        // ======================================

        const deliveryFee =
            fulfillment === "delivery"
                ? 800
                : 0;


        const totalInCents =
            selectedPackage.price +
            deliveryFee;


        // ======================================
        // SQUARE CREDENTIALS
        // ======================================

        const accessToken =
            process.env.SQUARE_ACCESS_TOKEN;


        const locationId =
            process.env.SQUARE_LOCATION_ID;


        if (
            !accessToken ||
            !locationId
        ) {

            console.error(
                "Missing Square credentials."
            );


            return res.status(500).json({
                error:
                    "Square payment configuration is incomplete."
            });

        }


        // ======================================
        // ORDER DESCRIPTION
        // ======================================

        const flavorParts = [];


        if (greenPasturesQty > 0) {

            flavorParts.push(
                "Green Pastures x" +
                greenPasturesQty
            );

        }


        if (rootedQty > 0) {

            flavorParts.push(
                "Rooted x" +
                rootedQty
            );

        }


        if (restoreQty > 0) {

            flavorParts.push(
                "Restore x" +
                restoreQty
            );

        }


        if (customQty > 0) {

            flavorParts.push(
                customFlavor +
                " x" +
                customQty
            );

        }


        let orderName =
            "A Taste of Jade - " +
            selectedPackage.label;


        if (flavorParts.length > 0) {

            orderName +=
                " - " +
                flavorParts.join(", ");

        }


        if (orderName.length > 120) {

            orderName =
                "A Taste of Jade - " +
                selectedPackage.label;

        }


        // ======================================
        // CREATE SQUARE PAYMENT LINK
        // ======================================

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
                                orderName,

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


        // ======================================
        // SQUARE ERROR
        // ======================================

        if (!squareResponse.ok) {

            console.error(
                "Square API error:",
                JSON.stringify(squareData)
            );


            return res.status(500).json({

                error:
                    "Square could not create the payment page.",

                details:
                    squareData?.errors || null

            });

        }


        const paymentUrl =
            squareData?.payment_link?.url;


        if (!paymentUrl) {

            return res.status(500).json({
                error:
                    "Square did not return a payment URL."
            });

        }


        // ======================================
        // SUCCESS
        // ======================================

        return res.status(200).json({

            success: true,

            paymentUrl:
                paymentUrl,

            customerName:
                customerName,

            package:
                selectedPackage.label,

            total:
                (
                    totalInCents / 100
                ).toFixed(2)

        });


    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );


        return res.status(500).json({
            error:
                "Checkout could not be created."
        });

    }

}
