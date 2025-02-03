<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log; // Ensure you include this at the top of your file
use App\Enums\QuestionTypeEnum;
use App\Http\Requests\StoreFeedbackFormAnswerRequest;
use App\Http\Resources\FeedbackFormResource;
use App\Models\FeedbackForm;
use App\Http\Requests\StoreFeedbackFormRequest;
use App\Http\Requests\UpdateFeedbackFormRequest;
use App\Models\FeedbackFormAnswer;
use App\Models\FeedbackFormQuestion;
use App\Models\FeedbackFormQuestionAnswer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Request;

class FeedbackFormController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = FeedbackForm::query();

        // Check if there's a search term in the request
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;

            // Filter by title or description
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Check if there's a sort order in the request
        if ($request->has('sort') && $request->sort === 'latest') {
            $query->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'asc'); // Default sort order (optional)
        }

        // Paginate the results
        return FeedbackFormResource::collection(
            $query->paginate(6)
        );
    }


    public function userFeedbackForm(Request $request)
    {
        $user = $request->user();

        return FeedbackFormResource::collection(
            FeedbackForm::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(6)
        );
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreFeedbackFormRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreFeedbackFormRequest $request)
    {
        $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        $feedbackForm = FeedbackForm::create($data);

        // Create new questions
        foreach ($data['questions'] as $question) {
            $question['feedbackform_id'] = $feedbackForm->id;
            $this->createQuestion($question);
        }

        return new FeedbackFormResource($feedbackForm);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\FeedbackForm  $feedbackForm
     * @return \Illuminate\Http\Response
     */
    public function show(FeedbackForm $feedbackForm, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $feedbackForm->user_id) {
            return abort(403, 'Unauthorized action');
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
    public function update(UpdateFeedbackFormRequest $request, FeedbackForm $feedbackForm)
    {
        $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            // If there is an old image, delete it
            if ($feedbackForm->image) {
                $absolutePath = public_path($feedbackForm->image);
                File::delete($absolutePath);
            }
        }

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
                $question['feedbackform_id'] = $feedbackForm->id;
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
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\FeedbackForm  $feedbackForm
     * @return \Illuminate\Http\Response
     */
    public function destroy(FeedbackForm $feedbackForm, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $feedbackForm->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $feedbackForm->delete();

        // If there is an old image, delete it
        if ($feedbackForm->image) {
            $absolutePath = public_path($feedbackForm->image);
            File::delete($absolutePath);
        }

        return response('', 204);
    }


    /**
     * Save image in local file system and return saved image path
     *
     * @param $image
     * @throws \Exception
     * @author Zura Sekhniashvili <zurasekhniashvili@gmail.com>
     */
    private function saveImage($image)
    {
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // Take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // Get file extension
            $type = strtolower($type[1]); // jpg, png, gif

            // Check if file is an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
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
            'feedbackform_id' => 'exists:App\Models\FeedbackForm,id'
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

    public function getBySlug(FeedbackForm $feedbackForm)
    {
        if (!$feedbackForm->status) {
            return response("", 404);
        }

        $currentDate = new \DateTime();
        $expireDate = new \DateTime($feedbackForm->expire_date);
        if ($currentDate > $expireDate) {
            return response("", 404);
        }

        return new FeedbackFormResource($feedbackForm);
    }

    public function storeAnswer(StoreFeedbackFormAnswerRequest $request, FeedbackForm $feedbackForm)
    {
        $validated = $request->validated();

        $feedbackFormAnswer = FeedbackFormAnswer::create([
            'feedbackform_id' => $feedbackForm->id,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s'),
        ]);

        foreach ($validated['answers'] as $questionId => $answer) {
            $question = FeedbackFormQuestion::where(['id' => $questionId, 'feedbackform_id' => $feedbackForm->id])->get();
            if (!$question) {
                return response("Invalid question ID: \"$questionId\"", 400);
            }

            $data = [
                'feedbackform_question_id' => $questionId,
                'feedbackform_answer_id' => $feedbackFormAnswer->id,
                'answer' => is_array($answer) ? json_encode($answer) : $answer
            ];

            $questionAnswer = FeedbackFormQuestionAnswer::create($data);
        }

        return response("", 201);
    }
}
