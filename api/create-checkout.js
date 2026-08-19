export default async function handler(req, res) {
  // Allow your GitHub Pages website to call this API
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://atasteofjade.github.io"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed."
    });
  }

  try {
    const {
      customerName = "",
      greensQuantity = 0,
      teaQuantity = 0,
      customQuantity = 0,
      customFlavor = "",
      fulfillment = "pickup"
    } = req.body || {};

    // Convert quantities to numbers
    const greensQty = Number(greensQuantity) || 0;
    const teaQty = Number(teaQuantity) || 0;
    const customQty = Number(customQuantity) || 0;

    // Make sure quantities are valid
    const quantities = [
      greensQty,
      teaQty,
      customQty
    ];

    const quantitiesValid = quantities.every(
      (qty) =>
        Number.isInteger(qty) &&
        qty >= 0 &&
        qty <= 50
    );

    if (!quantitiesValid) {
      return res.status(400).json({
        error: "Invalid juice quantity."
      });
    }

    const totalBottles =
      greensQty +
      teaQty +
      customQty;

    if (totalBottles < 1) {
      return res.status(400).json({
        error: "Please add at least one bottle."
      });
    }

    // Custom flavor must have a description
    if (
      customQty > 0 &&
      !String(customFlavor).trim()
    ) {
      return res.status(400).json({
        error:
          "Please enter your custom flavor request."
      });
    }

    // Validate fulfillment
    if (
      fulfillment !== "pickup" &&
      fulfillment !== "delivery"
    ) {
      return res.status(400).json({
        error: "Invalid fulfillment option."
      });
    }

    // =========================================
    // PRICES
    // =========================================

    // Jade's Greens Glow = $8
    const greensPrice = 800;

    // Yellow Watermelon Iced Tea = $7
    const teaPrice = 700;

    // Custom Flavor = $8
    const customPrice = 800;

    // Delivery = $8
    const deliveryFee =
      fulfillment === "delivery"
        ? 800
        : 0;

    const totalInCents =
      greensQty * greensPrice +
      teaQty * teaPrice +
      customQty * customPrice +
      deliveryFee;

    // =========================================
    // SQUARE CREDENTIALS FROM VERCEL
    // =========================================

    const accessToken =
      process.env.SQUARE_ACCESS_TOKEN;

    const locationId =
      process.env.SQUARE_LOCATION_ID;

    if (!accessToken || !locationId) {
      console.error(
        "Missing Square environment variables."
      );

      return res.status(500).json({
        error:
          "Square payment configuration is incomplete."
      });
    }

    // =========================================
    // BUILD ORDER NAME
    // =========================================

    const orderParts = [];

    if (greensQty > 0) {
      orderParts.push(
        `${greensQty} Jade's Greens Glow`
      );
    }

    if (teaQty > 0) {
      orderParts.push(
        `${teaQty} Yellow Watermelon Iced Tea`
      );
    }

    if (customQty > 0) {
      orderParts.push(
        `${customQty} Custom Flavor`
      );
    }

    let orderName =
      `A Taste of Jade: ${orderParts.join(", ")}`;

    // Square limits some text fields,
    // so keep the name reasonable.
    if (orderName.length > 120) {
      orderName =
        `A Taste of Jade - ${totalBottles} bottles`;
    }

    // =========================================
    // CREATE SQUARE CHECKOUT LINK
    // =========================================

    const squareResponse = await fetch(
      "https://connect.squareup.com/v2/online-checkout/payment-links",
      {
        method: "POST",

        headers: {
          Authorization:
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
            name: orderName,

            price_money: {
              amount: totalInCents,
              currency: "USD"
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

    // If Square rejects the request,
    // show the error in Vercel logs.
    if (!squareResponse.ok) {
      console.error(
        "Square API error:",
        JSON.stringify(squareData)
      );

      return res.status(500).json({
        error:
          "Square could not create the payment page.",
        square:
          squareData?.errors || null
      });
    }

    const paymentUrl =
      squareData?.payment_link?.url;

    if (!paymentUrl) {
      console.error(
        "Square response did not contain payment_link.url:",
        squareData
      );

      return res.status(500).json({
        error:
          "Square did not return a payment link."
      });
    }

    // =========================================
    // SEND PAYMENT LINK BACK TO WEBSITE
    // =========================================

    return res.status(200).json({
      success: true,
      paymentUrl: paymentUrl,
      totalBottles: totalBottles,
      total:
        (totalInCents / 100).toFixed(2),
      customerName:
        String(customerName).trim()
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
