import {
    VerticalStack,
    Layout,
    AlphaCard,
    HorizontalGrid,
    Link,
    Text,
    Icon,
} from "@shopify/polaris";

import {ChatMajor, EmailMajor} from '@shopify/polaris-icons';


export function ContactSection (){
    return (
        <>
        <Layout.Section>
            <AlphaCard>
              <HorizontalGrid gap="4" columns={{xs: 1, sm: 1, md: ['twoThirds', 'oneThird']}} alignItems="end">
                <VerticalStack gap="2">
                  <Text variant="headingMd" as="h3">Customer Support:</Text>
                  <Text variant="bodyMd" as="p">Contact us with your queries, we'll response you within 1-2 working days.</Text>
                </VerticalStack>
                <VerticalStack gap="2" inlineAlign="end">
                  <div class="inlineIcon">
                    <Icon source={EmailMajor} color="inkLighter" />
                    <Text variant="bodyMd" as="span">
                      abhijeet@steppingedge.com
                    </Text>
                  </div>
                  {/* <div class="inlineIcon">
                    <Icon source={ChatMajor} color="inkLighter" />
                    <Text variant="bodyMd" as="p">
                      <Link monochrome url="https://wa.me/917738919680" target="_blank" external>+917738919680</Link>
                    </Text>
                  </div> */}
                </VerticalStack>
              </HorizontalGrid>
            </AlphaCard>
          </Layout.Section>
        </>
    )
}