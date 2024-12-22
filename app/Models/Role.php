<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles'; // Table name

    protected $primaryKey = 'id'; // Primary key column

    public $timestamps = true; // Laravel will automatically manage the 'created_at' and 'updated_at' columns

    protected $fillable = [
        'role_name', 'description'
    ];

    // Define relationships (if needed)
    public function users()
    {
        return $this->belongsToMany(User::class, 'users_roles', 'roles_id', 'users_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'roles_permissions', 'roles_id', 'permissions_id');
    }
}
