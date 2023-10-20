import { useState, useEffect } from "react";

import {
  VerticalStack,
  Page,
  Layout,
  AlphaCard,
  HorizontalGrid,
  Link,
  Frame,
  Text,
  Button,
  ButtonGroup,
  List,
  SkeletonBodyText,
} from "@shopify/polaris";

import { useAuthenticatedFetch } from "../hooks";

import { useNavigate, useAppBridge } from "@shopify/app-bridge-react";

import { ContactSection } from "../components/contactSection";

import { Toast } from "@shopify/app-bridge-react";

import '../assets/css/common.css';

import config from "../../config";

export default function HomePage() {

  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [loadingPage, setLoadingPage] = useState(false);
  const [billingPlan, setbillingPlan] = useState({});
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const bridge = useAppBridge();
  const shopUrl = bridge.hostOrigin;

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const check_billing = async () => {
    setLoadingPage(true)
    let response = await fetch("/api/check-update-billing").then(response => response.json());
    if(!response.status){
      
      setToastProps({
        content: "No Subscription plan exists!",
        error: true,
      });

      // setTimeout(()=>{
      //   navigate('/subscriptionPlan');
      // },2000);
    }else{
      setbillingPlan(response.data);
      setLoadingPage(false);
    }
  };

  const test_billing = async () => {
    let response = await fetch("/api/test-billing").then(response => response.json());
    console.log(response);
  };

  useEffect(() => {
    if(config.subscription){
      check_billing();
    }
    // test_billing();
  }, []); 

  const emptySkeletonBodyText = (
    <>
    <Layout.Section>
      <AlphaCard>
        <SkeletonBodyText lines={10}/>
      </AlphaCard>
    </Layout.Section>

    <Layout.Section>
      <AlphaCard>
      <SkeletonBodyText lines={10} />
      </AlphaCard>
    </Layout.Section>

    <Layout.Section>
      <AlphaCard>
        <SkeletonBodyText lines={2} />
      </AlphaCard>
    </Layout.Section>
    </>
    );

  return (
    <Frame>
      <Page>
        <Layout>
        {toastMarkup}
        {loadingPage ? emptySkeletonBodyText : (
          <>
          <Layout.Section>
            <AlphaCard>
              <VerticalStack gap="4">
                <Text variant="headingMd" as="h2">
                  Shopify Sample App with Extension feature.
                </Text>
                <VerticalStack gap="3">
                  <div>Please follow these steps to configure your application.</div>
                  <div>Theme Customize{'>'} App embeds {'>'} Enable/Disable Extension</div>
                </VerticalStack>
              </VerticalStack>  
            </AlphaCard>
          </Layout.Section>

          {config.subscription ? (
          <>
          <Layout.Section>
            <AlphaCard>
              <HorizontalGrid gap="4" columns={{xs: 1, sm: 1, md: ['twoThirds', 'oneThird']}} alignItems="end">
                <VerticalStack gap="2">
                  {
                    billingPlan.plan ? (
                      <>
                      <HorizontalGrid alignItems="center">
                      <Text variant="bodyMd" fontWeight="bold" as="span">Current plan: {billingPlan.plan}</Text>
                      </HorizontalGrid>
                      </>
                    ): ''
                  }
                  
                  <Text variant="bodyMd" as="p">Explore our best plan to accelerate your business growth.</Text>
                </VerticalStack>
                <VerticalStack style={{ justifyContent: "end" }}>
                  <ButtonGroup>
                    <Button accessibilityLabel="Upgrade your plan" onClick={() => { navigate('/subscriptionPlan'); }}>
                      Plans
                    </Button>
                  </ButtonGroup>
                </VerticalStack>
              </HorizontalGrid>
            </AlphaCard>
          </Layout.Section>
          </>
          ):''
          }

          <ContactSection/>
          </>
          )}
        </Layout>
      </Page>
    </Frame>
  );
}
