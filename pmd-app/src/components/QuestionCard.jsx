import React from 'react';

export default function QuestionCard({ question, targetNature }) {


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
                        <div className="flex gap-1 flex-wrap justify-end max-w-[70%]">
                            {Object.entries(answer.points || {})
                                .filter(([, score]) => score > 0)
                                .sort(([natureA], [natureB]) => {
                                    if (natureA === targetNature) return -1;
                                    if (natureB === targetNature) return 1;
                                    return 0;
                                })
                                .map(([nature, score]) => {
                                    const isTarget = nature === targetNature;
                                    return (
                                        <span
                                            key={nature}
                                            className={`font-bold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap ${isTarget
                                                ? 'bg-green-500 text-black'
                                                : 'bg-gray-700 text-gray-400'
                                                }`}
                                        >
                                            +{score} {nature}
                                        </span>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
