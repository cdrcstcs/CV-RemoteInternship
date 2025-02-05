<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log; // Ensure you include this at the top of your file
use App\Enums\QuestionTypeEnum;
use App\Http\Requests\StoreFeedbackFormAnswerRequest;
use App\Http\Resources\FeedbackFormResource;
use App\Models\FeedbackForm;
use App\Models\Order;
use App\Http\Requests\StoreFeedbackFormRequest;
use App\Http\Requests\UpdateFeedbackFormRequest;
use App\Models\FeedbackFormAnswer;
use App\Models\FeedbackFormQuestion;
use App\Models\FeedbackFormQuestionAnswer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Request;

class FeedbackFormController extends Controller
{

    public function getOrderWithFeedbackForms($orderId)
    {
        // Fetch all feedback forms associated with the order
        $feedbackForms = FeedbackForm::where('order_id', $orderId)->get(); // Use get() to retrieve all feedback forms
        Log::info('Feedback Forms Fetched', ['feedback forms' => $feedbackForms->toArray()]);

        if ($feedbackForms->isEmpty()) {
            return response()->json([
                'message' => 'No feedback forms found for this order'
            ], 404);
        }

        // Return the order details along with the feedback forms as a resource collection
        return response()->json([
            'feedback_forms' => FeedbackFormResource::collection($feedbackForms) // Return a collection of feedback forms
        ]);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreFeedbackFormRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function storeFeedbackForm(StoreFeedbackFormRequest $request)
    {
        $data = $request->validated();

        $feedbackForm = FeedbackForm::create($data);

        // Create new questions
        foreach ($data['questions'] as $question) {
            $question['feedback_form_id'] = $feedbackForm->id;
            $this->createQuestion($question);
        }

        return new FeedbackFormResource($feedbackForm);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateFeedbackFormRequest  $request
     * @param  \App\Models\FeedbackForm  $feedbackForm
     * @return \Illuminate\Http\Response
     */
    public function updateFeedbackForm(UpdateFeedbackFormRequest $request, FeedbackForm $feedbackForm)
    {
        $data = $request->validated();

        // Update FeedbackForm in the database
        $feedbackForm->update($data);

        // Get ids as plain array of existing questions
        $existingIds = $feedbackForm->questions()->pluck('id')->toArray();
        // Get ids as plain array of new questions
        $newIds = Arr::pluck($data['questions'], 'id');
        // Find questions to delete
        $toDelete = array_diff($existingIds, $newIds);
        //Find questions to add
        $toAdd = array_diff($newIds, $existingIds);

        // Delete questions by $toDelete array
        FeedbackFormQuestion::destroy($toDelete);

        // Create new questions
        foreach ($data['questions'] as $question) {
            if (in_array($question['id'], $toAdd)) {
                $question['feedback_form_id'] = $feedbackForm->id;
                $this->createQuestion($question);
            }
        }

        // Update existing questions
        $questionMap = collect($data['questions'])->keyBy('id');
        foreach ($feedbackForm->questions as $question) {
            if (isset($questionMap[$question->id])) {
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }

        return new FeedbackFormResource($feedbackForm);
    }

    /**
     * Create a question and return
     *
     * @param $data
     * @return mixed
     * @throws \Illuminate\Validation\ValidationException
     * @author Zura Sekhniashvili <zurasekhniashvili@gmail.com>
     */
    private function createQuestion($data)
    {
        Log::info('Creating question with data:', $data);

        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }

        Log::info('Creating question with data:', $data);


        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type' => 'required|in:' . implode(',', QuestionTypeEnum::getValues()),
            'description' => 'nullable|string',
            'data' => 'present',
            'feedback_form_id' => 'exists:App\Models\FeedbackForm,id'
        ]);

        return FeedbackFormQuestion::create($validator->validated());
    }

    /**
     * Update a question and return true or false
     *
     * @param \App\Models\FeedbackFormQuestion $question
     * @param                            $data
     * @return bool
     * @throws \Illuminate\Validation\ValidationException
     * @author Zura Sekhniashvili <zurasekhniashvili@gmail.com>
     */
    private function updateQuestion(FeedbackFormQuestion $question, $data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\FeedbackFormQuestion,id',
            'question' => 'required|string',
            'type' => 'required|in:' . implode(',', QuestionTypeEnum::getValues()),
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        return $question->update($validator->validated());
    }

    public function storeAnswer(StoreFeedbackFormAnswerRequest $request, $id)
    {
        $validated = $request->validated();

        $feedbackFormAnswer = FeedbackFormAnswer::create([
            'feedback_form_id' => $id,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s'),
        ]);

        foreach ($validated['answers'] as $questionId => $answer) {
            $question = FeedbackFormQuestion::where(['id' => $questionId, 'feedback_form_id' => $id])->get();
            if (!$question) {
                return response("Invalid question ID: \"$questionId\"", 400);
            }

            $data = [
                'feedback_form_question_id' => $questionId,
                'feedback_form_answer_id' => $feedbackFormAnswer->id,
                'answer' => is_array($answer) ? json_encode($answer) : $answer
            ];

            $questionAnswer = FeedbackFormQuestionAnswer::create($data);
        }

        return response("", 201);
    }
}
