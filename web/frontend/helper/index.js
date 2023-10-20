const WebhookSequencelists = {
    "ORDERS_CREATE": "Order confirmed",
    "ORDERS_PAID": "Order paid",
    "ORDERS_CANCELLED": "Order cancelled",
    "ORDERS_FULFILLED": "Order fulfilled",
    "ORDERS_PARTIALLY_FULFILLED": "Order partially fulfilled",
    "FULFILLMENTS_UPDATE": "Shipment update",
    "ORDERS_UPDATED": "Refund status",
}

export const getNotificationName = (name) => {
    return WebhookSequencelists.hasOwnProperty(name)?WebhookSequencelists[name]:"";
}

export const getNotificationSortByName = (data) => {
    data.sort((a, b) => {
        const keysArray = Object.keys(WebhookSequencelists);
        const aKey = keysArray.indexOf(a.topic.toUpperCase().replace('/','_'));
        const bKey = keysArray.indexOf(b.topic.toUpperCase().replace('/','_'));
        
        if (aKey < bKey) {
            return -1;
        } else if (aKey > bKey) {
            return 1;
        } else {
            return 0;
        }
    });
    return data;
}

export const getWebhookSortByName = (data) => {
    data.sort((a, b) => {
        const keysArray = Object.keys(WebhookSequencelists);
        const aKey = keysArray.indexOf(a.webhook);
        const bKey = keysArray.indexOf(b.webhook);
        
        if (aKey < bKey) {
            return -1;
        } else if (aKey > bKey) {
            return 1;
        } else {
            return 0;
        }
    });
    return data;
}

export default WebhookSequencelists;