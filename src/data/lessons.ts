import type { Lesson } from '../types';

/**
 * Learning modules. Plain language, short sentences, no jargon.
 * Each lesson: 4 short cards + a 3-question quiz.
 */
export const LESSONS: Lesson[] = [
  {
    id: 'what-is-deepfake',
    number: 1,
    title: 'What Is a Deepfake?',
    zhTitle: '什么是深度伪造？',
    summary: 'Learn how computers can now make fake pictures, voices and videos that look real.',
    minutes: 3,
    color: 'teal',
    cards: [
      {
        title: 'Computers can now "make up" content',
        illustration: 'ai-brain',
        body: [
          'Artificial intelligence (AI) is computer software that learns from lots of examples.',
          'Today, AI can create brand-new photos, voices and videos of people — even things they never said or did.',
          'These made-up pictures, voices and videos are often called "deepfakes".',
        ],
        tip: 'Deepfake = "deep learning" (a type of AI) + "fake".',
      },
      {
        title: 'Fake videos and photos',
        illustration: 'fake-video',
        body: [
          'A deepfake video can show a famous person, a minister or a doctor "recommending" an investment or a product.',
          'A fake photo can show an event that never happened, like a flood or an accident.',
          'Scammers use these to make their stories look believable.',
        ],
      },
      {
        title: 'Fake voices',
        illustration: 'voice-wave',
        body: [
          'AI can copy a person’s voice from a short recording, such as a video posted online.',
          'Scammers may send a voice message that sounds like your grandson, daughter or friend asking for urgent help.',
          'A familiar voice alone is not proof that it is really them.',
        ],
        tip: 'Agree on a family "safe word" that only your family knows.',
      },
      {
        title: 'Convincing does not mean true',
        illustration: 'not-trust',
        body: [
          'Deepfakes are getting better every year. Sometimes even experts cannot tell by looking.',
          'So the goal is not to become a perfect "fake detector".',
          'The goal is to pause and check before you trust, share or pay.',
        ],
        tip: 'Ask yourself: "Who is asking me to do something — and how can I check?"',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is a deepfake?',
        options: [
          { id: 'a', text: 'A photo that is a bit blurry' },
          { id: 'b', text: 'A picture, voice or video made or changed by AI to look real' },
          { id: 'c', text: 'A type of computer virus' },
        ],
        correctId: 'b',
        explanation:
          'Deepfakes are pictures, voices or videos created or altered by AI so that they look and sound real.',
      },
      {
        id: 'q2',
        question: 'You get a voice message that sounds exactly like your grandson. Is this enough to prove it is him?',
        options: [
          { id: 'a', text: 'Yes — I know his voice very well' },
          { id: 'b', text: 'No — AI can copy voices, so I should check another way' },
        ],
        correctId: 'b',
        explanation:
          'AI can copy a voice from a short recording. Call him back on the number you already have, or ask a family member.',
      },
      {
        id: 'q3',
        question: 'What is the best habit to protect yourself from deepfakes?',
        options: [
          { id: 'a', text: 'Look very closely at every video for mistakes' },
          { id: 'b', text: 'Only trust videos with famous people' },
          { id: 'c', text: 'Pause and check with a trusted source before acting' },
        ],
        correctId: 'c',
        explanation:
          'Looking closely can help sometimes, but good fakes may have no visible mistakes. Pausing and checking works every time.',
      },
    ],
  },
  {
    id: 'spotting-suspicious',
    number: 2,
    title: 'Spotting Suspicious Content',
    zhTitle: '识别可疑内容',
    summary: 'Notice the warning signs: impersonation, pressure, and requests for money or codes.',
    minutes: 3,
    color: 'navy',
    cards: [
      {
        title: 'Warning sign 1: Someone pretending to be someone else',
        illustration: 'impersonation',
        body: [
          'Scammers pretend to be family, friends, bank staff, police officers, government officers or celebrities.',
          'They may use a new phone number, a copied profile photo, or a deepfake video call.',
          '"Hi Ma, I changed my number" is a very common opening line.',
        ],
      },
      {
        title: 'Warning sign 2: Pressure and strong emotions',
        illustration: 'pressure-clock',
        body: [
          'Scam messages try to make you feel scared, excited, or rushed.',
          'Look out for words like "URGENT", "act now", "don’t tell anyone" or "you will be arrested".',
          'Real organisations give you time to check.',
        ],
        tip: 'If you feel rushed, that is the moment to slow down.',
      },
      {
        title: 'Warning sign 3: Requests for money, codes or details',
        illustration: 'money-request',
        body: [
          'Be very careful with any request to transfer money, buy gift cards, or click a payment link.',
          'Never share one-time passwords (OTPs), PINs, or your banking login — not even with "the bank".',
          'Guaranteed high returns on investments are a classic scam sign.',
        ],
      },
      {
        title: 'Your eyes alone are not enough',
        illustration: 'check-source',
        body: [
          'Odd lips, strange blinking or a robotic voice can be clues — but many fakes have none of these.',
          'And real videos can look strange because of a poor connection.',
          'So always check the SOURCE: contact the person or organisation yourself, using a number or website you already trust.',
        ],
        tip: 'Use the number on the back of your bank card, or the official website you type in yourself.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which message is the most suspicious?',
        options: [
          { id: 'a', text: '"See you at lunch on Sunday!" from your son’s usual number' },
          { id: 'b', text: '"URGENT! Your account will be frozen. Click this link in 10 minutes."' },
          { id: 'c', text: '"Your library book is due next week."' },
        ],
        correctId: 'b',
        explanation:
          'Urgency, a threat and a link together are strong warning signs. Real banks do not threaten you over a link.',
      },
      {
        id: 'q2',
        question: 'A video looks perfectly normal — no strange lips or blinking. Does that prove it is real?',
        options: [
          { id: 'a', text: 'Yes, fakes always have visible mistakes' },
          { id: 'b', text: 'No, good deepfakes may have no visible mistakes' },
        ],
        correctId: 'b',
        explanation:
          'Visual clues can help, but they cannot prove anything. Checking the source independently is more reliable.',
      },
      {
        id: 'q3',
        question: 'Someone claiming to be from your bank asks for the OTP sent to your phone. What should you do?',
        options: [
          { id: 'a', text: 'Give it — they are from the bank' },
          { id: 'b', text: 'Never share it. Hang up and call the bank using the number on your card' },
          { id: 'c', text: 'Share only the first three digits' },
        ],
        correctId: 'b',
        explanation:
          'Banks will never ask for your OTP. Hang up and call the official number on the back of your card.',
      },
    ],
  },
  {
    id: 'protect-yourself',
    number: 3,
    title: 'Protecting Yourself from Online Scams',
    zhTitle: '保护自己免受网络诈骗',
    summary: 'Pause, verify through trusted channels, guard your information, and know where to get help.',
    minutes: 3,
    color: 'sun',
    cards: [
      {
        title: 'Step 1: Pause',
        illustration: 'pause',
        body: [
          'Before you click, pay, reply or share — stop and take a breath.',
          'A real friend, bank or government office will not mind if you take time to check.',
          'Scammers are the only ones who need you to hurry.',
        ],
        tip: 'Count to ten. Make a cup of tea. Then decide.',
      },
      {
        title: 'Step 2: Verify through a trusted channel',
        illustration: 'phone-verify',
        body: [
          'Contact the person or organisation yourself. Use a phone number you already saved, or the one on an official card or website.',
          'Do not use the number, link or contact given in the suspicious message.',
          'Ask a family member, friend or community volunteer for a second opinion.',
        ],
      },
      {
        title: 'Step 3: Protect your information',
        illustration: 'lock-info',
        body: [
          'Never share your OTP, PIN, passwords, Singpass details or banking login.',
          'Be careful about sharing your NRIC number, address or photos with people you do not know.',
          'Turn on extra security in your banking app, such as transaction alerts.',
        ],
      },
      {
        title: 'Step 4: Get help and report',
        illustration: 'report-help',
        body: [
          'Unsure if something is a scam? Call the 24/7 ScamShield Helpline at 1799, or visit scamshield.gov.sg.',
          'If you have sent money or bank details, call your bank immediately, then make a police report.',
          'If you are in danger, call 999.',
        ],
        tip: 'Telling others what happened helps protect your friends too. There is no shame in being targeted.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Your "nephew" messages from a new number asking you to lend $800 urgently. What is the safest first step?',
        options: [
          { id: 'a', text: 'Transfer the money quickly — family comes first' },
          { id: 'b', text: 'Call your nephew on his old, saved number to check' },
          { id: 'c', text: 'Reply asking for his bank details' },
        ],
        correctId: 'b',
        explanation:
          'Use a contact you already trust. If it is really him, he will understand why you checked.',
      },
      {
        id: 'q2',
        question: 'Which of these should you NEVER share with anyone over a call or message?',
        options: [
          { id: 'a', text: 'Your OTP and banking password' },
          { id: 'b', text: 'Your favourite recipe' },
          { id: 'c', text: 'The weather in your area' },
        ],
        correctId: 'a',
        explanation: 'OTPs and passwords unlock your money. No genuine organisation will ask for them.',
      },
      {
        id: 'q3',
        question: 'You are unsure whether a message is a scam. Who can you call in Singapore for advice, any time of day?',
        options: [
          { id: 'a', text: 'The phone number written in the message' },
          { id: 'b', text: 'The ScamShield Helpline at 1799' },
          { id: 'c', text: 'Nobody — just ignore all messages' },
        ],
        correctId: 'b',
        explanation:
          'The ScamShield Helpline (1799) is available 24/7 to help you check if something is a scam.',
      },
    ],
  },
];

export const getLesson = (id: string) => LESSONS.find((l) => l.id === id);
