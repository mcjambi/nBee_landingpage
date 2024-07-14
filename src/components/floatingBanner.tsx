import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import 'media/css/floatingBanner.scss';
import { Button, Collapsible, Icon, InlineStack } from '@shopify/polaris';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from '@shopify/polaris-icons';

export default function FloatingBanner({ icon = InfoIcon, title = 'Tựa đề', children }: { icon: any; title: string; children?: ReactElement }) {
  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <div className="floating_banner">
      <div className="floating_wrap">
        <div className="floating_header">
          <InlineStack blockAlign="center" align="space-between">
            <Button variant="plain" icon={icon} onClick={handleToggle} ariaExpanded={open} ariaControls="basic-collapsible">
              {title}
            </Button>
            <span>
              <Icon source={open ? ChevronUpIcon : ChevronDownIcon} />
            </span>
          </InlineStack>
        </div>

        <Collapsible open={open} id="basic-collapsible" transition={{ duration: '200ms', timingFunction: 'ease-in-out' }} expandOnPrint>
          <div>
            <br />
            {children}
            <br />
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
