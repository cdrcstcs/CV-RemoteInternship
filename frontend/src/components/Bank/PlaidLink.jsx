import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useBankAccountStore } from '../../stores/useBankAccountStore';
import Image from 'react-image';

const PlaidLink = ({ user, variant }) => {
  const { createLinkToken, exchangePublicToken } = useBankAccountStore();  // Destructure from useBankAccountStore
  const [token, setToken] = useState('');

  useEffect(() => {
    const getLinkToken = async () => {
      // Use the store's method to fetch the link token
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };

    if (user) {
      getLinkToken();
    }
  }, [user, createLinkToken]);

  const onSuccess = useCallback(async (public_token) => {
    // Use the store's method to exchange the public token
    await exchangePublicToken({
      publicToken: public_token,
      user,
    });
    // Handle redirect or state update after successful token exchange
    window.location.href = '/';  // Adjust as needed for your redirect flow
  }, [user, exchangePublicToken]);

  const config = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === 'primary' ? (
        <button
          onClick={() => open()}
          disabled={!ready}
          className="bg-blue-600 text-white py-2 px-4 rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none"
        >
          Connect bank
        </button>
      ) : variant === 'ghost' ? (
        <button
          onClick={() => open()}
          className="flex items-center py-2 px-4 border border-gray-300 rounded-md text-lg font-semibold hover:bg-gray-100 focus:outline-none"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
            className="mr-2"
          />
          <span className="hidden xl:block text-black">Connect bank</span>
        </button>
      ) : (
        <button
          onClick={() => open()}
          className="flex items-center py-2 px-4 border border-gray-300 rounded-md text-lg font-semibold hover:bg-gray-100 focus:outline-none"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
            className="mr-2"
          />
          <span className="text-black">Connect bank</span>
        </button>
      )}
    </>
  );
};

export default PlaidLink;
