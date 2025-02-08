<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;  // Use Authenticatable
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Correct namespace for HasFactory

class User extends Authenticatable  // Extend Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $table = 'users';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'ip_address',
        'email',
        'password',
        'two_factor_enabled',
        'last_login',
        'language',
        'is_admin',
        'last_password_change',
        'profile_picture',
        'banner_img',
        'headline',
        'about',
    ];

    protected $casts = [
        'two_factor_enabled' => 'boolean',
        'is_admin' => 'boolean',
        'last_login' => 'datetime',
        'last_password_change' => 'datetime',
    ];

    // Relationships and other methods as usual
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'users_roles', 'users_id', 'roles_id');
    }

    // User can have many orders
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function coupons()
    {
        return $this->belongsToMany(Coupon::class, 'users_coupons', 'users_id', 'coupons_id')->withTimestamps();
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class, 'users_id');
    }

    public function primaryAddress()
    {
        // Corrected: Return a relationship instance
        return $this->hasOne(UserAddress::class, 'users_id')->where('is_primary', true);
    }


    // Get the user's primary address as a concatenated string
    public function getPrimaryAddress()
    {
        $address = $this->primaryAddress;

        if ($address) {
            // Combine the address components into a single string
            $addressString = $address->address_line1;

            if ($address->address_line2) {
                $addressString .= ', ' . $address->address_line2;
            }

            $addressString .= ', ' . $address->city;
            $addressString .= ', ' . $address->state;
            $addressString .= ' ' . $address->postal_code;
            $addressString .= ', ' . $address->country;

            return $addressString; // Return the combined address string
        }

        return null;  // No address found
    }

    // Define relationships
    public function posts()
    {
        return $this->hasMany(Post::class, 'author_id'); // Posts authored by this user
    }

    // Define a relationship for connections
    public function connections()
    {
        return $this->hasMany(UserConnection::class, 'user_id');
    }

    // Define a relationship for connected users
    public function connectedUsers()
    {
        return $this->belongsToMany(User::class, 'user_connections', 'user_id', 'connection_id');
    }

    // Add a connection
    public function addConnection($userId)
    {
        if (!$this->connectedUsers()->where('connection_id', $userId)->exists()) {
            $this->connectedUsers()->attach($userId); // Use the relationship to attach
        }
    }

    // Remove a connection
    public function removeConnection($userId)
    {
        if ($this->connectedUsers()->where('connection_id', $userId)->exists()) {
            $this->connectedUsers()->detach($userId); // Use the relationship to detach
        }
    }

    // Get all connections
    public function getConnections()
    {
        return $this->connectedUsers; // Returns a collection of connected User models
    }


    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_users');
    }

    public static function getUsersExceptUser(User $user)
    {
        $userId = $user->id;
        $query = User::select(['users.*', 
                            'messages.message as last_message', 
                            'messages.created_at as last_message_date'])
                    ->where('users.id', '!=', $userId)
                    ->leftJoin('conversations', function ($join) use ($userId) {
                        $join->on('conversations.user_id1', '=', 'users.id')
                            ->where('conversations.user_id2', '=', $userId)
                            ->orWhere(function ($query) use ($userId) {
                                $query->on('conversations.user_id2', '=', 'users.id')
                                    ->where('conversations.user_id1', '=', $userId);
                            });
                    })
                    ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
                    ->orderByRaw('CONCAT(users.first_name, " ", users.last_name)')  // Correct order by name concatenation
                    ->orderByDesc('messages.created_at')  // Ensure we order by the most recent message
        ;

        return $query->get();
    }

    public function toConversationArray()
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,  // Added value for first_name
            'last_name' => $this->last_name,    // Added value for last_name
            'phone_number' => $this->phone_number, // Added value for phone_number
            'ip_address' => $this->ip_address,   // Added value for ip_address
            'email' => $this->email,             // Added value for email
            'language' => $this->language,       // Added value for language
            'profile_picture' => $this->profile_picture,  // Added value for profile_picture
            'banner_img' => $this->banner_img,   // Added value for banner_img
            'headline' => $this->headline,       // Added value for headline
            'about' => $this->about,             // Added value for about
            'is_group' => false,                 // Assuming this is always false
            'is_user' => true,                   // Assuming this is always true
            'created_at' => $this->created_at,   // Added value for created_at
            'updated_at' => $this->updated_at,   // Added value for updated_at
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date ? \Carbon\Carbon::parse($this->last_message_date)->toDateTimeString() : null, // Format date properly
        ];
    }

}
