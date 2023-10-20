import { 
    Text,
    Button, 
    Layout,
    Frame,
    VerticalStack,
    HorizontalGrid,
    Page,
    AlphaCard,
    Divider,
    Toast,
} from '@shopify/polaris';

import { useState, useEffect } from "react";

import { useNavigate } from "@shopify/app-bridge-react";

import { useAuthenticatedFetch } from "../hooks";

import config from "../../config";

import { ContactSection } from "../components/contactSection";

function SubscriptionPage() {
    console.log(config.billing)
    const fetch = useAuthenticatedFetch();
    const navigate = useNavigate();
    const emptyToastProps = { content: null };
    const [toastProps, setToastProps] = useState(emptyToastProps);
    const [isDisabled, setIsDisabled] = useState(false);
    const subscriptions = config.billing;

    const toastMarkup = toastProps.content && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
    );

    const subscribePlan = async (plan) => {
        setIsDisabled(true);
        setToastProps({
            content: "Processing...",
        });
        const response = await fetch("/api/billing-plan",{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({plan: plan})
        });

        if(response.ok){
            let result = await response.json();
            console.log(result);
            if(result.status){
                navigate(result.redirectURL);
            }else{
                setToastProps({
                    content: "Already subscribed!",
                    error: true,
                });
            }
        } else {
            setToastProps({
                content: "There was an error.",
                error: true,
            });
        }
        setIsDisabled(false);
    }

    const renderSubscriptionCards = () => {
        let boxs = [];
        Object.keys(subscriptions).forEach(function(plan) {
            let box = (
                <>
                <div className="subscription-card">
                    <AlphaCard sectioned>
                        <VerticalStack gap="5">
                            <Text variant="headingMd" as="h6" color="subdued" fontWeight="regular"> 
                                {plan.toUpperCase()}
                            </Text>
                            <Text variant="headingXl" as="h3">
                                {(subscriptions[plan].interval == 'EVERY_30_DAYS')? `$${subscriptions[plan].amount}/month`: `$${subscriptions[plan].amount} One-Time`}
                            </Text>
                            <Divider />
                            <VerticalStack gap="2">
                                {subscriptions[plan].description.map((list)=>{
                                    return <Text variant="bodyMd" as="p">{list}</Text>
                                })}
                            </VerticalStack>
                            <Divider />
                            <Button disabled={isDisabled} onClick={() => subscribePlan(plan)}>
                                Subscribe
                                {subscriptions[plan].trialDays? ` with ${subscriptions[plan].trialDays} days trial free`:''}
                            </Button>
                        </VerticalStack>
                    </AlphaCard>
                </div>
                </>
            );
            boxs.push(box);
        });

        return boxs;
    };

    return (
        <>
        <Frame>
            <Page
            backAction={{content: 'Main', url: '/'}}
            title="Choose your Plan"
            >
                <Layout>
                <Layout.Section>
                    <HorizontalGrid gap="4" columns={{xs: 1, sm: 1, md: 4}}>
                        {renderSubscriptionCards()}
                        <div className="subscription-card">
                            <AlphaCard sectioned>
                                <VerticalStack gap="5">
                                    <Text variant="headingMd" as="h6" color="subdued" fontWeight="regular"> 
                                        CUSTOM PLAN
                                    </Text>
                                    <Text variant="headingXl" as="h3">
                                        $-/month
                                    </Text>
                                    <Divider />
                                    <VerticalStack gap="2">
                                        <Text variant="bodyMd" as="p">
                                            All basic feature included.
                                        </Text>
                                        <Text variant="bodyMd" as="p">
                                            Contact us for further details
                                        </Text>
                                    </VerticalStack>
                                    <Divider />
                                    
                                </VerticalStack>
                            </AlphaCard>
                        </div>
                    </HorizontalGrid>
                </Layout.Section>
                <ContactSection/>
                </Layout>
            </Page>
            {toastMarkup}
        </Frame>
        </>
    );
}

export default SubscriptionPage;