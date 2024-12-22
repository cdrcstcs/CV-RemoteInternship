<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RolePermission extends Model
{
    use HasFactory;
    // Since this is a pivot table, we don’t need timestamps.
    public $timestamps = false;

    // Define the table name (optional, can be inferred by Laravel).
    protected $table = 'roles_permissions';

    // Define the composite primary key (Laravel doesn’t natively support composite keys).
    protected $primaryKey = ['permissions_id', 'roles_id'];

    // Disable auto-incrementing, as this table doesn't have an auto-incrementing primary key.
    public $incrementing = false;

    // You can define fillable attributes here if needed.
    protected $fillable = ['permissions_id', 'roles_id'];
}
