import { BillingInterval } from "@shopify/shopify-api";

const mode = process.env.NODE_ENV || 'development';
var config = {};

if(mode=='development'){
    config = {
        TestMode: true,
        mongoAuth : 'mongodb://127.0.0.1:27017/',
        mongoDatabase : 'shopifyApp',
        subscription: false,
        billing:{
            "Bronze": {
                amount: 10.0,
                currencyCode: "USD",
                interval: BillingInterval.Every30Days,
                trialDays: 7,
                description: ["Feature 1","Feature 2"],
            },
            "Silver": {
                amount: 23.0,
                currencyCode: "USD",
                interval: BillingInterval.Every30Days,
                description: ["Feature 1","Feature 2"],
            },
            "Gold": {
                amount: 49.0,
                currencyCode: "USD",
                interval: BillingInterval.Every30Days,
                description: ["Feature 1","Feature 2"]
            }
        }
    }
}else {
    config = {
        TestMode: false,
        mongoAuth : 'mongodb://127.0.0.1:27017/',
        mongoDatabase : 'shopifyApp',
        subscription: true,
        billing:{
            "Bronze": {
                amount: 10.0,
                currencyCode: "USD",
                interval: BillingInterval.Every30Days,
                trialDays: 7,
                description: ["Feature 1","Feature 2"],
            },
            "Silver": {
                amount: 23.0,
                currencyCode: "USD",
                interval: BillingInterval.Every30Days,
                description: ["Feature 1","Feature 2"],
            },
            "Gold": {
                amount: 49.0,
                currencyCode: "USD",
                interval: BillingInterval.Every30Days,
                description: ["Feature 1","Feature 2"]
            }
        }
    }
}

export default config;