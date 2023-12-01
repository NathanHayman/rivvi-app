export function getPlanFromPriceId(priceId: string) {
  const env =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "production" : "test";
  return PLANS.find(
    (plan) =>
      plan.price.monthly.priceIds[env] === priceId ||
      plan.price.yearly.priceIds[env] === priceId,
  )!;
}

// custom type coercion because Stripe's types are wrong
export function isUpgrade(
  previousAttributes:
    | {
        default_payment_method?: string;
        items?: {
          data?: {
            price?: {
              id?: string;
            }[];
          };
        };
      }
    | undefined,
) {
  const oldPriceId =
    previousAttributes?.items?.data &&
    previousAttributes?.items?.data[0].price.id;

  //
  return oldPriceId && getPlanFromPriceId(oldPriceId).slug === "pro";
}

export const PLANS = [
  {
    name: "Pro",
    slug: "pro",
    quota: 50000,
    price: {
      monthly: {
        amount: 199,
        priceIds: {
          test: "price_1OHOznFXIWtAVpUtCFDid8Ct",
          production: "price_1OHOznFXIWtAVpUtCFDid8Ct",
        },
      },
      yearly: {
        amount: 1999,
        priceIds: {
          test: "price_1OHOznFXIWtAVpUt5E1orbbl",
          production: "price_1OHOznFXIWtAVpUt5E1orbbl",
        },
      },
    },
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    quota: 1000000000, // arbitrary large number to represent unlimited – might need to change this in the future
    price: {
      monthly: {
        amount: 299,
        priceIds: {
          test: "price_1OHP0vFXIWtAVpUtHMuDxCqp",
          production: "price_1OHP0vFXIWtAVpUtHMuDxCqp",
        },
      },
      yearly: {
        amount: 2999,
        priceIds: {
          test: "price_1OHP0VFXIWtAVpUtok8nZNlI",
          production: "price_1OHP0VFXIWtAVpUtok8nZNlI",
        },
      },
    },
  },
];
