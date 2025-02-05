import { useState } from "react";
import { useFeedbackFormStore } from "../../stores/useFeedbackFormStore.js";
import FeedbackFormQuestions from "../../components/FeedBackForm/FeedbackFormQuestions.jsx";
import { v4 as uuidv4 } from "uuid";

export default function CreateFeedbackForm() {
  const { createFeedbackForm, isLoadingForm, errorMessage } = useFeedbackFormStore();  // Using Zustand for state management
  const [feedbackForm, setFeedbackForm] = useState({
    questions: [],
  });
  const [error, setError] = useState("");

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const payload = { ...feedbackForm };

    try {
      await createFeedbackForm(payload);  // Use the Zustand store to create the feedback form
      setFeedbackForm({ questions: [] });  // Reset the form after successful creation
    } catch (err) {
      setError(errorMessage || "An error occurred while creating the feedback form.");
    }
  };

  const onQuestionsUpdate = (questions) => {
    setFeedbackForm({
      ...feedbackForm,
      questions,
    });
  };

  const addQuestion = () => {
    feedbackForm.questions.push({
      id: uuidv4(),
      type: "text",
      question: "",
      description: "",
      data: {},
    });
    setFeedbackForm({ ...feedbackForm });
  };

  return (
    <>
      {isLoadingForm && <div className="text-center text-lg text-emerald-400">Submitting...</div>}
      <form action="#" method="POST" onSubmit={onSubmit}>
        <div className="shadow sm:overflow-hidden sm:rounded-md border-2 border-white">
          <div className="space-y-6 px-4 py-5 sm:p-6">
            {error && (
              <div className="bg-none text-emerald-400 py-3 px-3 border-2 border-white">{error}</div>
            )}
            {errorMessage && (
              <div className="bg-none text-emerald-400 py-3 px-3 border-2 border-white">{errorMessage}</div>
            )}

            <button 
              type="button" 
              onClick={addQuestion} 
              className="text-emerald-400 border-2 border-white py-2 px-4 rounded"
            >
              Add question
            </button>
            <FeedbackFormQuestions
              questions={feedbackForm.questions}
              onQuestionsUpdate={onQuestionsUpdate}
            />
          </div>
          <div className="bg-none px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border-2 border-white text-sm font-medium rounded-md text-emerald-400 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
