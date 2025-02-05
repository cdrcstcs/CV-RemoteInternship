export default function PublicQuestionView({
  question,
  index,
  answerChanged,
}) {
  let selectedOptions = [];

  function onCheckboxChange(option, $event) {
    if ($event.target.checked) {
      selectedOptions.push(option.text);
    } else {
      selectedOptions = selectedOptions.filter(op => op !== option.text);
    }
    answerChanged(selectedOptions);
  }

  console.log(question);
  return (
    <>
      <fieldset className="mb-6 border-2 border-white text-emerald-400 p-6 rounded-lg">
        <div>
          <legend className="text-base font-medium text-emerald-400">
            {index + 1}. {question.question}
          </legend>
          <p className="text-sm text-emerald-400">{question.description}</p>
        </div>

        <div className="mt-4">
          {question.type === "select" && (
            <div>
              <select
                onChange={(ev) => answerChanged(ev.target.value)}
                className="mt-2 block w-full py-3 px-4 border-2 border-white text-emerald-400 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="">Please Select</option>
                {question.data.options.map((option) => (
                  <option key={option.uuid} value={option.text}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          )}
          {question.type === "radio" && (
            <div>
              {question.data.options.map((option) => (
                <div key={option.uuid} className="flex items-center">
                  <input
                    id={option.uuid}
                    name={"question" + question.id}
                    value={option.text}
                    onChange={(ev) => answerChanged(ev.target.value)}
                    type="radio"
                    className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-2 border-white rounded-full"
                  />
                  <label
                    htmlFor={option.uuid}
                    className="ml-3 block text-sm font-medium text-emerald-400"
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          )}
          {question.type === "checkbox" && (
            <div>
              {question.data.options.map((option) => (
                <div key={option.uuid} className="flex items-center">
                  <input
                    id={option.uuid}
                    onChange={(ev) => onCheckboxChange(option, ev)}
                    type="checkbox"
                    className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-2 border-white rounded"
                  />
                  <label
                    htmlFor={option.uuid}
                    className="ml-3 block text-sm font-medium text-emerald-400"
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          )}
          {question.type === "text" && (
            <div>
              <input
                type="text"
                onChange={(ev) => answerChanged(ev.target.value)}
                className="mt-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full py-3 px-4 shadow-sm sm:text-sm border-2 border-white rounded-md text-emerald-400"
              />
            </div>
          )}
          {question.type === "textarea" && (
            <div>
              <textarea
                onChange={(ev) => answerChanged(ev.target.value)}
                className="mt-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full py-3 px-4 shadow-sm sm:text-sm border-2 border-white rounded-md text-emerald-400"
              ></textarea>
            </div>
          )}
        </div>
      </fieldset>
      <hr className="mb-6 border-2 border-white rounded-full" />
    </>
  );
}
