import { useState } from 'react';
import { useTwoFactorAuthenticationStore } from '../stores/useTwoFactorAuthenticationStore';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const TwoFactorAuthentication = () => {
  const { sendTwoFactorCode, verifyTwoFactorCode, sendLoading, verifyLoading, sendError, verifyError, is2FAComplete } = useTwoFactorAuthenticationStore();
  const { user } = useUserStore();
  
  const [code, setCode] = useState(''); // Store entered 2FA code for verification
  const [isCodeSent, setIsCodeSent] = useState(false); // Track if the code has been sent

  const navigate = useNavigate();  // Initialize useNavigate to redirect

  const handleSendCode = async () => {
    if (!user.phone_number) {
      alert('Phone number is not provided.');
      return;
    }
    
    // Call the function to send 2FA code
    await sendTwoFactorCode(user.phone_number);
    setIsCodeSent(true); // Set flag to show the verification input after the code is sent
  };

  const handleVerifyCode = () => {
    if (!code) {
      alert('Please enter the 2FA code.');
      return;
    }
    verifyTwoFactorCode(code);
  };

  // Redirect to the home page after 2FA is verified
  if (is2FAComplete) {
    navigate('/');  // Redirect to home page
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-transparent border-2 border-white rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-emerald-400">Two-Factor Authentication</h2>
      
      {!isCodeSent ? (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg font-medium text-emerald-400">Phone Number: <span className="font-bold">{user.phone_number}</span></p>
          <button
            onClick={handleSendCode}
            disabled={sendLoading}
            className={`px-6 py-2 rounded-md text-emerald-400 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${sendLoading ? 'bg-transparent' : 'bg-transparent hover:bg-emerald-400'}`}
          >
            {sendLoading ? 'Sending...' : 'Send 2FA Code'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the 2FA code"
            disabled={verifyLoading}
            className="w-full p-3 rounded-md border-2 border-white text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            onClick={handleVerifyCode}
            disabled={verifyLoading}
            className={`px-6 py-2 rounded-md text-emerald-400 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${verifyLoading ? 'bg-transparent' : 'bg-transparent hover:bg-emerald-400'}`}
          >
            {verifyLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
      )}

      {/* Error messages */}
      {sendError && <p className="mt-4 text-red-600 text-center">{sendError}</p>}
      {verifyError && <p className="mt-4 text-red-600 text-center">{verifyError}</p>}
    </div>
  );
};

export default TwoFactorAuthentication;
