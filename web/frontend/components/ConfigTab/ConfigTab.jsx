import {Text, Tabs} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import {WebhookList} from './WebhookList';
import {WhatsAppTab} from './WhatsAppTab';
import { SmsTab } from './SmsTab';

export function ConfigTab() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'tab-1',
      content: 'Notifications',
      children: <WebhookList/>,
      accessibilityLabel: 'Notifications',
      panelID: 'tab-content-1',
    },
    {
      id: 'tab-2',
      content: 'WhatsApp',
      children: <WhatsAppTab/>,
      accessibilityLabel: 'WhatsApp',
      panelID: 'tab-content-2',
    },
    {
      id: 'tab-3',
      content: 'SMS',
      children: <SmsTab/>,
      accessibilityLabel: 'SMS',
      panelID: 'tab-content-3',
    },
  ];

  return (
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Text variant="bodyMd" as="p">{tabs[selected].children}</Text>
      </Tabs>
  );
}