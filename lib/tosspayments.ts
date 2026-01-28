import { Buffer } from 'buffer';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

export class TossPaymentsError extends Error {
  code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'TossPaymentsError';
  }
}

/**
 * Encodes the secret key for Basic Auth
 */
function getAuthorizationHeader() {
  if (!TOSS_SECRET_KEY) {
    throw new TossPaymentsError('TOSS_SECRET_KEY is not configured', 'CONFIG_ERROR');
  }
  return `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`;
}

/**
 * Issue a Billing Key using authKey (from successUrl) and customerKey
 */
export async function issueBillingKey(authKey: string, customerKey: string) {
  const response = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
    method: 'POST',
    headers: {
      Authorization: getAuthorizationHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authKey,
      customerKey,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new TossPaymentsError(errorBody.message, errorBody.code);
  }

  return response.json();
}

/**
 * Request a payment using Billing Key
 */
export async function confirmBillingPayment(billingKey: string, params: {
  amount: number;
  customerKey: string;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  taxFreeAmount?: number;
}) {
  const response = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
    method: 'POST',
    headers: {
      Authorization: getAuthorizationHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new TossPaymentsError(errorBody.message, errorBody.code);
  }

  return response.json();
}
