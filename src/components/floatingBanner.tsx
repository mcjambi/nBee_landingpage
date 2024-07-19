import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import 'media/css/floatingBanner.scss';
import { Button, Collapsible, Icon, InlineStack } from '@shopify/polaris';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from '@shopify/polaris-icons';

export default function FloatingBanner({
  openInFirstView = false,
  icon = InfoIcon,
  title = 'Tựa đề',
  children,
}: {
  openInFirstView?: boolean;
  icon: any;
  title: string;
  children?: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  // delay show up
  const [timetoshow, setTimetoshow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setTimetoshow(true);
    }, 1500);
  }, []);

  useEffect(() => {
    if (openInFirstView) {
      setTimeout(() => {
        setOpen(true);
      }, 2000);
    }
  }, [openInFirstView]);

  return (
    <div className={`floating_banner ${timetoshow ? '' : 'hidden'}`}>
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

        <Collapsible open={open} id="basic-collapsible" transition={{ duration: '500ms', timingFunction: 'ease-in-out' }} expandOnPrint>
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
