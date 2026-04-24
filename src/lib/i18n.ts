export type Lang = "en" | "ko";
export const LANGS: Lang[] = ["en", "ko"];
export const LANG_COOKIE = "kosta_lang";

const EN = {
  "nav.prayers": "Prayer Notes",
  "nav.worship": "Worship",
  "nav.admin": "Admin",
  "nav.signIn": "Sign in",
  "nav.join": "Join",
  "nav.hi": "Hi,",
  "nav.settings": "Settings",
  "nav.language": "Language",
  "nav.adminSignIn": "Admin sign in",

  "home.tagline": "QLD Youth KOSTA",
  "home.heroA": "A warm place to",
  "home.heroPray": "pray",
  "home.heroEncourage": "encourage",
  "home.heroWorship": "worship",
  "home.heroAnd": "and",
  "home.heroTogether": "together.",
  "home.subtitle":
    "Share prayer requests, lift each other up, and pass on the worship songs that have been speaking to you this week.",
  "home.readPrayers": "Read prayer notes",
  "home.sharePrayer": "Share a prayer",
  "home.latestPrayers": "Latest prayer notes",
  "home.latestPrayersSub": "Read and pray with your friends.",
  "home.seeAll": "See all",
  "home.worshipResources": "Worship resources",
  "home.worshipResourcesSub": "Praise lyrics and worship files shared by the community.",
  "home.browseAll": "Browse all",
  "home.noPrayers": "No prayers shared yet.",
  "home.beFirst": "Be the first to share one.",
  "home.noResources": "No resources uploaded yet.",

  "qr.title": "Scan to join",
  "qr.body":
    "Open the camera on your phone, point it at this code, and tap the link to share a prayer or browse worship resources.",

  "prayers.title": "Prayer notes",
  "prayers.subtitle":
    "Every note you see here has been approved by an admin. Tap I prayed after praying, or send a heart of encouragement.",
  "prayers.share": "+ Share a prayer",
  "prayers.empty": "No approved prayer notes yet. Be the first to share one.",
  "prayers.shareFirst": "Share the first prayer",
  "prayers.iPrayed": "I prayed",
  "prayers.prayed": "Prayed",
  "prayers.anon": "익명 · Anon",

  "prayerForm.title": "Share a prayer",
  "prayerForm.intro":
    "You don't need an account to share a prayer. Choose to share your name or stay anonymous — your note will be reviewed by an admin before it appears publicly.",
  "prayerForm.fieldTitle": "Title",
  "prayerForm.titlePlaceholder": "e.g. Family conflict at home",
  "prayerForm.fieldContent": "What would you like us to pray for?",
  "prayerForm.contentPlaceholder": "Share as much or as little as you like.",
  "prayerForm.fieldName": "Your name (optional)",
  "prayerForm.namePlaceholder": "e.g. Hannah",
  "prayerForm.anonLabel": "Post anonymously (shown as",
  "prayerForm.cancel": "Cancel",
  "prayerForm.submit": "Submit for approval",
  "prayerForm.submitting": "Submitting…",
  "prayerForm.thanks": "Thank you 🙏",
  "prayerForm.thanksBody":
    "Your prayer has been submitted and is awaiting admin approval. It will appear publicly once approved.",
  "prayerForm.another": "Share another",
  "prayerForm.back": "Back to prayers",

  "resources.title": "Worship resources",
  "resources.subtitle":
    "Lyrics, chord sheets, and images the community has shared. PDFs, images, and typed lyrics welcome.",
  "resources.upload": "+ Upload resource",
  "resources.signInToUpload": "Sign in to upload",
  "resources.empty": "No resources uploaded yet.",
  "resources.preview": "Preview",
  "resources.openPdf": "Open PDF",
  "resources.viewFull": "View full",
  "resources.viewLyrics": "View lyrics",
  "resources.sharedBy": "Shared by",
  "resources.remove": "Remove",

  "upload.title": "Share a worship resource",
  "upload.intro": "Upload a PDF, an image, or type lyrics to share.",
  "upload.tabFile": "File",
  "upload.tabLyrics": "Lyrics",
  "upload.fieldTitle": "Title",
  "upload.fieldDescription": "Description",
  "upload.optional": "(optional)",
  "upload.fieldFile": "File (PDF or image, max 8 MB)",
  "upload.fieldLyrics": "Lyrics",
  "upload.lyricsPlaceholder":
    "Paste or type the lyrics here. Each line will be treated as its own line in the scrolling viewer.",
  "upload.cancel": "Cancel",
  "upload.submit": "Share",
  "upload.submitting": "Saving…",

  "preview.back": "← All resources",
  "preview.zoomIn": "Zoom in",
  "preview.zoomOut": "Zoom out",
  "preview.reset": "Reset",
  "preview.open": "Open original",
};

const KO: Record<keyof typeof EN, string> = {
  "nav.prayers": "기도제목",
  "nav.worship": "찬양",
  "nav.admin": "관리자",
  "nav.signIn": "로그인",
  "nav.join": "회원가입",
  "nav.hi": "안녕하세요,",
  "nav.settings": "설정",
  "nav.language": "언어",
  "nav.adminSignIn": "관리자 로그인",

  "home.tagline": "QLD 청년 KOSTA",
  "home.heroA": "함께",
  "home.heroPray": "기도하고",
  "home.heroEncourage": "격려하고",
  "home.heroWorship": "찬양하는",
  "home.heroAnd": ",",
  "home.heroTogether": "따뜻한 공간.",
  "home.subtitle":
    "기도제목을 나누고, 서로를 세워주며, 이번 주 마음에 와닿은 찬양을 전해주세요.",
  "home.readPrayers": "기도제목 읽기",
  "home.sharePrayer": "기도제목 나누기",
  "home.latestPrayers": "최근 기도제목",
  "home.latestPrayersSub": "함께 읽고 함께 기도해요.",
  "home.seeAll": "모두 보기",
  "home.worshipResources": "찬양",
  "home.worshipResourcesSub": "공동체가 나눈 찬양 가사와 파일들.",
  "home.browseAll": "모두 보기",
  "home.noPrayers": "아직 기도제목이 없어요.",
  "home.beFirst": "가장 먼저 나눠주세요.",
  "home.noResources": "아직 올라온 자료가 없어요.",

  "qr.title": "QR 스캔하기",
  "qr.body":
    "휴대폰 카메라로 이 코드를 찍고 링크를 눌러 기도제목을 나누거나 찬양 자료를 살펴보세요.",

  "prayers.title": "기도제목",
  "prayers.subtitle":
    "여기에 있는 모든 노트는 관리자의 승인을 받았어요. 기도 후에 '기도했어요'를 눌러주시거나, 하트로 마음을 전해주세요.",
  "prayers.share": "+ 기도제목 나누기",
  "prayers.empty": "아직 승인된 기도제목이 없어요. 가장 먼저 나눠주세요.",
  "prayers.shareFirst": "첫 기도제목 나누기",
  "prayers.iPrayed": "기도했어요",
  "prayers.prayed": "기도함",
  "prayers.anon": "익명 · Anon",

  "prayerForm.title": "기도제목 나누기",
  "prayerForm.intro":
    "기도제목을 나누는데 계정이 필요하지 않아요. 이름을 쓰거나 익명으로 남길 수 있고, 관리자의 확인 후 공개돼요.",
  "prayerForm.fieldTitle": "제목",
  "prayerForm.titlePlaceholder": "예: 가족 문제를 위한 기도",
  "prayerForm.fieldContent": "어떤 기도가 필요하신가요?",
  "prayerForm.contentPlaceholder": "편하게 나누고 싶은 만큼 적어주세요.",
  "prayerForm.fieldName": "이름 (선택)",
  "prayerForm.namePlaceholder": "예: 한나",
  "prayerForm.anonLabel": "익명으로 올리기 (다음으로 표시돼요:",
  "prayerForm.cancel": "취소",
  "prayerForm.submit": "승인 요청",
  "prayerForm.submitting": "보내는 중…",
  "prayerForm.thanks": "고마워요 🙏",
  "prayerForm.thanksBody":
    "기도제목이 접수되었고, 관리자의 확인을 기다리고 있어요. 승인되면 공개로 표시돼요.",
  "prayerForm.another": "하나 더 나누기",
  "prayerForm.back": "기도제목으로 돌아가기",

  "resources.title": "찬양 자료",
  "resources.subtitle":
    "가사, 악보, 이미지, 직접 적은 가사까지 — 공동체가 나눈 자료들이에요.",
  "resources.upload": "+ 자료 올리기",
  "resources.signInToUpload": "올리려면 로그인",
  "resources.empty": "아직 올라온 자료가 없어요.",
  "resources.preview": "미리보기",
  "resources.openPdf": "PDF 열기",
  "resources.viewFull": "크게 보기",
  "resources.viewLyrics": "가사 보기",
  "resources.sharedBy": "올린 사람",
  "resources.remove": "삭제",

  "upload.title": "찬양 자료 나누기",
  "upload.intro": "PDF, 이미지를 올리거나 가사를 직접 적어 나눌 수 있어요.",
  "upload.tabFile": "파일",
  "upload.tabLyrics": "가사",
  "upload.fieldTitle": "제목",
  "upload.fieldDescription": "설명",
  "upload.optional": "(선택)",
  "upload.fieldFile": "파일 (PDF 또는 이미지, 최대 8 MB)",
  "upload.fieldLyrics": "가사",
  "upload.lyricsPlaceholder":
    "가사를 붙여넣거나 직접 적어주세요. 각 줄은 스크롤 뷰어에서 한 줄로 표시돼요.",
  "upload.cancel": "취소",
  "upload.submit": "나누기",
  "upload.submitting": "저장 중…",

  "preview.back": "← 모든 자료",
  "preview.zoomIn": "확대",
  "preview.zoomOut": "축소",
  "preview.reset": "원래대로",
  "preview.open": "원본 열기",
};

export const fullDict = { en: EN, ko: KO };
export type Key = keyof typeof EN;

export function t(key: Key, lang: Lang): string {
  return lang === "ko" ? KO[key] : EN[key];
}
