import React from "react";

import { FormattedMessage, useIntl } from "react-intl";

export const LocaleFormatter = ({ ...props }) => {
  const notChildProps = { ...props, children: undefined };
  return <FormattedMessage {...notChildProps} id={props.id} />;
};

export const useLocale = () => {
  const { formatMessage: _formatMessage, ...rest } = useIntl();
  const formatMessage = _formatMessage;
  return {
    ...rest,
    formatMessage,
  };
};
