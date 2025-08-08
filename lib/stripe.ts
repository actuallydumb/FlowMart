import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const createCheckoutSession = async ({
  workflowId,
  workflowName,
  price,
  buyerId,
}: {
  workflowId: string;
  workflowName: string;
  price: number;
  buyerId: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: workflowName,
            description: `Workflow: ${workflowName}`,
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/workflow/${workflowId}?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/workflow/${workflowId}?canceled=true`,
    metadata: {
      workflowId,
      buyerId,
    },
  });

  return session;
};

export const createPaymentIntent = async ({
  workflowId,
  workflowName,
  price,
  buyerId,
}: {
  workflowId: string;
  workflowName: string;
  price: number;
  buyerId: string;
}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(price * 100),
    currency: "usd",
    metadata: {
      workflowId,
      buyerId,
      workflowName,
    },
  });

  return paymentIntent;
};
