interface ParseResult {
  lot: string | null;
  block: string | null;
  legalDescription: string;
}

function parseLotBlock(text: string): ParseResult {
  // Convert to uppercase for consistency
  text = text.toUpperCase();

  // Define patterns for lot and block
  const lotPattern = /(?:LOT|LT)\s*(\d+)/;
  const blockPattern = /(?:BLOCK|BLK)\s*(\d+)/;

  // Find matches
  const lotMatch = text.match(lotPattern);
  const blockMatch = text.match(blockPattern);

  // Extract lot and block numbers
  const lot = lotMatch ? lotMatch[1] : null;
  const block = blockMatch ? blockMatch[1] : null;

  // Remove lot and block information from the original string
  const legalDescription = text
    .replace(lotPattern, "")
    .replace(blockPattern, "")
    .trim()
    .replace(/\s+/g, " "); // Remove extra spaces

  return { lot, block, legalDescription };
}

interface AddressParts {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  zipCodeExtension: string | null;
}

function parseAddress(address: string): AddressParts {
  // Updated regular expression to keep street number and name together
  const regex = /^(.*?),?\s+(\w+(?:\s+\w+)*)\s+(\w{2})\s+(\d{5})(?:-(\d{4}))?$/;

  const match = address.match(regex);

  if (!match) {
    throw new Error("Invalid address format");
  }

  const [, street, city, state, zipCode, zipCodeExtension] = match;

  return {
    street: street.trim(),
    city,
    state,
    zipCode,
    zipCodeExtension: zipCodeExtension || null,
  };
}
