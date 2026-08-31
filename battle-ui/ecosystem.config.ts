import { defineMyevmConfig } from "@myevm/ecosystem";

export default defineMyevmConfig({
  ecosystem: "myevm",
  appId: "specimen-game",
  displayName: "Specimen Game",
  apiUrl: process.env.NEXT_PUBLIC_MYEVM_API_URL,
  mode: "hybrid",

  features: {
    auth: true,
    firebase: false,
    stripe: false,
    subscriptions: false,
    credits: false,
    affiliates: false,
    web3: true,
    embeddedWallet: false,
    serverWallet: false,
    treasury: false,
    analytics: false,
  },

  web3: {
    enabled: true,
    embeddedWalletStrategy: "disabled",
  },
});