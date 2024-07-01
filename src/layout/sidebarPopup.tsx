import React from "react";

import { Button, Sheet, Text } from "@shopify/polaris";

import { XCircleIcon } from "@shopify/polaris-icons";

export default function SidebarPopup({
  show,
  children,
  title,
  onClose,
}: {
  show: boolean;
  title: string;
  children: any;
  onClose: () => void;
}) {
  return (
    <>
      <Sheet
        open={show}
        onClose={onClose}
        accessibilityLabel={title}
        onExit={onClose}
      >
        <div
          style={{
            alignItems: "center",
            borderBottom: "1px solid #DFE3E8",
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem",
            width: "100%",
          }}
        >
          <Text variant="headingMd" as="h2">
            {title}
          </Text>
          <Button
            accessibilityLabel="Cancel"
            icon={XCircleIcon}
            onClick={onClose}
            variant="plain"
          />
        </div>

        <div
          style={{
            overflow: "auto",
            height: "calc(100% - 35px)",
            paddingBottom: "2rem",
          }}
        >
          {children}
        </div>
      </Sheet>
    </>
  );
}
