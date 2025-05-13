import type { answerByDocument } from '../actions/tool-schemas';

export const TraceSource = ({ answer, source }: answerByDocument) => {
  return (
    <div>
      <div>
        <span>{answer}</span>
      </div>
      <div>
        source: <span>{source}</span>
      </div>
    </div>
  );
};
