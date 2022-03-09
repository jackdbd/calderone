interface AddressConfig {
  country_code: string;
  field?: "BILLING" | "SHIPPING";
}

// TODO: see Keap docs
export const address = ({ country_code, field }: AddressConfig) => {
  return {
    // 3 character country code (Italy is ITA, Germany is DEU, Switzerland is CHE)
    // https://www.iban.com/country-codes
    country_code,
    field,
    // line1: patch.address,
    // line2: '',
    // locality: patch.city,
    // postal_code: patch.postalCode,
    // https://community.keap.com/t/billing-and-shipping-region-invalid-when-updating-contact/557
    // https://en.wikipedia.org/wiki/ISO_3166-2:IT
    // region: patch.province,
    // zip_code: patch.postalCode,
    // https://en.wikipedia.org/wiki/ZIP_Code#ZIP+4
    // https://www.smartystreets.com/articles/zip-4-code
    // zip_four: ''
  };
};

export const billingAddress = ({ country_code }: AddressConfig) => {
  return address({ country_code, field: "BILLING" as const });
};

export const shippingAddress = ({ country_code }: AddressConfig) => {
  return address({ country_code, field: "SHIPPING" as const });
};
