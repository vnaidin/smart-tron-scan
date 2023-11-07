import { useEffect, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useGetUsersWallet() {
  const [userWallet, setWallet] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadWatcher = setInterval(() => {
      if (window.tronWeb && window.tronWeb.ready) {
        setWallet(window.tronWeb.defaultAddress.base58);
        // setWallet('TTbVPbrgH5WbrvWVCRsF3Ljuvt1UVs9CnC');
        // setWallet('TEYA159sZzBdsNLXhpxHxJXrByZcKbLgrV');// Valya
        clearInterval(loadWatcher);
      } else {
        setShowModal((prev) => (prev === null ? null : true));
      }
    }, 500);
    /**
       * when tronLink extension is opened we check for the connection and so on
       */
    window.addEventListener('message', (res) => {
      if (res.data.message && res.data.message.action === 'setAccount') {
        if (window.tronWeb /* && (window.tronWeb.ready === false) */) {
          if (res.data.message.data.address !== window.tronWeb?.defaultAddress.base58) {
            setWallet(res.data.message.data.address);
          } // else { console.log(res.data.message); }
        } // else { console.log(res.data, 'tronweb not ready'); }
      } // else { console.log(res.data.message?.action); }
    });
    return () => window.removeEventListener('message', null);
  }, [userWallet]);
  return {
    userWallet, showAlert, showModal, setShowAlert, setShowModal,
  };
}
