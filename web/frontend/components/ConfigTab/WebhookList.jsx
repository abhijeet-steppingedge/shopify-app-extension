import { useState, useEffect } from "react";
import {
  VerticalStack,
  IndexTable,
  Button,
  ButtonGroup,
  Text,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { respond } from "@shopify/app-bridge/actions/AuthCode";

import { getNotificationName, getNotificationSortByName } from "../../helper";

export function WebhookList() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(false);
  const [webhookLists, setWebhookLists] = useState([]);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  useEffect(() => {
    webhookRender();
  }, []); 

  const webhookRender = async () => {
    setIsLoading(true);
    const response = await fetch("/api/webhooks-list");
    setIsLoading(false);


    if (response.ok) {
      let result = await response.json();
      let data = getNotificationSortByName(result.data);
      setWebhookLists(data);
      setToastProps({ content: "Success!" });
    } else {
      setToastProps({
        content: "There was an error.",
        error: true,
      });
    }
  };

  const webhookSync = async () => {
    setIsLoading(true);
    let response = await fetch("/api/webhooks-sync").then(response => response.text());
    console.log(response)
    await webhookRender();
  };


  // const update_fulfillment_status = async () => {
  //   let response = await fetch("/api/update-fulfillment-status").then(response => response.text());
  //   console.log(response)
  // };

  const rowMarkup = webhookLists.map((list, index) => {
    return (
      <>
      { list.topic != 'app/uninstalled' && 

        <IndexTable.Row
          id={list.id}
          key={list.id}
          position={index}
        >
          <IndexTable.Cell>
            {getNotificationName(list.topic.toUpperCase().replace('/','_'))}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {list.updated_at}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {'Active'}
          </IndexTable.Cell>
        </IndexTable.Row>
      }
      </>
    )
  }
  );

  return (
    <>
      {toastMarkup}
        <VerticalStack
          gap="4"
          align="start"
        >
          <div style={{paddingTop: "20px"}}>
              <IndexTable
                itemCount={webhookLists.length}
                headings={[
                  { title: "Topic" },
                  { title: "Date created" },
                  { title: "Status" },
                ]}
                selectable={false}
                loading={isLoading}
              >
                {rowMarkup}
              </IndexTable>
            </div>

            <VerticalStack style={{ justifyContent: "end" }}>
              <ButtonGroup>
                <Button primary accessibilityLabel="Notification Sync" onClick={webhookSync}>
                  Refresh Sync
                </Button>
              </ButtonGroup>
            </VerticalStack>
        </VerticalStack>
    </>
  );
}
