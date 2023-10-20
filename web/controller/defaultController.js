import express from "express";
import shopify from "../shopify.js";
import config from "../config.js";
import client from "../db.js";

const app = express.Router();

app.get("/api/webhooks-sync", async (_req, res) => {
  
    try {
        const response = await shopify.api.webhooks.register({
        session: res.locals.shopify.session,
        });
        res.status(200).send(response);
    } catch (error) {
        res.status(400).send(error);
    }
});


app.get("/api/webhooks-list", async (_req, res) => {
    try{
        let webhooks = await shopify.api.rest.Webhook.all({
            session: res.locals.shopify.session,
        });
        res.status(200).send(webhooks);
    } catch (error) {
        res.status(400).send(error);
    }
});


app.get('/api/check-update-billing', async (req, res) => {
    try {
        const session = res.locals.shopify.session;
        let shop = res.locals.shopify.session.shop;

        const shopifyPlanUsageCollection = client.db(config.mongoDatabase).collection('shopify_plan_usage');

        const allPayment = await shopify.api.rest.RecurringApplicationCharge.all({
            session,
        });

        const activePlan = allPayment.data.find((p) => p.status === 'active');

        if (!activePlan) {
            res.status(200).json({ status: false });
            return;
        }

        const planName = activePlan.name;
        const planId = activePlan.id;

        const rows = await shopifyPlanUsageCollection
        .find({
            $and: [
            { shop: shop },
            { planId: planId },
            ],
        })
        .toArray();

        if (rows.length == 0) {
            const billing = config.billing[planName];
            const planPrice = billing.amount;

            const record = {
                shop: shop,
                plan: planName,
                price: planPrice,
                planId: planId,
                createdDate: new Date()
            };

            const result = await shopifyPlanUsageCollection.insertOne(record);

            if (result.acknowledged) {
                res.status(200).json({ status: true, data: record });
            } else {
                res.status(400).json({ status: false, error: 'Failed to insert data' });
            }
        }else{
            res.status(200).json({ status: true, data: {plan: planName} });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ status: false, error: error.message });
    }
});

app.post("/api/billing-plan", async (req, res) => {
    try{
        const plan = req.body.plan; 
        const session = res.locals.shopify.session;
        let hasPayment = await shopify.api.billing.check({
        session,
        plans: [plan],
        isTest: config.billing.isTest,
        });

        if (hasPayment) {
            res.status(200).json({"status": false});
        } else {
            let redirectURL = await shopify.api.billing.request({
                session,
                plan: plan,
                isTest: config.billing.isTest,
            });
            res.status(200).json({"status": true, "redirectURL": redirectURL});
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/api/test-billing", async (_req, res) => {
    console.log('API')
        try{
        const session = res.locals.shopify.session;
        let shop = res.locals.shopify.session.shop;

        const shopifyPlanUsageCollection = client.db(config.mongoDatabase).collection('shopify_plan_usage');
        const result = await shopifyPlanUsageCollection.insertOne({
            shop: shop,
            plan: 'xyz',
            planId: 423432432,
            price: 30,
            createdDate: new Date()
        });
console.log(result)
        res.status(200).send(result);
        
        
        // let hasPayment = await shopify.api.billing.check({
        //     session,
        //     plans: [Object.keys(config.billing)[1],Object.keys(config.billing)[1]],
        //     isTest: config.billing.isTest,
        // });

        // const hasPayment = await shopify.api.rest.RecurringApplicationCharge.all({
        // session,
        // });

        // let redirectURL = await shopify.api.billing.request({
        //     session,
        //     plan: Object.keys(config.billing)[1],
        //     isTest: config.billing.isTest,
        // });
        // res.status(200).json({"status": false, "redirectURL": redirectURL});

        // const hasPayment = await shopify.api.rest.RecurringApplicationCharge.delete({
        //     session: session,
        //     id: 29333422396,
        // });
        // res.status(200).send(hasPayment);

    } catch (error) {
        res.status(400).send(error);
    }
});
  

export default app;