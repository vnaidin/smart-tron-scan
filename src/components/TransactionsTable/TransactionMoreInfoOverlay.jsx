import React from 'react';
import { Popover } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetMoreTransactionsInfo } from '../../hooks';

const MoreInfoOverlay = React.forwardRef((props, ref) => {
  const addTransactionInfo = useGetMoreTransactionsInfo(props.event);
  const xxxx = props.event.trigger_info?.methodId === '3ccfd60b' && addTransactionInfo?.contractRet === 'SUCCESS'
  // eslint-disable-next-line no-unsafe-optional-chaining
    ? +addTransactionInfo?.transfersAllList[0].amount_str : 0;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Popover id="popover-basic" ref={ref} {...props}>
      <Popover.Header as="h3">Transaction Data</Popover.Header>
      <Popover.Body>
        <>
          {props.event.trigger_info?.methodName ? (
            <p className="my-0">
              Method :
              {' '}
              {props.event.trigger_info.methodName}
            </p>
          ) : undefined}
          {addTransactionInfo?.trigger_info?.parameter
            && Object.keys(addTransactionInfo?.trigger_info?.parameter).length > 0 ? (
              <p className="my-0">
                {'Parameter :\n'}
                { Object.entries(addTransactionInfo?.trigger_info?.parameter)
                  .map(([k, v]) => `\n${k}:${v}`) }
              </p>
            ) : undefined}
          Result:
          {' '}
          {addTransactionInfo?.contractRet}
        </>
        <p className="my-0">
          Amount :
          {' '}
          {(+props.event.amount > 0 ? props.event.amount
            : +xxxx) / 1000000}
        </p>
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
      methodId: PropTypes.string,
      parameter: PropTypes.shape({}),
    }),
  }).isRequired,
};
