import { useState, useEffect } from "react";
import {
  HorizontalGrid,
  VerticalStack,
  IndexTable,
  Button,
  ButtonGroup,
  Text,
  RadioButton,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { respond } from "@shopify/app-bridge/actions/AuthCode";

import { getNotificationName, getWebhookSortByName } from "../../helper";

export function SmsTab() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [List, setList] = useState([]);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const [TemplateChecked, setTemplateChecked] = useState([]);

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  useEffect(() => {
    ListRender();
  }, []); 

  const ListRender = async () => {
    setIsLoading(true);
    const response = await fetch("/api/saved/template?type=sms");
    setIsLoading(false);

    if (response.ok) {
      
      let result = await response.json();
      let data = getWebhookSortByName(result.data);

      let checklist = data.map((val) => {
        if(val.id == val.temp_id){
          val['selected'] = true;
        }else{
          val['selected'] = false;
        }
        return val;
      });

      setTemplateChecked(checklist);
      setList(result.data);
      setIsActive(result.notificationStatus);

      setToastProps({ content: "Success!" });

    } else {
      setToastProps({
        content: "There was an error.",
        error: true,
      });
    }
  };


  const SaveTemplate = async (status) => {

    var webhook = {};
    TemplateChecked.forEach((val) => {
      if(val.id == val.temp_id){
          webhook[val.webhook] = val.id 
      }
    })
    let payload = {
      type: 'sms', 
      webhook: webhook,
      status: status
    };

    
    setIsLoading(true);
    const response = await fetch("/api/template/bulk/save",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    setIsLoading(false);

    if (response.ok) {
      let result = await response.json();
      console.log(result);
      setToastProps({ content: "Success!" });
    } else {
      setToastProps({
        content: "There was an error.",
        error: true,
      });
    }
  }


  const updateTemplate = async (index, list, webhook, selectedId) => {
    let checklist = list.map((val) => {
      if(val.webhook == webhook){
        if(val.id == selectedId){
          val['selected'] = true;
        }else{
          val['selected'] = false;
        }
        val.temp_id = selectedId;
      }
      return val;
    });

    setTemplateChecked(checklist);
  };

  const activeChannel = () =>{

    if(isActive){
      setIsActive(false);
      setToastProps({ content: "Disabled!" });
      SaveTemplate(false);
    }else{
      setIsActive(true);
      setToastProps({ content: "Enabled!" });
      SaveTemplate(true);
    }
  }
  
  const rowMarkup = List.map((list, index) => {
    return (
      <>
      { 
        <IndexTable.Row
          id={list.id}
          key={`sms-list-`+index}
          position={index}
        >
          <IndexTable.Cell>
            {getNotificationName(list.webhook)}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div style={{ whiteSpace: 'break-spaces', width: '100%' }}>
              {list.template}
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <RadioButton
                id={list.webhook+'_'+list.id}
                name={list.webhook}
                checked={TemplateChecked[index]['selected'] || false}
                onChange={() => updateTemplate(index, List, list.webhook, list.id)}
            />
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
              itemCount={List.length}
              headings={[
                { title: "Notification" },
                { title: "Template" },
                { title: "Action" },
              ]}
              selectable={false}
              loading={isLoading}
              lastColumnSticky
            >
              {rowMarkup}
            </IndexTable>
          </div>

          <HorizontalGrid  columns={2} alignItems="end">
            <VerticalStack>
              <ButtonGroup segmented>
                <Button accessibilityLabel="Activate Channel" pressed={isActive} onClick={activeChannel}>
                  Enable
                </Button>
                <Button accessibilityLabel="Disable Channel" pressed={!isActive} onClick={activeChannel}>
                  Disable
                </Button>
              </ButtonGroup>
            </VerticalStack>
            <VerticalStack style={{ justifyContent: "end" }}>
              <ButtonGroup>
                <Button primary accessibilityLabel="Save Template" onClick={()=> SaveTemplate(isActive)}>
                  Save
                </Button>
                <Button accessibilityLabel="Refresh Template" onClick={ListRender}>
                  Refresh
                </Button>
              </ButtonGroup>
            </VerticalStack>
          </HorizontalGrid>
          <VerticalStack>
            <Text variant="bodyMd" as="p">* For custom template creation, contact us on below details.</Text>
          </VerticalStack>
        </VerticalStack>
    </>
  );
}
