export type EmailLanguage = 'en' | 'ko';
export function normalizeEmailLanguage(value: unknown): EmailLanguage {
  return typeof value === 'string' && value.toLowerCase().split(/[-_]/)[0] === 'ko' ? 'ko' : 'en';
}
const korean: Record<string, string> = {
  'Verify Your Boop': '부프 전송 확인',
  'Hey {name}!': '{name}님, 안녕하세요!',
  "There's one more important step! Click the button below to send this adorable pup to <strong>{name}</strong>:": '마지막 확인 단계입니다! 아래 버튼을 눌러 <strong>{name}</strong>님에게 귀여운 동물 사진을 보내 주세요:',
  'Your message:': '보내는 메시지:', 'Send This Boop!': '이 부프 보내기!',
  'This link expires in 24 hours.': '이 링크는 24시간 동안 유효합니다.',
  "Didn't request this? You can safely ignore this email.": '요청한 이메일이 아니라면 무시하셔도 됩니다.',
  'You got a Boop!': '부프가 도착했어요!', '{name} sent you this boop!': '{name}님이 이 부프를 보냈어요!',
  'from {email}': '보낸 주소: {email}', 'Send {name} a Boop Back? 🐾': '{name}님에게 부프로 답장할까요? 🐾',
  'or send a boop to someone else →': '다른 사람에게 부프 보내기 →',
  'Sent with love via Send a Boop 🐕': 'Send a Boop으로 마음을 전합니다 🐕',
  'Appreciate this app?': '이 앱이 마음에 드시나요?', 'Leave me a message!': '의견을 보내 주세요!',
  'Your Boop was sent!': '부프를 보냈어요!', 'Boop Sent! 🎈': '부프를 보냈어요! 🎈',
  'Your boop to <strong>{name}</strong> has been sent successfully!': '<strong>{name}</strong>님에게 부프를 보냈습니다!',
  "They'll receive a cute photo in their inbox. You're making someone's day brighter!": '친구의 받은편지함에 귀여운 사진이 도착할 거예요. 여러분이 누군가의 하루를 밝게 해 주셨습니다!',
  'Send Another Boop 🐶': '다른 부프 보내기 🐶', 'Please leave me a tip at Ko-fi!': 'Ko-fi에서 후원해 주세요!',
  'Verify your boop to {name}': '{name}님에게 보낼 부프를 확인해 주세요',
  '{name} sent you a Boop! 🐾': '{name}님이 부프를 보냈어요! 🐾',
  'Your Boop to {name} was sent! 🎉': '{name}님에게 부프를 보냈어요! 🎉',
};
export function emailText(language: unknown, source: string, values: Record<string, string> = {}): string {
  const text = normalizeEmailLanguage(language) === 'ko' ? korean[source] || source : source;
  return text.replace(/\{(\w+)\}/g, (match, key: string) => Object.hasOwn(values, key) ? values[key] : match);
}
