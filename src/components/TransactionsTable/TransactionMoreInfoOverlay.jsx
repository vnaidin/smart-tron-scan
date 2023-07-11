import React from 'react';
import { Popover } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetMoreTransactionsInfo } from '../../hooks';

const MoreInfoOverlay = React.forwardRef((props, ref) => {
  const { tronWeb } = window;
  const addTransactionInfo = useGetMoreTransactionsInfo(props.event);
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
              {props.event.trigger_info?.methodName}
            </p>
            {addTransactionInfo?.trigger_info?.parameter ? (
              <p>
                {'Parameter :\n'}
                { Object.entries(addTransactionInfo?.trigger_info?.parameter)
                  .map(([k, v]) => `\n${k}:${v}`) }
              </p>
            ) : ''}
            Result:
            {' '}
            {addTransactionInfo?.contractRet}
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
      methodName: PropTypes.string,
      parameter: PropTypes.shape({}),
    }),
  }).isRequired,
};
