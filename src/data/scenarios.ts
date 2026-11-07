import type { Scenario } from '../types';

/**
 * Identify & Decide challenges.
 * ALL scenarios are fictional educational simulations. Names, numbers and organisations are invented.
 * The learning goal is SAFE DECISION-MAKING, not perfect deepfake detection.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: 'grandson-voice',
    title: 'A voice note from "your grandson"',
    category: 'Manipulated audio',
    channel: 'voice-note',
    sender: { name: 'Unknown number', subtitle: '+65 8xxx 2741', initials: '?', color: '#7f9fd6' },
    intro: 'Late at night you receive these WhatsApp messages from a number you do not recognise.',
    messages: [
      { from: 'them', text: 'Ah Ma, it’s me Wei Jie. My phone spoilt, this is my new number.', time: '11:42 PM' },
      { from: 'them', voice: '0:18', text: '"Ah Ma, I got into trouble… I need $2,000 tonight. Please don’t tell Mummy, ok?"', time: '11:43 PM' },
      { from: 'them', text: 'Please transfer to my friend’s account. Very urgent!!', time: '11:43 PM' },
    ],
    actualVerdict: 'suspicious',
    verdictExplanation:
      'This shows several classic signs of an impersonation scam, even though the voice sounds familiar.',
    choices: [
      { id: 'a', label: 'It sounds like him — send the money quickly', rating: 'unsafe', feedback: 'Voices can be copied by AI from short clips online. Sending money to a "friend’s account" is a very common scam pattern.' },
      { id: 'b', label: 'Call Wei Jie on his OLD saved number, or call his parents', rating: 'safe', feedback: 'Excellent. Checking through a contact you already trust is the safest move — even if the voice sounds right.' },
      { id: 'c', label: 'Reply and ask him which bank account to use', rating: 'unsafe', feedback: 'Continuing the conversation on the new number keeps you talking to the possible scammer. Check through another channel first.' },
      { id: 'd', label: 'Do not reply; call the ScamShield Helpline (1799) for advice', rating: 'safe', feedback: 'Good choice. Not sending money and getting advice protects you. Also let the family know.' },
    ],
    warningSigns: [
      'New, unknown phone number',
      'Urgent request for money late at night',
      '"Don’t tell Mummy" — asking you to keep it secret',
      'Money to go to a "friend’s" account, not his own',
    ],
    keyLesson: 'A familiar voice is not proof. Call back on a number you already trust.',
  },
  {
    id: 'celebrity-investment',
    title: 'Famous tycoon "recommends" an investment',
    category: 'Fake celebrity endorsement',
    channel: 'video-post',
    sender: { name: 'Smart Wealth Daily', subtitle: 'Sponsored · Facebook', initials: 'SW', color: '#2c55a0' },
    intro: 'While scrolling Facebook, you see this sponsored video advertisement.',
    messages: [
      { from: 'them', text: '🔥 Mr Leonard Tay reveals his SECRET platform! Seniors earn $3,000 a week with only $250. Government approved! Limited slots — register today!' },
    ],
    media: {
      headline: '"I guarantee you will double your money"',
      caption: 'Video: business tycoon speaking in a TV studio',
      badge: 'SPONSORED',
      person: 'Leonard Tay (fictional)',
    },
    actualVerdict: 'suspicious',
    verdictExplanation:
      'Famous faces are often deepfaked into investment adverts. "Guaranteed" returns are a major red flag.',
    choices: [
      { id: 'a', label: 'Share it with my friends so they can earn too', rating: 'unsafe', feedback: 'Sharing spreads the scam to people you care about. When in doubt, don’t share.' },
      { id: 'b', label: 'Click "Register" and pay the $250 to try', rating: 'unsafe', feedback: 'Scam platforms often show fake profits at first, then ask for more money and never let you withdraw.' },
      { id: 'c', label: 'Search for news about this from official sources, and check with ScamShield', rating: 'safe', feedback: 'Well done. Look for information from trusted sources yourself — not through links in the advert.' },
      { id: 'd', label: 'Report the advert to Facebook and scroll on', rating: 'safe', feedback: 'Good. Reporting helps the platform remove scam ads before others are tricked.' },
    ],
    warningSigns: [
      'Guaranteed, very high returns',
      'Celebrity endorsement that you cannot confirm elsewhere',
      '"Limited slots" and pressure to act today',
      'Claims of being "government approved"',
    ],
    keyLesson: 'If an investment promises guaranteed high returns, treat it as a scam until proven otherwise.',
  },
  {
    id: 'police-video-call',
    title: 'Video call from an "officer"',
    category: 'AI-generated impersonation video',
    channel: 'video-call',
    sender: { name: 'Insp. Daniel Ong', subtitle: 'WhatsApp video call', initials: 'DO', color: '#13284f' },
    intro: 'You receive a WhatsApp video call. A man in uniform appears on screen.',
    messages: [
      { from: 'them', text: '"Madam, your bank account is linked to a money-laundering case. To clear your name, you must transfer your savings to a safety account for checking."' },
      { from: 'them', text: '"This is confidential. Do not tell your family or the bank, or you will be arrested."' },
    ],
    media: {
      headline: 'Officer in uniform with an official-looking badge',
      caption: 'Live video call — 03:12',
      badge: 'VIDEO CALL',
      person: 'Insp. Daniel Ong (fictional)',
    },
    actualVerdict: 'suspicious',
    verdictExplanation:
      'Real police officers will never ask you to transfer money to "assist investigations" or keep it secret from your family.',
    choices: [
      { id: 'a', label: 'Follow the instructions — he is wearing a uniform', rating: 'unsafe', feedback: 'Uniforms, badges and even faces can be faked. Authorities will never ask you to move your money.' },
      { id: 'b', label: 'Hang up, then call the Police Hotline (1800-255-0000) or ScamShield (1799) yourself', rating: 'safe', feedback: 'Perfect. End the call and contact the official number yourself.' },
      { id: 'c', label: 'Stay on the call but only share my bank name', rating: 'unsafe', feedback: 'Any information helps the scammer build pressure. It is safest to hang up.' },
      { id: 'd', label: 'Hang up and tell a family member what happened', rating: 'safe', feedback: 'Good. Scammers want you isolated. Talking to family breaks their pressure.' },
    ],
    warningSigns: [
      'Threat of arrest',
      'Demand to transfer money to a "safety account"',
      'Asked to keep it secret from family and bank',
      'Contact through WhatsApp video call',
    ],
    keyLesson: 'Government officials will never ask you to transfer money over a call. Hang up and call official numbers yourself.',
  },
  {
    id: 'daughter-dinner',
    title: 'Message from your daughter about dinner',
    category: 'Legitimate message',
    channel: 'whatsapp',
    sender: { name: 'Jessica (daughter)', subtitle: 'Saved contact', initials: 'J', color: '#159f90' },
    intro: 'Your daughter, saved in your contacts for years, sends a message.',
    messages: [
      { from: 'them', text: 'Hi Mum! I’ll pick you up at 6pm on Saturday for dinner at Auntie Lily’s place 😊', time: '2:15 PM' },
      { from: 'them', text: 'Remember to bring the kueh you made!', time: '2:15 PM' },
    ],
    actualVerdict: 'genuine',
    verdictExplanation:
      'This message comes from a long-saved contact, asks for nothing risky, and matches normal family plans.',
    choices: [
      { id: 'a', label: 'Reply normally — "See you at 6!"', rating: 'safe', feedback: 'Correct. Not every message is a scam. There is no request for money, codes or personal details here.' },
      { id: 'b', label: 'Report it as a scam to the police', rating: 'okay', feedback: 'Being careful is good, but this message has no warning signs. Reporting genuine messages wastes your time.' },
      { id: 'c', label: 'Ignore it — all messages could be fake', rating: 'okay', feedback: 'Staying alert is wise, but we also want you to enjoy staying connected with family safely.' },
      { id: 'd', label: 'Forward it to all my groups', rating: 'okay', feedback: 'Not harmful, but there is no reason to forward a private family message.' },
    ],
    warningSigns: [
      'No warning signs: saved contact, no request for money, OTPs or links',
    ],
    keyLesson: 'Being safe online also means recognising normal messages — and staying connected with loved ones.',
  },
  {
    id: 'flood-image',
    title: 'Shocking flood photo in the group chat',
    category: 'AI-generated image with misleading claim',
    channel: 'group-chat',
    sender: { name: 'Kopi Kakis ☕', subtitle: 'Group · 48 members', initials: 'KK', color: '#f98508' },
    intro: 'A member forwards this image to your friends’ group chat.',
    messages: [
      { from: 'them', image: { caption: 'Orchard Road under 2 metres of water!!', kind: 'flood' } },
      { from: 'them', text: 'Forwarded many times: SHARE BEFORE THEY DELETE THIS!! Government hiding the truth!!' },
    ],
    actualVerdict: 'suspicious',
    verdictExplanation:
      'Dramatic images can be created by AI. "Share before they delete" is a common tactic to spread false information quickly.',
    choices: [
      { id: 'a', label: 'Forward it to all my family groups to warn them', rating: 'unsafe', feedback: 'Sharing unverified images spreads panic and misinformation, even with good intentions.' },
      { id: 'b', label: 'Check official news or government channels before sharing', rating: 'safe', feedback: 'Excellent. Trusted news sources would report a real flood. If they don’t, don’t share.' },
      { id: 'c', label: 'Reply in the group: "Let’s check official news first before sharing"', rating: 'safe', feedback: 'Wonderful — you are helping your whole group stay sharp. That’s community protection!' },
      { id: 'd', label: 'Believe it — a photo is proof', rating: 'unsafe', feedback: 'Photos can now be generated or edited by AI. A photo alone is not proof.' },
    ],
    warningSigns: [
      '"Forwarded many times" label',
      'Emotional, dramatic claim',
      '"Share before they delete this" pressure',
      'No source or date given',
    ],
    keyLesson: 'Before you forward, check whether trusted news sources are reporting it.',
  },
  {
    id: 'parcel-sms',
    title: 'Parcel delivery fee SMS',
    category: 'Suspicious message (phishing)',
    channel: 'sms',
    sender: { name: '+65 9xxx 1182', subtitle: 'SMS', initials: '#', color: '#4c74bd' },
    intro: 'You receive this SMS. You are not sure if you ordered anything recently.',
    messages: [
      { from: 'them', text: 'SG-POST: Your parcel is on hold due to unpaid fee of $1.99. Pay within 24 hrs or it will be returned: http://sgpost-redeliver.co/pay', time: '9:03 AM' },
    ],
    actualVerdict: 'suspicious',
    verdictExplanation:
      'Small "fees" with a link are often used to steal card details. The link does not belong to an official website.',
    choices: [
      { id: 'a', label: 'Pay the $1.99 — it’s only a small amount', rating: 'unsafe', feedback: 'The goal is not the $1.99 — it is your card details, which can be used for much bigger payments.' },
      { id: 'b', label: 'Do not click. Check your order on the official app or website you normally use', rating: 'safe', feedback: 'Exactly right. Go to the source yourself instead of using the link in the message.' },
      { id: 'c', label: 'Click the link just to have a look', rating: 'unsafe', feedback: 'Even "just looking" can lead to fake pages that ask for your details. Avoid unknown links.' },
      { id: 'd', label: 'Report the SMS using the ScamShield app and delete it', rating: 'safe', feedback: 'Good. Reporting helps authorities block scam numbers for everyone.' },
    ],
    warningSigns: [
      'Unknown sender number',
      'Strange web address (not an official domain)',
      'Deadline: "within 24 hrs"',
      'Asks for payment through a link',
    ],
    keyLesson: 'Never pay through a link in an unexpected message. Go to the official app or website yourself.',
  },
  {
    id: 'whatsapp-otp',
    title: 'A friend asks for a 6-digit code',
    category: 'Account takeover attempt',
    channel: 'whatsapp',
    sender: { name: 'Susan Koh', subtitle: 'Saved contact', initials: 'SK', color: '#0e8076' },
    intro: 'Your friend Susan (a saved contact) messages you.',
    messages: [
      { from: 'them', text: 'Hi dear! I accidentally sent my 6-digit code to your phone. Can you send it to me? 🙏', time: '4:21 PM' },
      { from: 'system', text: 'SMS received: "Your WhatsApp code: 482-913. Don’t share this code with others."' },
      { from: 'them', text: 'Quick quick ya, it expires soon', time: '4:22 PM' },
    ],
    actualVerdict: 'suspicious',
    verdictExplanation:
      'Susan’s account may already be taken over. The code would let the scammer take over YOUR WhatsApp too.',
    choices: [
      { id: 'a', label: 'Send the code — Susan is my good friend', rating: 'unsafe', feedback: 'That code would let someone log in to your WhatsApp account and then trick YOUR friends.' },
      { id: 'b', label: 'Don’t send it. Call Susan by phone to check', rating: 'safe', feedback: 'Perfect. If her account was hacked, you can also warn her.' },
      { id: 'c', label: 'Send only half the code', rating: 'unsafe', feedback: 'Never share any part of a verification code.' },
      { id: 'd', label: 'Don’t reply, and turn on WhatsApp two-step verification', rating: 'safe', feedback: 'Great. Two-step verification adds a PIN that makes your account harder to steal.' },
    ],
    warningSigns: [
      'Request for a verification code (OTP)',
      'Time pressure: "it expires soon"',
      'The code message itself says not to share it',
    ],
    keyLesson: 'Never share verification codes — even with friends. Their account may have been taken over.',
  },
  {
    id: 'doctor-supplement',
    title: '"Doctor" promotes a miracle knee cure',
    category: 'Ambiguous — verify first',
    channel: 'video-post',
    sender: { name: 'HealthyJoints Official', subtitle: 'Sponsored · Instagram', initials: 'HJ', color: '#159f90' },
    intro: 'You see a short video advertisement with a person in a white coat.',
    messages: [
      { from: 'them', text: 'Doctors HATE this! Dr Grace Lim’s natural capsule cures knee pain in 7 days. 90% off for seniors today only!' },
    ],
    media: {
      headline: '"I have treated thousands of patients with this"',
      caption: 'Video: person in white coat in a clinic',
      badge: 'SPONSORED',
      person: '"Dr" Grace Lim (fictional)',
    },
    actualVerdict: 'uncertain',
    verdictExplanation:
      'You cannot tell from the video alone whether this person is a real doctor or a deepfake. The claims ("cures in 7 days") are a warning sign either way.',
    choices: [
      { id: 'a', label: 'Buy it now while it’s 90% off', rating: 'unsafe', feedback: 'Big discounts with "today only" pressure are a common sales and scam tactic. Health products need careful checking.' },
      { id: 'b', label: 'Ask my own doctor or pharmacist before buying anything', rating: 'safe', feedback: 'Excellent. A health professional you already know is a trusted, independent source.' },
      { id: 'c', label: 'Share it with my friends who have knee pain', rating: 'unsafe', feedback: 'Sharing unverified health claims can cause harm. Check first.' },
      { id: 'd', label: 'Look up whether the product is registered with health authorities', rating: 'safe', feedback: 'Good thinking. Check official sources yourself rather than trusting the advert.' },
    ],
    warningSigns: [
      '"Cures" a condition quickly',
      'Huge discount, "today only"',
      'Expert you cannot confirm independently',
    ],
    keyLesson: 'When you cannot tell whether a video is real, the answer is the same: check with a trusted source before acting.',
  },
  {
    id: 'bank-new-device',
    title: 'Bank SMS about a new login',
    category: 'Ambiguous — verify first',
    channel: 'sms',
    sender: { name: 'MyBank', subtitle: 'SMS · Sender ID', initials: 'MB', color: '#183467' },
    intro: 'You receive this SMS. It has no link.',
    messages: [
      { from: 'them', text: 'MyBank: A login to your account was detected from a new device on 05 Nov, 10:14pm. If this was not you, please call the number on the back of your card.', time: '10:15 PM' },
    ],
    actualVerdict: 'uncertain',
    verdictExplanation:
      'This could be a genuine alert — it has no link and asks you to use the number on your own card. But you still cannot be sure from the message alone.',
    choices: [
      { id: 'a', label: 'Call the number on the back of my bank card', rating: 'safe', feedback: 'Exactly right. Whether the SMS is real or fake, calling the number on your own card is always safe.' },
      { id: 'b', label: 'Reply to the SMS with my account number so they can check', rating: 'unsafe', feedback: 'Never send account details by reply. Use the official number yourself.' },
      { id: 'c', label: 'Ignore it completely', rating: 'okay', feedback: 'Not dangerous by itself, but if it is real, someone may be trying to access your account. Checking is better.' },
      { id: 'd', label: 'Search online for "MyBank hotline" and call the first result', rating: 'okay', feedback: 'Careful — scammers sometimes buy fake ads with fake hotline numbers. The number on your card is more reliable.' },
    ],
    warningSigns: [
      'Unexpected security alert',
      'Good sign: no link and no request for codes',
      'Good sign: points you to the number on your own card',
    ],
    keyLesson: 'Not sure if it is real? Use the contact you already trust — like the number on your card.',
  },
  {
    id: 'investment-group',
    title: 'Invited to a "VIP Stock Club"',
    category: 'Investment scam group',
    channel: 'group-chat',
    sender: { name: 'VIP Stock Club 📈', subtitle: 'Group · 312 members', initials: 'VS', color: '#dd6203' },
    intro: 'Someone added you to a WhatsApp group. Members are posting about big profits.',
    messages: [
      { from: 'them', text: 'Prof. Chen (AI trading expert): Today’s signal earned members 35% profit! 🚀', time: '8:00 AM' },
      { from: 'them', image: { caption: 'Screenshot: "Profit $12,480 today"', kind: 'profit' } },
      { from: 'them', text: 'Member Ah Huat: Thank you Prof! Withdrew $8,000 already 🙏🙏', time: '8:02 AM' },
      { from: 'them', text: 'Admin: New members DM me to download our trading app. Only 5 slots left!', time: '8:05 AM' },
    ],
    actualVerdict: 'suspicious',
    verdictExplanation:
      'Scam groups are often filled with fake members and fake profit screenshots to make you feel you are missing out.',
    choices: [
      { id: 'a', label: 'DM the admin and download the trading app', rating: 'unsafe', feedback: 'Apps sent by strangers can be fake platforms or even malware that steals your banking details.' },
      { id: 'b', label: 'Invest a small amount first to test it', rating: 'unsafe', feedback: 'Scammers often let you "win" small amounts first, to get you to invest much more.' },
      { id: 'c', label: 'Exit the group, report it, and block the admin', rating: 'safe', feedback: 'Well done. You don’t owe strangers a reply.' },
      { id: 'd', label: 'Check with ScamShield or a trusted family member first', rating: 'safe', feedback: 'Good. A second opinion helps you see through the excitement.' },
    ],
    warningSigns: [
      'Added to a group by strangers',
      'Very high profits shown in screenshots (easy to fake)',
      'Many "members" praising the admin',
      'Pressure: "only 5 slots left"',
    ],
    keyLesson: 'Profit screenshots and happy "members" can all be fake. Leave and report the group.',
  },
  {
    id: 'friend-new-number',
    title: 'An old friend with a new number',
    category: 'Ambiguous — verify first',
    channel: 'whatsapp',
    sender: { name: '+65 9xxx 6620', subtitle: 'Not in contacts', initials: '?', color: '#7f9fd6' },
    intro: 'A new number messages you. It has your friend’s profile photo.',
    messages: [
      { from: 'them', text: 'Hello! It’s Mei Ling from the community centre line dance class 😊 This is my new number, please save it.', time: '10:30 AM' },
      { from: 'them', text: 'How have you been?', time: '10:31 AM' },
    ],
    actualVerdict: 'uncertain',
    verdictExplanation:
      'There is no request yet, so this might be genuine. But scammers often start friendly and ask for money later.',
    choices: [
      { id: 'a', label: 'Save the number and chat — it’s just a hello', rating: 'okay', feedback: 'It might be real, but it is wiser to confirm first. Stay alert if money or codes come up later.' },
      { id: 'b', label: 'Call Mei Ling on her OLD number or ask a classmate to confirm', rating: 'safe', feedback: 'Excellent. A quick check costs nothing and keeps you safe.' },
      { id: 'c', label: 'Ask a question only the real Mei Ling would know', rating: 'safe', feedback: 'Good idea — a personal question can help. Calling her old number is even better.' },
      { id: 'd', label: 'Send her my home address so she can visit', rating: 'unsafe', feedback: 'Don’t share personal information until you are sure who you are talking to.' },
    ],
    warningSigns: [
      'New number, not in your contacts',
      'Profile photos can be copied easily',
      'No request yet — but stay alert',
    ],
    keyLesson: 'When a contact changes numbers, confirm through the old number or a mutual friend.',
  },
  {
    id: 'cc-event',
    title: 'Community centre event reminder',
    category: 'Legitimate message',
    channel: 'whatsapp',
    sender: { name: 'Bedok CC Seniors Club', subtitle: 'Saved contact · Your club', initials: 'CC', color: '#0f6660' },
    intro: 'The seniors club you joined last year sends a message to its members.',
    messages: [
      { from: 'them', text: 'Good morning members! Reminder: free health talk this Thursday 10am at the CC hall. No registration needed. See you there! 🌼', time: '8:30 AM' },
    ],
    actualVerdict: 'genuine',
    verdictExplanation:
      'This comes from a contact you know, offers a free event, and asks for no money, links, or personal details.',
    choices: [
      { id: 'a', label: 'Note the date and go if I’m free', rating: 'safe', feedback: 'Correct. Recognising safe messages is just as important as spotting scams.' },
      { id: 'b', label: 'Block the club — it might be a scam', rating: 'okay', feedback: 'Being careful is good, but this message has no warning signs. You might miss out on useful events.' },
      { id: 'c', label: 'Call the CC to confirm if I’m unsure', rating: 'safe', feedback: 'Also fine! Checking is never wrong when you feel unsure.' },
      { id: 'd', label: 'Reply with my NRIC number to register', rating: 'unsafe', feedback: 'The message says no registration is needed. Never send your NRIC by chat unless you are sure why it is needed.' },
    ],
    warningSigns: ['No warning signs: known sender, free event, no requests'],
    keyLesson: 'Most messages are genuine. Look for the warning signs — don’t fear every message.',
  },
];

export const getScenario = (id: string) => SCENARIOS.find((s) => s.id === id);
