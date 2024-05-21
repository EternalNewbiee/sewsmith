import React from 'react';

const faqs = [
  {
    question: "How does SewSmith work?",
    answer: "You choose a fabric, customize your design, and our artisans will craft it to perfection. It's that simple."
  },
  {
    question: "What materials do you use?",
    answer: "We use high-quality materials including silk, cotton, linen, wool, denim, and velvet."
  },
  {
    question: "Can I track my order?",
    answer: "Yes, you can track your order through our website using your order ID."
  },
  {
    question: "Do you offer workshops?",
    answer: "Yes, we offer workshops for different levels of sewing skills. Check our workshops page for more details."
  },
];

const FAQs: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="flex flex-col sm:flex-row">
              <dt className="text-lg font-medium text-gray-900 sm:w-1/3">{faq.question}</dt>
              <dd className="mt-2 text-base text-gray-600 sm:mt-0 sm:w-2/3">{faq.answer}</dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQs;
