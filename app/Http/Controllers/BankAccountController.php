<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bank;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Exception;

class BankAccountController extends Controller
{
    // Create a link token using Plaid
    public function createLinkToken(Request $request)
    {
        try {
            $tokenParams = [
                'user' => ['client_user_id' => $request->user()->id],
                'client_name' => $request->user()->first_name . ' ' . $request->user()->last_name,
                'products' => ['auth'],
                'language' => 'en',
                'country_codes' => ['US'],
            ];

            $response = Http::withHeaders([
                'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                'PLAID-SECRET' => env('PLAID_SECRET'),
            ])->post('https://sandbox.plaid.com/link/token/create', $tokenParams);

            $data = $response->json();
            return response()->json(['linkToken' => $data['link_token']]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to create link token'], 500);
        }
    }

    // Exchange public token for access token
    public function exchangePublicToken(Request $request)
    {
        try {
            $publicToken = $request->input('publicToken');
            $response = Http::withHeaders([
                'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                'PLAID-SECRET' => env('PLAID_SECRET'),
            ])->post('https://sandbox.plaid.com/item/public_token/exchange', [
                'public_token' => $publicToken
            ]);

            $data = $response->json();
            $accessToken = $data['access_token'];
            $itemId = $data['item_id'];

            // Get account details from Plaid
            $accountsResponse = Http::withHeaders([
                'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                'PLAID-SECRET' => env('PLAID_SECRET'),
            ])->post('https://sandbox.plaid.com/accounts/get', [
                'access_token' => $accessToken
            ]);

            $accountData = $accountsResponse->json()['accounts'][0];

            // Create a processor token for Dwolla
            $processorTokenResponse = Http::withHeaders([
                'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                'PLAID-SECRET' => env('PLAID_SECRET'),
            ])->post('https://sandbox.plaid.com/processor/token/create', [
                'access_token' => $accessToken,
                'account_id' => $accountData['account_id'],
                'processor' => 'dwolla',
            ]);

            $processorToken = $processorTokenResponse->json()['processor_token'];

            // Create a Dwolla funding source
            $fundingSourceUrl = $this->createDwollaFundingSource($request->user(), $processorToken, $accountData['name']);

            if (!$fundingSourceUrl) {
                throw new Exception('Unable to create funding source');
            }

            // Store bank account information in the database
            $bank = Bank::create([
                'user_id' => $request->user()->id,
                'bank_id' => $itemId,
                'account_id' => $accountData['account_id'],
                'access_token' => $accessToken,
                'funding_source_url' => $fundingSourceUrl,
                'shareable_id' => encrypt($accountData['account_id']),
            ]);

            return response()->json(['message' => 'Public token exchange complete']);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred during token exchange'], 500);
        }
    }

    // Add Dwolla funding source
    private function createDwollaFundingSource($user, $processorToken, $bankName)
    {
        try {
            // Create a Dwolla funding source using an API request
            $dwollaAuthResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $user->dwollaAccessToken, // Assuming user has a Dwolla access token
            ])->post('https://api.dwolla.com/on-demand-authorizations', [
                // Required parameters for on-demand authorization (this may vary depending on Dwolla's API)
            ]);

            $dwollaAuthLinks = $dwollaAuthResponse->json()['_links'];
            $fundingSourceOptions = [
                'customerId' => $user->dwollaCustomerId,
                'fundingSourceName' => $bankName,
                'plaidToken' => $processorToken,
                '_links' => $dwollaAuthLinks,
            ];

            // Create funding source
            $fundingSourceResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $user->dwollaAccessToken,
            ])->post("https://api.dwolla.com/customers/{$user->dwollaCustomerId}/funding-sources", $fundingSourceOptions);

            return $fundingSourceResponse->headers()['location'] ?? null;
        } catch (Exception $e) {
            return null;
        }
    }

    // Get user's bank accounts
    public function getBanks(Request $request)
    {
        try {
            $banks = Bank::where('user_id', $request->user()->id)->get();

            return response()->json($banks);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to fetch banks'], 500);
        }
    }

    // Create a transaction in the database
    public function createTransaction(Request $request)
    {
        try {
            $transactionData = $request->only(['senderBankId', 'receiverBankId', 'amount', 'name', 'category', 'channel']);
            $transaction = Transaction::create($transactionData);

            return response()->json($transaction);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to create transaction'], 500);
        }
    }

    // Get transactions by bank ID
    public function getTransactionsByBankId(Request $request, $bankId)
    {
        try {
            $transactions = Transaction::where('senderBankId', $bankId)
                ->orWhere('receiverBankId', $bankId)
                ->get();

            return response()->json($transactions);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to fetch transactions'], 500);
        }
    }

    // Create a bank account
    public function createBankAccount(Request $request)
    {
        try {
            $userId = $request->user()->id;
            $bankId = $request->input('bankId');
            $accountId = $request->input('accountId');
            $accessToken = $request->input('accessToken');
            $fundingSourceUrl = $request->input('fundingSourceUrl');
            $shareableId = $request->input('shareableId');
            
            $bank = Bank::create([
                'user_id' => $userId,
                'bank_id' => $bankId,
                'account_id' => $accountId,
                'access_token' => $accessToken,
                'funding_source_url' => $fundingSourceUrl,
                'shareable_id' => $shareableId,
            ]);

            return response()->json(['message' => 'Bank account created successfully', 'bank' => $bank]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to create bank account'], 500);
        }
    }

    // Get bank by account ID
    public function getBankByAccountId(Request $request, $accountId)
    {
        try {
            $bank = Bank::where('account_id', $accountId)->first();

            if (!$bank) {
                return response()->json(['error' => 'Bank not found'], 404);
            }

            return response()->json($bank);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to fetch bank details'], 500);
        }
    }

    // Create on-demand authorization (Dwolla)
    public function createOnDemandAuthorization(Request $request)
    {
        try {
            // Create an on-demand authorization link with Dwolla
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $request->user()->dwollaAccessToken,
            ])->post('https://api.dwolla.com/on-demand-authorizations');

            $data = $response->json();
            return response()->json(['authLink' => $data['_links']]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to create on-demand authorization'], 500);
        }
    }

    // Create transfer using Dwolla API
    public function createTransfer(Request $request)
    {
        try {
            $sourceFundingSourceUrl = $request->input('sourceFundingSourceUrl');
            $destinationFundingSourceUrl = $request->input('destinationFundingSourceUrl');
            $amount = $request->input('amount');

            $requestBody = [
                '_links' => [
                    'source' => ['href' => $sourceFundingSourceUrl],
                    'destination' => ['href' => $destinationFundingSourceUrl],
                ],
                'amount' => [
                    'currency' => 'USD',
                    'value' => $amount,
                ]
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $request->user()->dwollaAccessToken,
            ])->post('https://api.dwolla.com/transfers', $requestBody);

            return response()->json(['transferLocation' => $response->header('Location')]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to create transfer'], 500);
        }
    }

    // Add Dwolla funding source
    public function addFundingSource(Request $request)
    {
        try {
            $dwollaCustomerId = $request->input('dwollaCustomerId');
            $processorToken = $request->input('processorToken');
            $bankName = $request->input('bankName');

            $dwollaAuthResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $request->user()->dwollaAccessToken,
            ])->post('https://api.dwolla.com/on-demand-authorizations');

            $dwollaAuthLinks = $dwollaAuthResponse->json()['_links'];

            $fundingSourceOptions = [
                'customerId' => $dwollaCustomerId,
                'fundingSourceName' => $bankName,
                'plaidToken' => $processorToken,
                '_links' => $dwollaAuthLinks,
            ];

            // Create funding source with Dwolla
            $fundingSourceResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $request->user()->dwollaAccessToken,
            ])->post("https://api.dwolla.com/customers/{$dwollaCustomerId}/funding-sources", $fundingSourceOptions);

            return response()->json(['fundingSourceUrl' => $fundingSourceResponse->header('Location')]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to add funding source'], 500);
        }
    }

    // Get user's bank accounts from database
    public function getAccounts(Request $request)
    {
        try {
            // Fetch banks for the user from the database
            $banks = Bank::where('user_id', $request->user()->id)->get();

            $accounts = [];

            foreach ($banks as $bank) {
                // Fetch account details from Plaid
                $response = Http::withHeaders([
                    'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                    'PLAID-SECRET' => env('PLAID_SECRET'),
                ])->post('https://sandbox.plaid.com/accounts/get', [
                    'access_token' => $bank->access_token,
                ]);

                $accountData = $response->json()['accounts'][0];

                // Fetch institution details
                $institutionResponse = Http::withHeaders([
                    'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                    'PLAID-SECRET' => env('PLAID_SECRET'),
                ])->post('https://sandbox.plaid.com/institutions/get_by_id', [
                    'institution_id' => $response->json()['item']['institution_id'],
                    'country_codes' => ['US'],
                ]);

                $accounts[] = [
                    'account_id' => $accountData['account_id'],
                    'institution' => $institutionResponse->json(),
                    'available_balance' => $accountData['balances']['available'],
                    'current_balance' => $accountData['balances']['current'],
                    'name' => $accountData['name'],
                    'type' => $accountData['type'],
                    'subtype' => $accountData['subtype'],
                ];
            }

            return response()->json(['accounts' => $accounts]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unable to fetch accounts'], 500);
        }
    }

    public function createDwollaCustomer($newCustomer)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('DWOLLA_ACCESS_TOKEN'),
            ])->post('https://api.dwolla.com/customers', $newCustomer);

            $location = $response->headers()['location'][0];

            return $location;
        } catch (\Exception $e) {
            \Log::error('Creating a Dwolla Customer Failed: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Creating a Dwolla Customer Failed'], 500);
        }
    }
    public function createFundingSource($options)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('DWOLLA_ACCESS_TOKEN'),
            ])->post("https://api.dwolla.com/customers/{$options['customerId']}/funding-sources", [
                'name' => $options['fundingSourceName'],
                'plaidToken' => $options['plaidToken'],
            ]);
    
            $location = $response->headers()['location'][0];
    
            return $location;
        } catch (\Exception $e) {
            \Log::error('Creating a Funding Source Failed: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Creating a Funding Source Failed'], 500);
        }
    }
    public function getAccount($appwriteItemId)
    {
        try {
            // Get bank from database
            $bank = Bank::findOrFail($appwriteItemId);
    
            // Get account info from Plaid
            $response = Http::withHeaders([
                'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                'PLAID-SECRET' => env('PLAID_SECRET'),
            ])->post('https://sandbox.plaid.com/accounts/get', [
                'access_token' => $bank->access_token,
            ]);
            $accountData = $response->json()['accounts'][0];
    
            // Get transaction data from Appwrite
            $transactions = $this->getTransactionsByBankId($bank->id);
    
            // Get institution info from Plaid
            $institutionResponse = Http::withHeaders([
                'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                'PLAID-SECRET' => env('PLAID_SECRET'),
            ])->post('https://sandbox.plaid.com/institutions/get_by_id', [
                'institution_id' => $response->json()['item']['institution_id'],
                'country_codes' => ['US'],
            ]);
            $institution = $institutionResponse->json();
    
            // Return account data and sorted transactions
            return response()->json([
                'account' => $accountData,
                'institution' => $institution,
                'transactions' => $transactions
            ]);
        } catch (\Exception $e) {
            \Log::error('An error occurred while getting the account: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to get account information'], 500);
        }
    }
    public function getInstitution($institutionId)
    {
        try {
            $response = Http::withHeaders([
                'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                'PLAID-SECRET' => env('PLAID_SECRET'),
            ])->post('https://sandbox.plaid.com/institutions/get_by_id', [
                'institution_id' => $institutionId,
                'country_codes' => ['US'],
            ]);
            return response()->json($response->json());
        } catch (\Exception $e) {
            \Log::error('An error occurred while getting institution info: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to fetch institution information'], 500);
        }
    }
    public function getTransactions($accessToken)
    {
        try {
            $hasMore = true;
            $transactions = [];
    
            while ($hasMore) {
                $response = Http::withHeaders([
                    'PLAID-CLIENT-ID' => env('PLAID_CLIENT_ID'),
                    'PLAID-SECRET' => env('PLAID_SECRET'),
                ])->post('https://sandbox.plaid.com/transactions/sync', [
                    'access_token' => $accessToken,
                ]);
    
                $data = $response->json();
    
                foreach ($data['added'] as $transaction) {
                    $transactions[] = [
                        'id' => $transaction['transaction_id'],
                        'name' => $transaction['name'],
                        'paymentChannel' => $transaction['payment_channel'],
                        'type' => $transaction['payment_channel'],
                        'amount' => $transaction['amount'],
                        'category' => $transaction['category'][0] ?? '',
                        'date' => $transaction['date'],
                        'image' => $transaction['logo_url'],
                    ];
                }
    
                $hasMore = $data['has_more'];
            }
    
            return response()->json($transactions);
        } catch (\Exception $e) {
            \Log::error('An error occurred while getting transactions: ', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to fetch transactions'], 500);
        }
    }
                    
}
