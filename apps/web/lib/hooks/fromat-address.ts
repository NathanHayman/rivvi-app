interface Address {
  fullAddress?: {
    street?: string;
    suite?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export default function fromatAddress(address: Address) {
  // add a break after the street address and suite
  const street = address.fullAddress?.street
    ? `${address.fullAddress.street}`
    : "";
  const suite = address.fullAddress?.suite
    ? ` STE ${address.fullAddress.suite}`
    : "";
  const city = address.fullAddress?.city ? `${address.fullAddress.city}, ` : "";
  const state = address.fullAddress?.state
    ? `${address.fullAddress.state} `
    : "";
  const zip = address.fullAddress?.zip ? `${address.fullAddress.zip}` : "";

  // return the formatted address, with a break after the street address and suite, not 'br/>' as a string
  return `${street}${suite}, ${city}${state}${zip}`;
}
