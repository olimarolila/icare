<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'category',
        'street',
        'subject',
        'status',
        'description',
        'images',
        'user_id',
        'submitted_at',
    ];

    protected $casts = [
        'images' => 'array',
        'submitted_at' => 'datetime',
    ];
}
