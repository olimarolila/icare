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
        'location_name',
        'latitude',
        'longitude',
        'subject',
        'status',
        'description',
        'images',
        'user_id',
        'submitted_at',
        'votes',
    ];

    protected $casts = [
        'images' => 'array',
        'submitted_at' => 'datetime',
        'user_vote' => 'integer',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function votes()
    {
        return $this->hasMany(ReportVote::class);
    }
}
