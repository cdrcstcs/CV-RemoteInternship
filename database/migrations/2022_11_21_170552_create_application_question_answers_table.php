<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('feedback_form_question_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\FeedbackFormQuestion::class, 'feedbackform_question_id');
            $table->foreignIdFor(\App\Models\FeedbackFormAnswer::class, 'feedbackform_answer_id');
            $table->text('answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('feedback_form_question_answers');
    }
};
