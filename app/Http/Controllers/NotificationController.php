<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function getUserNotifications(Request $request)
    {
        try {
            $notifications = Notification::where('recipient_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->with(['relatedUser:id,name,username,profile_picture', 'relatedPost:id,content,image'])
                ->get();

            return response()->json($notifications, 200);
        } catch (\Exception $error) {
            \Log::error("Error in getUserNotifications controller: ", ['error' => $error]);
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }

    public function markNotificationAsRead(Request $request, $id)
    {
        try {
            $notification = Notification::where('id', $id)
                ->where('recipient_id', $request->user()->id)
                ->firstOrFail();

            $notification->read = true;
            $notification->save();

            return response()->json($notification);
        } catch (\Exception $error) {
            \Log::error("Error in markNotificationAsRead controller: ", ['error' => $error]);
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }

    public function deleteNotification(Request $request, $id)
    {
        try {
            $notification = Notification::where('id', $id)
                ->where('recipient_id', $request->user()->id)
                ->firstOrFail();

            $notification->delete();

            return response()->json(['message' => 'Notification deleted successfully']);
        } catch (\Exception $error) {
            \Log::error("Error in deleteNotification controller: ", ['error' => $error]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }
}
