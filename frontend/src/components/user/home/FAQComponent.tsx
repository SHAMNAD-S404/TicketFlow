import React, { useEffect, useState } from "react";

//Type for FAQ items
interface FAQItem {
  question: string;
  answer: string;
}

// Props type for FAQComponent
interface FAQProps {
  faqs: FAQItem[];
}

const FAQComponent: React.FC<FAQProps> = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [displayedText, setDisplayedText] = useState<string>(""); //for typing animation

  //Handle toggle
  const handleToggle = (index: number) => {
    if (index === activeIndex) {
      setActiveIndex(null); //to close the current item
    } else {
      setActiveIndex(index);
      setDisplayedText(""); //to reset content
    }
  };

  //Typing animation effect
  useEffect(() => {
    if (activeIndex !== null) {
      const answer = faqs[activeIndex].answer;
      let currentIndex: number = 0;

      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + answer[currentIndex]);
        currentIndex++;

        if (currentIndex === answer.length - 1) clearInterval(interval);
      }, 20);

      return () => clearInterval(interval);
    }
  }, [activeIndex, faqs]);

  return (
    <section className="bg-blue-200 pb-10">
      <div className="  max-w-3xl mx-auto pt-5 ">
        <h2 className="text-4xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-black mb-8 text-xl">
          Have a question? Find answers to common queries below.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              {/* Question Section */}
              <div
                onClick={() => handleToggle(index)}
                className="p-4 flex justify-between items-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
              >
                <h3 className="font-medium text-gray-800">{faq.question}</h3>
                <span className="text-xl font-bold">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>

              {/* Typing Animation in Answer Section */}
              {activeIndex === index && (
                <div className="p-4 font-medium bg-white text-gray-600">
                  <p>{displayedText}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQComponent;
