import React from 'react';

export default function QuestionCard({ question, targetNature }) {
    // Check if this question is relevant (has any positive impact)
    const isRelevant = question.answers.some(a => a.isBest);

    if (!isRelevant) return null; // Optional: hide irrelevant questions

    return (
        <div className="bg-dungeon-panel border border-white/10 rounded-lg p-3 mb-2 shadow-sm break-inside-avoid">
            <h3 className="text-sm font-semibold text-white mb-2">{question.text}</h3>
            <div className="space-y-1">
                {question.answers.map((answer, idx) => (
                    <div
                        key={idx}
                        className={`
              p-2 rounded border transition-all duration-200 flex justify-between items-center text-xs
              ${answer.isBest
                                ? 'bg-green-500/20 border-green-500/50 text-green-100 shadow-[0_0_5px_rgba(34,197,94,0.2)]'
                                : 'bg-black/20 border-white/5 text-gray-400 opacity-60'
                            }
            `}
                    >
                        <span>{answer.text}</span>
                        {answer.isBest && (
                            <span className="font-bold bg-green-500 text-black px-1.5 py-0.5 rounded text-[10px]">
                                +{answer.score} {targetNature}
                            </span>
                        )}
                        {!answer.isBest && answer.score > 0 && (
                            <span className="text-[10px] text-gray-500">+{answer.score} {targetNature}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
