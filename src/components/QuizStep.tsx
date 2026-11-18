import type { QuizQuestion } from "../data/missions";

const GUESS_SUMMARY: Record<string, string> = {
  tilt: "Du gissade på jordaxelns lutning redan från början. Snyggt!",
  distance:
    "I början gissade du att det beror på avståndet till solen. Nu vet du att det är jordaxelns lutning som ger oss årstider.",
  sun: "I början gissade du att solen lyser starkare på sommaren. Nu vet du att solen lyser ungefär lika starkt hela året, och att det är lutningen som gör skillnaden.",
};

type Props = {
  questions: QuizQuestion[];
  answers: Record<number, number>;
  onAnswer: (questionIndex: number, optionIndex: number) => void;
  guess: string | null;
  onRestart: () => void;
};

export function QuizStep({
  questions,
  answers,
  onAnswer,
  guess,
  onRestart,
}: Props) {
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const score = questions.filter(
    (q, i) => answers[i] === q.correctIndex,
  ).length;

  return (
    <>
      {questions.map((q, qi) => {
        const given = answers[qi];
        const isAnswered = given !== undefined;

        return (
          <div className="quiz-question" key={q.question}>
            <h3>{q.question}</h3>
            {q.options.map((option, oi) => {
              let className = "option";
              if (isAnswered && oi === q.correctIndex) className += " correct";
              else if (isAnswered && oi === given) className += " wrong";

              return (
                <button
                  key={option}
                  type="button"
                  className={className}
                  disabled={isAnswered}
                  onClick={() => onAnswer(qi, oi)}
                >
                  {option}
                </button>
              );
            })}
            {isAnswered && (
              <p className="quiz-explanation">
                <strong>
                  {given === q.correctIndex ? "Rätt! " : "Inte riktigt. "}
                </strong>
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {allAnswered && (
        <div className="quiz-result">
          <strong>
            Du fick {score} av {questions.length} rätt.
          </strong>
          {guess && GUESS_SUMMARY[guess]}
          <div className="chip-row">
            <button type="button" className="chip" onClick={onRestart}>
              Gör om uppdraget
            </button>
          </div>
        </div>
      )}
    </>
  );
}
