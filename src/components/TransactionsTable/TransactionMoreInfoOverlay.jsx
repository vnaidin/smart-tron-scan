import React from 'react';
import { Popover } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetMoreTransactionsInfo } from '../../hooks';

const MoreInfoOverlay = React.forwardRef((props, ref) => {
  const { tronWeb } = window;
  const addTransactionInfo = useGetMoreTransactionsInfo(props.event);
  const analyzeTriggerInfoData = (dataString, methodString) => {
    switch (dataString.substring(0, 8)) {
      case 'ab94d950':
        return `deposit(${addTransactionInfo?.amount === 0 ? tronWeb.fromSun(props.event.amount) : addTransactionInfo?.amount})`;

      case '3ccfd60b':
        return `withdraw(${addTransactionInfo?.amount})`;

      default:
        return methodString;
    }
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Popover id="popover-basic" ref={ref} {...props}>
      <Popover.Header as="h3">Transaction Data</Popover.Header>
      <Popover.Body>
        {props.event.trigger_info ? (
          <>
            <p>
              Method :
              {' '}
              {analyzeTriggerInfoData(
                props.event.trigger_info?.data,
                props.event.trigger_info?.method,
              )}
            </p>
            {Object.keys(props.event.trigger_info?.parameter).length > 0 ? (
              <p>
                {'Parameter :\n'}
                { Object.entries(props.event.trigger_info?.parameter).map(([k, v]) => `\n${k}:${v}`) }
              </p>
            ) : null}
            <p>
              Blacklisted :
              {' '}
              {addTransactionInfo?.blacklisted?.toString()}
            </p>
          </>
        ) : (
          <p>
            Amount :
            {' '}
            {tronWeb.fromSun(props.event.amount)}
          </p>
        )}
      </Popover.Body>
    </Popover>

  );
});

export default MoreInfoOverlay;

MoreInfoOverlay.defaultProps = {
  // event: [...SMART_CONTRACT_ADDRESSES].sort(() => 0.5 - Math.random())[0].address,
};

MoreInfoOverlay.propTypes = {
  event: PropTypes.shape({
    amount: PropTypes.string,
    trigger_info: PropTypes.shape({
      data: PropTypes.string,
      method: PropTypes.string,
      parameter: PropTypes.shape({}),
    }),
  }).isRequired,
};
