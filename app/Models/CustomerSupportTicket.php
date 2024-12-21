<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerSupportTicket extends Model
{
    use HasFactory;

    protected $table = 'customer_support_tickets'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Indicates if the model should manage created_at and updated_at timestamps

    protected $fillable = [
        'user_id', 'issue_type', 'description', 'status', 'assigned_to', 'answer'
    ];

    // Define the relationship to the User model (user who created the ticket)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Define the relationship to the User model (user who is assigned the ticket)
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
