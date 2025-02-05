import { useState, useEffect } from "react";
import PublicQuestionView from "../../components/FeedBackForm/PublicQuestionView";
import { useFeedbackFormStore } from "../../stores/useFeedbackFormStore";

export default function FeedbackFormPublicView({ currentFeedbackForm, continueIndex }) {
  const { submitFeedbackForm, isLoadingForm, isError, errorMessage } = useFeedbackFormStore();
  const [answers, setAnswers] = useState({});
  const [feedbackFormFinished, setFeedbackFormFinished] = useState(false);
  console.log(currentFeedbackForm.id);
  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const success = await submitFeedbackForm(currentFeedbackForm.id, answers);
    if (success) {
      setFeedbackFormFinished(true);
      continueIndex((prev) => prev+1)
    }
  };

  if (isLoadingForm) return <div className="flex justify-center text-lg text-emerald-400">Loading...</div>;
  if (isError) return <div className="text-center text-lg text-red-500">{errorMessage}</div>;

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-transparent border-2 border-white text-emerald-400 shadow-md rounded-lg p-6">
        {feedbackFormFinished && (
          <div className="py-4 px-4 text-emerald-400">
            Thank you for submitting the feedback form!
          </div>
        )}

        {!feedbackFormFinished && currentFeedbackForm && (
          <>
            <h2 className="text-lg font-semibold mb-4 text-emerald-400">Questions</h2>
            {currentFeedbackForm.questions.map((question, index) => (
              <PublicQuestionView
                key={question.id}
                question={question}
                index={index}
                answerChanged={(val) => handleAnswerChange(question.id, val)}
              />
            ))}
            <button
              type="submit"
              className="mt-4 inline-flex justify-center py-2 px-4 border-2 border-white text-emerald-400 font-medium rounded-md hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-200"
            >
              Submit
            </button>
          </>
        )}
      </form>
    </div>
  );
}
