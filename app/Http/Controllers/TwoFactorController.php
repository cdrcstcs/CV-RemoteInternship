<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class TwoFactorController extends Controller
{
    public function sendCode(Request $request)
    {
        // Use request()->user() to get the logged-in user
        $user = $request->user();

        // Check if the user has a phone number
        if (!$user->phone_number) {
            return response()->json(['message' => 'Phone number is not set.'], 400);
        }

        // Send the 2FA code to the user's phone number
        $user->sendTwoFactorCode();

        return response()->json(['message' => 'Verification code sent to your phone.']);
    }

    public function verifyCode(Request $request)
    {
        // Validate the incoming request to ensure the code is numeric and 6 digits long
        $request->validate([
            'code' => 'required|numeric|digits:6',
        ]);

        // Use request()->user() to get the logged-in user
        $user = $request->user();
        $code = $request->input('code');

        // Verify the entered code
        if ($user->verifyTwoFactorCode($code)) {
            return response()->json(['message' => 'Code verified successfully.']);
        }

        return response()->json(['message' => 'Invalid or expired code.'], 400);
    }
}
