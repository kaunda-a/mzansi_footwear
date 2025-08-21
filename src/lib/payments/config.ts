import { PaymentConfig } from "./types";

/**
 * South African Payment Gateway Configurations
 * 
 * Environment variables required:
 * - PAYFAST_MERCHANT_ID
 * - PAYFAST_MERCHANT_KEY  
 * - NEXT_PUBLIC_YOCO_PUBLIC_KEY
 * - YOCO_SECRET_KEY
 * - PAYMENT_TEST_MODE (true/false)
 */

const isTestMode = process.env.PAYMENT_TEST_MODE === "true";

export const paymentConfigs: PaymentConfig[] = [
  // PayFast - Most popular SA payment gateway
  {
    provider: "payfast",
    enabled: !!(
      process.env.PAYFAST_MERCHANT_ID && process.env.PAYFAST_MERCHANT_KEY
    ),
    testMode: isTestMode,
    credentials: {
      merchantId: process.env.PAYFAST_MERCHANT_ID || "",
      merchantKey: process.env.PAYFAST_MERCHANT_KEY || "",
    },
    settings: {
      supportedMethods: ["card", "eft", "instant_eft"],
      supportedCurrencies: ["ZAR"],
      minimumAmount: 5,
      maximumAmount: 1000000,
      processingFee: 3.5,
      processingFeeType: "percentage",
    },
  },

  // Yoco - Popular for in-person and online payments
  {
    provider: "yoco",
    enabled: !!(
      process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY && process.env.YOCO_SECRET_KEY
    ),
    testMode: isTestMode,
    credentials: {
      publicKey: process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY
        ? process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY.trim()
        : "",
      secretKey: process.env.YOCO_SECRET_KEY
        ? process.env.YOCO_SECRET_KEY.trim()
        : "",
    },
    settings: {
      supportedMethods: ["card"],
      supportedCurrencies: ["ZAR"],
      minimumAmount: 2,
      maximumAmount: 100000,
      processingFee: 2.95,
      processingFeeType: "percentage",
    },
  },
];

/**
 * Get configuration for a specific provider
 */
export function getProviderConfig(provider: string): PaymentConfig | undefined {
  return paymentConfigs.find((config) => config.provider === provider);
}

/**
 * Get all enabled providers
 */
export function getEnabledProviders(): PaymentConfig[] {
  return paymentConfigs.filter((config) => config.enabled);
}

/**
 * Validate that at least one payment provider is configured
 */
export function validatePaymentConfig(): void {
  const enabledProviders = getEnabledProviders();

  if (enabledProviders.length === 0) {
    console.warn("⚠️  No payment providers are configured and enabled");
    return;
  }

  console.log(
    `✅ ${enabledProviders.length} payment provider(s) configured:`,
    enabledProviders.map((p) => p.provider).join(", "),
  );

  // Validate required environment variables
  const missingVars: string[] = [];

  enabledProviders.forEach((config) => {
    Object.entries(config.credentials).forEach(([key, value]) => {
      if (!value) {
        missingVars.push(
          `${config.provider.toUpperCase()}_${key.toUpperCase()}`,
        );
      }
    });
  });

  if (missingVars.length > 0) {
    console.warn("⚠️  Missing environment variables:", missingVars.join(", "));
  }
}

/**
 * Payment method recommendations based on amount and customer location
 */
export function getRecommendedMethods(
  amount: number,
  customerLocation?: string,
): string[] {
  const recommendations: string[] = [];

  // For small amounts, recommend mobile payments
  if (amount < 100) {
    recommendations.push("snapscan", "zapper", "capitec_pay");
  }

  // For medium amounts, recommend cards and EFT
  if (amount >= 100 && amount < 5000) {
    recommendations.push("yoco", "payfast", "ozow");
  }

  // For large amounts, recommend secure options
  if (amount >= 5000) {
    recommendations.push("payfast", "paygate", "ozow");
  }

  // For very large amounts, recommend buy now pay later
  if (amount >= 10000) {
    recommendations.push("mobicred", "payflex");
  }

  return recommendations;
}

/**
 * Default payment configuration for development
 */
export const defaultTestConfig: PaymentConfig[] = [
  {
    provider: "payfast",
    enabled: true,
    testMode: true,
    credentials: {
      merchantId: "10000100",
      merchantKey: "46f0cd694581a",
      passphrase: "jt7NOE43FZPn",
    },
    settings: {
      supportedMethods: ["card", "eft"],
      supportedCurrencies: ["ZAR"],
      minimumAmount: 5,
      maximumAmount: 1000000,
      processingFee: 3.5,
      processingFeeType: "percentage",
    },
  },
];
