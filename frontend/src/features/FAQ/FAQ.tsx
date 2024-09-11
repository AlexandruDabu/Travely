import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What's the best thing about Switzerland?",
      answer: "I don't know, but the flag is a big plus.",
    },
    {
      question: "How do you make holy water?",
      answer: "You boil the hell out of it.",
    },
    {
      question: "What do you call someone with no body and no nose?",
      answer: "Nobody knows.",
    },
    {
      question: "Why do you never see elephants hiding in trees?",
      answer: "Because they're so good at it.",
    },
    {
      question: "Why can't you hear a pterodactyl go to the bathroom?",
      answer: "Because the 'P' is silent.",
    },
    {
      question: "Why did the invisible man turn down the job offer?",
      answer: "He couldn't see himself doing it.",
    },
  ];

  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">Frequently asked questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
            >
              <span className="text-sm sm:text-base lg:text-lg">{faq.question}</span>
              <span className="text-xl sm:text-2xl transition-transform duration-200 transform">
                {openIndex === index ? '-' : '+'}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-max-height duration-200 ease-in-out ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="pb-4">
                <p className="text-sm sm:text-base lg:text-lg">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
