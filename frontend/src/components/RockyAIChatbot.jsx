import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { FiMessageCircle, FiSend, FiX, FiExternalLink } from 'react-icons/fi';

const ONBOARDING_STORAGE_KEY = 'rocky-ai-onboarded-v1';

const FALLBACK_FAQS = [
  {
    id: 'faq-1',
    question: 'What project categories are available?',
    quickPrompt: 'Show me all available project categories and what each one offers.'
  },
  {
    id: 'faq-2',
    question: 'Can you suggest a project for my budget?',
    quickPrompt: 'Recommend projects based on my budget, preferred location, and property type.'
  },
  {
    id: 'faq-3',
    question: 'How can I schedule a meeting?',
    quickPrompt: 'Help me schedule a meeting for full details and clarification.'
  },
  {
    id: 'faq-4',
    question: 'Where can I browse all projects?',
    quickPrompt: 'Give me the direct link where I can browse all published projects.'
  }
];

const isUrl = (value) => /^https?:\/\//i.test(value);

const renderTextWithLinks = (text) => {
  const lines = String(text || '').split('\n');

  return lines.map((line, lineIndex) => {
    const segments = line.split(/(https?:\/\/[^\s]+)/g);

    return (
      <div key={`line-${lineIndex}`}>
        {segments.map((segment, segmentIndex) => {
          if (!segment) return null;

          if (isUrl(segment)) {
            return (
              <a
                key={`segment-${lineIndex}-${segmentIndex}`}
                href={segment}
                onClick={(event) => {
                  event.preventDefault();
                  window.location.href = segment;
                }}
                className="inline-flex items-center gap-1 break-all text-teal-600 underline underline-offset-2 hover:text-teal-700"
              >
                {segment}
                <FiExternalLink className="h-3.5 w-3.5" />
              </a>
            );
          }

          return <span key={`segment-${lineIndex}-${segmentIndex}`}>{segment}</span>;
        })}
      </div>
    );
  });
};

const createMessage = (role, text) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  text,
  createdAt: new Date().toISOString()
});

const RockyAIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [messages, setMessages] = useState(() => [
    createMessage(
      'assistant',
      'Hi, I am Rocky AI. I can guide you through Streamrock projects, units, locations, and system information only. Would you like to schedule a meeting for a full in-depth clarification and details of the units and projects?'
    )
  ]);

  const endRef = useRef(null);

  useEffect(() => {
    const alreadyOnboarded = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!alreadyOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    const loadAssistantContext = async () => {
      try {
        const response = await axios.get('/assistant/context');
        if (Array.isArray(response.data?.faqs) && response.data.faqs.length > 0) {
          setFaqs(
            response.data.faqs.map((faq, index) => ({
              id: faq.id || `faq-${index + 1}`,
              question: faq.question,
              quickPrompt: faq.quickPrompt || faq.question
            }))
          );
        }
      } catch (error) {
        console.error('Failed to load assistant context:', error);
      }
    };

    loadAssistantContext();
  }, []);

  useEffect(() => {
    if (isOpen || isLoading) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, isLoading, messages]);

  const hasMessagesFromUser = useMemo(
    () => messages.some((message) => message.role === 'user'),
    [messages]
  );

  const markOnboardingDone = () => {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, '1');
    setShowOnboarding(false);
  };

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      markOnboardingDone();
    }
  };

  const sendMessage = async (rawText) => {
    const text = rawText.trim();
    if (!text || isLoading) return;

    const userMessage = createMessage('user', text);
    const optimisticMessages = [...messages, userMessage];

    setMessages(optimisticMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/assistant/chat', {
        messages: optimisticMessages.map((message) => ({
          role: message.role,
          content: message.text
        }))
      });

      const reply = response.data?.reply || 'I can help with Streamrock system details only. Would you like to schedule a meeting for full in-depth clarification?';
      setMessages((previous) => [...previous, createMessage('assistant', reply)]);
    } catch (error) {
      const fallback =
        error.response?.data?.message ||
        'Rocky AI is temporarily unavailable. Please try again in a moment. Would you like to schedule a meeting for full in-depth clarification and details instead?';

      setMessages((previous) => [...previous, createMessage('assistant', fallback)]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitMessage = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const useFaqPrompt = (prompt) => {
    setIsOpen(true);
    markOnboardingDone();
    sendMessage(prompt);
  };

  return (
    <>
      {showOnboarding && (
        <div className="fixed inset-0 z-[75] flex items-end justify-end bg-black/35 p-4 sm:p-6">
          <div className="w-full max-w-sm rounded-2xl border border-teal-100 bg-white p-5 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">New Assistant</p>
            <h3 className="mt-2 text-xl font-semibold text-gray-900">Talk to Rocky AI</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Need quick guidance? Rocky AI can help you explore projects, units, pricing, and other system information instantly.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setIsOpen(true);
                  markOnboardingDone();
                }}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Open Rocky AI
              </button>
              <button
                onClick={markOnboardingDone}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-4 z-[70] sm:right-6">
        {isOpen && (
          <div className="mb-3 h-[72vh] max-h-[620px] w-[calc(100vw-2rem)] max-w-[390px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-teal-100">Streamrock Assistant</p>
                <h2 className="text-lg font-semibold">Rocky AI</h2>
                <p className="text-xs text-cyan-100">Friendly and professional system guide</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Rocky AI"
                className="rounded-md p-1.5 transition hover:bg-white/10"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-gray-100 px-3 py-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">FAQs</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {faqs.slice(0, 4).map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => useFaqPrompt(faq.quickPrompt)}
                    className="whitespace-nowrap rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition hover:bg-teal-100"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[calc(72vh-220px)] max-h-[360px] overflow-y-auto bg-gray-50 px-3 py-3 scrollbar-thin">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                        message.role === 'user'
                          ? 'rounded-br-md bg-teal-600 text-white'
                          : 'rounded-bl-md border border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {renderTextWithLinks(message.text)}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:120ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:240ms]" />
                    </div>
                  </div>
                )}

                <div ref={endRef} />
              </div>
            </div>

            <div className="border-t border-gray-100 bg-white p-3">
              {!hasMessagesFromUser && (
                <p className="mb-2 text-xs text-gray-500">
                  Tip: Share your preferred location, budget, and property type for smarter recommendations.
                </p>
              )}

              <form onSubmit={submitMessage} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about projects, units, prices, or locations..."
                  className="h-10 flex-1 rounded-xl border border-gray-300 px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <FiSend className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="relative">
          {!isOpen && (
            <span className="pointer-events-none absolute -inset-1 rounded-full bg-teal-400/50 blur-sm animate-pulse" />
          )}

          <button
            onClick={toggleOpen}
            aria-label="Open Rocky AI chat"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-xl transition hover:scale-105"
          >
            <FiMessageCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  );
};

export default RockyAIChatbot;