// English Comments:
// Get references to all necessary DOM elements
const imageUpload = document.getElementById('imageUpload');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreviewGrid = document.getElementById('imagePreviewGrid');
const statusArea = document.getElementById('statusArea');
const loadingSpinner = document.getElementById('loadingSpinner');
const statusMessage = document.getElementById('statusMessage');
const identifiedItemsContainer = document.getElementById('identifiedItemsContainer');
const identifiedItemsText = document.getElementById('identifiedItemsText');
const aiPriceSuggestionContainer = document.getElementById('aiPriceSuggestionContainer');
const aiPriceSuggestionText = document.getElementById('aiPriceSuggestionText');
const adContainer = document.getElementById('adContainer');
const adTitleInput = document.getElementById('adTitle');
const adBodyTextarea = document.getElementById('adBody');
const copyAdButton = document.getElementById('copyAdButton');
const regenerateAdCreativeBtn = document.getElementById('regenerateAdCreativeBtn');
const toastNotification = document.getElementById('toastNotification');
const previousAdVersionBtn = document.getElementById('previousAdVersionBtn');
const nextAdVersionBtn = document.getElementById('nextAdVersionBtn');
const adVersionInfo = document.getElementById('adVersionInfo');
const suggestTitlesBtn = document.getElementById('suggestTitlesBtn');
const alternativeTitlesContainer = document.getElementById('alternativeTitlesContainer');
const alternativeTitlesList = document.getElementById('alternativeTitlesList');
const suggestKeywordsBtn = document.getElementById('suggestKeywordsBtn');
const keywordsContainer = document.getElementById('keywordsContainer');
const keywordsText = document.getElementById('keywordsText');

// Settings Modal Elements
const menuIcon = document.getElementById('menuIcon');
const settingsModalOverlay = document.getElementById('settingsModalOverlay');
const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
const modalLangDeBtn = document.getElementById('modal-lang-de');
const modalLangEnBtn = document.getElementById('modal-lang-en');
const modalLangViBtn = document.getElementById('modal-lang-vi');

// AI Content Language Buttons
const aiContentLangDeBtn = document.getElementById('aiContentLang-de');
const aiContentLangEnBtn = document.getElementById('aiContentLang-en');
const aiContentLangViBtn = document.getElementById('aiContentLang-vi');

// Global variables
let base64ImageObjects = []; // Stores {mimeType, data} for uploaded images
let currentIdentifiedItems = ""; // Stores the text description of identified items
const MAX_IMAGES = 5; // Maximum number of images allowed for upload


let adHistory = []; // Stores generated ad versions {title, body}
let currentAdHistoryIndex = -1; // Index for the currently displayed ad in history
let currentAppLanguage = 'de'; // Default UI language
let currentAiContentLanguage = 'de'; // Default language for AI-generated content

// --- Translations Object ---
// This object holds all UI strings for different languages.
// Prompts for the AI are also included here and will be selected based on currentAiContentLanguage.
const translations = {
    "de": {
        "menuLabel": "Menü",
        "settingsTitle": "Einstellungen",
        "closeBtn": "Schließen",
        "appLangLabel": "App-Sprache:",
        "appTitle": "📸 eBay Kleinanzeigen Helfer AI",
        "appSubtitle": "Mehrere Fotos hochladen, Dinge erkennen & Preis vorschlagen lassen! (via Google Gemini)",
        "uploadLabel": "1. Bilder hochladen (bis zu 5; bevorzugt: PNG, JPG, WEBP, GIF):",
        "imagePreviewTitle": "Vorschau der Bilder:",
        "identifiedItemsTitle": "🔍 Erkannte Gegenstände (aus allen Bildern):",
        "priceSuggestionTitle": "💰 KI Preisvorschlag (basierend auf Analyse):",
        "priceSuggestionDisclaimer": "Dies ist ein Schätzwert basierend auf KI-Analyse und simuliertem Vergleich.",
        "aiContentLangLabel": "Sprache für KI-generierten Inhalt:",
        "generatedAdTitle": "📝 Generierte eBay Kleinanzeige:",
        "adFieldTitle": "Titel:",
        "suggestTitlesBtn": "✨ Andere Titelideen",
        "alternativeTitlesHeader": "Alternative Titelvorschläge:",
        "adFieldBody": "Anzeigentext:",
        "prevVersionBtn": "< Vorherige",
        "versionInfoBase": "Version",
        "nextVersionBtn": "Nächste >",
        "copyAdBtn": "Anzeige kopieren",
        "newCreativeBtn": "✨ Neue kreative Version",
        "suggestKeywordsBtn": "✨ Keywords & Hashtags vorschlagen",
        "keywordsTitle": "🔑 Vorgeschlagene Keywords & Hashtags:",
        "errorPrefix": "Fehler: ",
        "statusLoadingImages": "Lade {count} Bilder...",
        "statusIdentifyingItems": "Analysiere {count} Bilder...",
        "statusItemsIdentified": "Gegenstände erkannt!",
        "statusSuggestingPrice": "Ermittle Preisvorschlag...",
        "statusPriceSuggested": "Preisvorschlag erhalten! Erstelle jetzt die Standardanzeige...",
        "statusGeneratingAd": "Erstelle eBay Kleinanzeigen Text...",
        "statusGeneratingCreativeAd": "Erstelle neue kreative Version...",
        "statusAdGenerated": "Anzeige erfolgreich generiert!",
        "statusCreativeAdGenerated": "Neue kreative Version generiert!",
        "statusSuggestingTitles": "Schlage alternative Titel vor...",
        "statusTitlesSuggested": "Alternative Titelvorschläge geladen.",
        "statusNoAlternativeTitles": "Konnte keine alternativen Titel finden.",
        "statusSuggestingKeywords": "Schlage Keywords & Hashtags vor...",
        "statusKeywordsSuggested": "Keywords & Hashtags vorgeschlagen.",
        "toastAdCopied": "Anzeige & Infos kopiert!",
        "toastCopyFailed": "Kopieren fehlgeschlagen.",
        "toastTitleUpdated": "Titel aktualisiert!",
        "toastAiLangChanged": "Sprache für KI-Inhalt geändert. Standardanzeige wird neu generiert...",
        "toastAiLangNoItems": "Sprache für KI-Inhalt für zukünftige Anzeigen geändert.",
        "errorMaxImages": "Bitte maximal {max} Bilder auswählen.",
        "errorReadingFile": "Fehler beim Lesen von Datei {fileName}: {errorMessage}",
        "errorNoImagesToAnalyze": "Keine Bilder zum Analysieren vorhanden.",
        "errorImageIdentification": "Ein Fehler ist bei der Bilderkennung aufgetreten.",
        "errorNoItemsForPrice": "Keine (oder fehlerhafte) Gegenstandserkennung für Preisvorschlag vorhanden.",
        "errorPriceSuggestionFailed": "Preisvorschlag fehlgeschlagen.",
        "errorPriceSuggestionNotPossible": "Preisvorschlag nicht möglich ohne klare Gegenstandserkennung.",
        "errorNoItemsForAd": "Keine gültigen Gegenstände für Anzeigenerstellung identifiziert.",
        "errorAdGeneration": "Ein Fehler ist bei der Anzeigenerstellung aufgetreten.",
        "errorEmptyAdResponse": "KI konnte keine Anzeige erstellen (leere Antwort).",
        "errorEmptyCreativeAdResponse": "KI konnte keine neue kreative Version erstellen (leere Antwort). Bestehende Anzeige wird beibehalten.",
        "errorSimilarCreativeAd": "KI hat eine ähnliche kreative Version generiert. Aktuelle Anzeige bleibt bestehen.",
        "errorAdFormat": "Anzeige generiert (Formatierungsfehler).",
        "errorAdFormatCreative": "Formatierungsfehler bei kreativer Version. Bestehende Anzeige wird beibehalten.",
        "errorSuggestingTitles": "Fehler beim Vorschlagen alternativer Titel.",
        "errorSuggestingKeywords": "Fehler beim Vorschlagen von Keywords/Hashtags.",
        "errorNoAdForTitles": "Es muss zuerst eine Standardanzeige generiert werden, um Titel vorzuschlagen.",
        "errorNoAdForKeywords": "Es muss zuerst eine Anzeige generiert werden, um Keywords vorzuschlagen.",
        "errorNoAdContentForKeywords": "Aktuelle Anzeige hat keinen Titel oder Text für Keyword-Vorschläge.",
        "errorApiKeyMissing": "Bitte zuerst den Google API Key im Skript eintragen.",
        "genericAdItems": "Diverse Artikel (Details siehe Bilder)",
        "langName": "Deutsch",
        "promptIdentifyItems": "Identifiziere die folgenden verkaufbaren Gegenstände in den Bildern und liste sie auf. Erstelle eine einzige, kohärente Liste oder Beschreibung auf Deutsch. Beispiel: 'Ein rotes Fahrrad, ein gebrauchter Laptop mit Maus und eine Sammlung alter Bücher'. Konzentriere dich auf die Hauptobjekte.",
        "promptSuggestPrice": "Du bist ein KI-Assistent, der dabei hilft, realistische Verkaufspreise für Artikel auf eBay Kleinanzeigen in Deutschland zu finden. Basierend auf der folgenden Beschreibung von Gegenständen: '{items}'. Angenommen, die Artikel sind in 'gutem gebrauchten Zustand'. Schlage bitte einen wettbewerbsfähigen Verkaufspreis oder eine Preisspanne in EUR vor. Wenn du Faktoren oder Details auflistest, verwende bitte Spiegelstriche (-) oder Aufzählungspunkte (.) am Zeilenanfang und vermeide Fettformatierung. Tue so, als hättest du ähnliche aktuelle Angebote auf Kleinanzeigen recherchiert. Antworte prägnant auf Deutsch.",
        "promptGenerateAd": "Du bist ein Experte für das Schreiben von Verkaufsanzeigen für eBay Kleinanzeigen in Deutschland. Basierend auf der folgenden Artikelbeschreibung: '{items}', und unter Berücksichtigung des zuvor vorgeschlagenen Preises (den du nicht explizit nennen sollst, aber der den Wert widerspiegelt), erstelle eine attraktive und informative Verkaufsanzeige auf Deutsch. Antworte AUSSCHLIESSLICH mit einem JSON-Objekt, das die Felder \"titel\" und \"anzeigentext\" enthält. Formatiere deine Antwort exakt so:\n{\n  \"titel\": \"Ein passender Titel für die Anzeige (max. 65 Zeichen) auf Deutsch\",\n  \"anzeigentext\": \"Der vollständige Anzeigentext auf Deutsch. Erwähne den Zustand. Füge einen freundlichen Call-to-Action hinzu. Erwähne keinen Preis explizit im Text.\"\n}\nArtikelbeschreibung: '{items}'",
        "promptGenerateCreativeAd": "Du bist ein Experte für das Schreiben von Verkaufsanzeigen für eBay Kleinanzeigen in Deutschland. Basierend auf der folgenden Artikelbeschreibung: '{items}', und unter Berücksichtigung des zuvor vorgeschlagenen Preises (den du nicht explizit nennen sollst, aber der den Wert widerspiegelt), erstelle eine BESONDERS KREATIVE und AUFMERKSAMKEITSERREGENDE Verkaufsanzeige auf Deutsch. Sei ruhig etwas witzig oder originell, aber bleibe seriös genug für einen Verkauf. Antworte AUSSCHLIESSLICH mit einem JSON-Objekt, das die Felder \"titel\" und \"anzeigentext\" enthält. Formatiere deine Antwort exakt so:\n{\n  \"titel\": \"Ein kreativer Titel für die Anzeige (max. 65 Zeichen) auf Deutsch\",\n  \"anzeigentext\": \"Der kreative Anzeigentext auf Deutsch. Erwähne den Zustand. Füge einen originellen Call-to-Action hinzu. Erwähne keinen Preis explizit im Text.\"\n}\nArtikelbeschreibung: '{items}'",
        "promptSuggestTitles": "Basierend auf den erkannten Artikeln: '{items}' und dem aktuellen Anzeigentitel: '{currentTitle}', schlage 3-4 alternative, prägnante und attraktive Titel (maximal 65 Zeichen pro Titel) für eine eBay Kleinanzeigen-Anzeige auf Deutsch vor. Liste nur die neuen Titel auf, jeden in einer neuen Zeile. Gib keine zusätzliche Erklärung oder Einleitung.",
        "promptSuggestKeywords": "Schlage 5-7 relevante Keywords (durch Kommas getrennt) UND 3-5 passende Hashtags (jeweils mit # beginnend und durch Leerzeichen getrennt) für eine eBay Kleinanzeigen-Anzeige auf Deutsch mit dem Titel '{title}' und der Beschreibung '{body}' vor. Formatiere die Antwort klar und deutlich, zum Beispiel so:\nKeywords: Keyword1, Keyword2, Keyword3\nHashtags: #Hashtag1 #Hashtag2"
    },
    "en": {
        "menuLabel": "Menu",
        "settingsTitle": "Settings",
        "closeBtn": "Close",
        "appLangLabel": "App Language:",
        "appTitle": "📸 eBay Classifieds Helper AI",
        "appSubtitle": "Upload multiple photos, let AI identify items & suggest a price! (via Google Gemini)",
        "uploadLabel": "1. Upload images (up to 5; preferred: PNG, JPG, WEBP, GIF):",
        "imagePreviewTitle": "Image Preview:",
        "identifiedItemsTitle": "🔍 Identified Items (from all images):",
        "priceSuggestionTitle": "💰 AI Price Suggestion (based on analysis):",
        "priceSuggestionDisclaimer": "This is an estimate based on AI analysis and simulated comparison.",
        "aiContentLangLabel": "Language for AI-generated content:",
        "generatedAdTitle": "📝 Generated eBay Classifieds Ad:",
        "adFieldTitle": "Title:",
        "suggestTitlesBtn": "✨ Suggest Titles",
        "alternativeTitlesHeader": "Alternative Title Suggestions:",
        "adFieldBody": "Ad Text:",
        "prevVersionBtn": "< Previous",
        "versionInfoBase": "Version",
        "nextVersionBtn": "Next >",
        "copyAdBtn": "Copy Ad",
        "newCreativeBtn": "✨ New Creative Version",
        "suggestKeywordsBtn": "✨ Suggest Keywords & Hashtags",
        "keywordsTitle": "🔑 Suggested Keywords & Hashtags:",
        "errorPrefix": "Error: ",
        "statusLoadingImages": "Loading {count} image(s)...",
        "statusIdentifyingItems": "Analyzing {count} image(s)...",
        "statusItemsIdentified": "Items identified!",
        "statusSuggestingPrice": "Suggesting price...",
        "statusPriceSuggested": "Price suggested! Now generating standard ad...",
        "statusGeneratingAd": "Generating eBay Classifieds ad...",
        "statusGeneratingCreativeAd": "Generating new creative version...",
        "statusAdGenerated": "Ad successfully generated!",
        "statusCreativeAdGenerated": "New creative version generated!",
        "statusSuggestingTitles": "Suggesting alternative titles...",
        "statusTitlesSuggested": "Alternative titles loaded.",
        "statusNoAlternativeTitles": "Could not find alternative titles.",
        "statusSuggestingKeywords": "Suggesting keywords & hashtags...",
        "statusKeywordsSuggested": "Keywords & hashtags suggested.",
        "toastAdCopied": "Ad & info copied to clipboard!",
        "toastCopyFailed": "Copying failed.",
        "toastTitleUpdated": "Title updated!",
        "toastAiLangChanged": "AI content language changed. Standard ad will be regenerated...",
        "toastAiLangNoItems": "AI content language changed for future ads.",
        "errorMaxImages": "Please select a maximum of {max} images.",
        "errorReadingFile": "Error reading file {fileName}: {errorMessage}",
        "errorNoImagesToAnalyze": "No images available to analyze.",
        "errorImageIdentification": "An error occurred during image identification.",
        "errorNoItemsForPrice": "No (or faulty) item identification for price suggestion.",
        "errorPriceSuggestionFailed": "Price suggestion failed.",
        "errorPriceSuggestionNotPossible": "Price suggestion not possible without clear item identification.",
        "errorNoItemsForAd": "No valid items identified for ad generation.",
        "errorAdGeneration": "An error occurred during ad generation.",
        "errorEmptyAdResponse": "AI could not create an ad (empty response).",
        "errorEmptyCreativeAdResponse": "AI could not create a new creative version (empty response). Existing ad maintained.",
        "errorSimilarCreativeAd": "AI generated a similar creative version. Current ad maintained.",
        "errorAdFormat": "Ad generated (formatting error).",
        "errorAdFormatCreative": "Formatting error in creative version. Existing ad maintained.",
        "errorSuggestingTitles": "Error suggesting alternative titles.",
        "errorSuggestingKeywords": "Error suggesting keywords/hashtags.",
        "errorNoAdForTitles": "A standard ad must be generated first to suggest titles.",
        "errorNoAdForKeywords": "An ad must be generated first to suggest keywords.",
        "errorNoAdContentForKeywords": "Current ad has no title or text for keyword suggestions.",
        "errorApiKeyMissing": "Please enter your Google API Key in the script first.",
        "genericAdItems": "Various items (see pictures)",
        "langName": "English",
        "promptIdentifyItems": "Identify the following sellable items in the images and list them. Create a single, coherent list or description in English. Example: 'A red bicycle, a used laptop with a mouse, and a collection of old books'. Focus on the main items.",
        "promptSuggestPrice": "You are an AI assistant helping to find realistic selling prices for items on eBay Kleinanzeigen in Germany. Based on the following description of items: '{items}'. Assume the items are in 'good used condition' unless the description implies otherwise. Please suggest a competitive selling price or price range in EUR. If you list factors or details, please use hyphens (-) or bullet points (.) at the beginning of the line and avoid bold formatting (e.g., no ** **). Act as if you have researched similar current listings on Kleinanzeigen. Respond concisely in English.",
        "promptGenerateAd": "You are an expert in writing sales ads for eBay Kleinanzeigen in Germany. Based on the following item description: '{items}', and considering the previously suggested price (which you should not explicitly state, but which reflects the value), create an attractive and informative sales ad in English. Respond EXCLUSIVELY with a JSON object containing the fields \"titel\" and \"anzeigentext\". Format your response exactly like this:\n{\n  \"titel\": \"A suitable title for the ad (max. 65 characters) in English\",\n  \"anzeigentext\": \"The complete ad text in English. Mention the condition. Add a friendly call to action. Do not explicitly mention a price in the text.\"\n}\nItem description: '{items}'",
        "promptGenerateCreativeAd": "You are an expert in writing sales ads for eBay Kleinanzeigen in Germany. Based on the following item description: '{items}', and considering the previously suggested price (which you should not explicitly state, but which reflects the value), create an ESPECIALLY CREATIVE and EYE-CATCHING sales ad in English. Feel free to be a bit witty or original, but remain professional enough for a sale. Respond EXCLUSIVELY with a JSON object containing the fields \"titel\" and \"anzeigentext\". Format your response exactly like this:\n{\n  \"titel\": \"A creative title for the ad (max. 65 characters) in English\",\n  \"anzeigentext\": \"The creative ad text in English. Mention the condition. Add an original call to action. Do not explicitly mention a price in the text.\"\n}\nItem description: '{items}'",
        "promptSuggestTitles": "Based on the identified items: '{items}' and the current ad title: '{currentTitle}', suggest 3-4 alternative, concise, and attractive titles (maximum 65 characters per title) for an eBay Kleinanzeigen ad in English. List only the new titles, each on a new line. Provide no additional explanation or introduction.",
        "promptSuggestKeywords": "Suggest 5-7 relevant keywords (comma-separated) AND 3-5 suitable hashtags (each starting with # and space-separated) for an eBay Kleinanzeigen ad in English with the title '{title}' and description '{body}'. Format the response clearly, for example:\nKeywords: Keyword1, Keyword2, Keyword3\nHashtags: #Hashtag1 #Hashtag2"
    },
    "vi": {
        "menuLabel": "Trình đơn",
        "settingsTitle": "Cài đặt",
        "closeBtn": "Đóng",
        "appLangLabel": "Ngôn ngữ App:",
        "appTitle": "📸 Trợ lý AI cho eBay Kleinanzeigen",
        "appSubtitle": "Tải lên nhiều ảnh, để AI nhận dạng vật phẩm & gợi ý giá! (qua Google Gemini)",
        "uploadLabel": "1. Tải lên hình ảnh (tối đa 5; ưu tiên: PNG, JPG, WEBP, GIF):",
        "imagePreviewTitle": "Xem trước hình ảnh:",
        "identifiedItemsTitle": "🔍 Các mục đã xác định (từ tất cả hình ảnh):",
        "priceSuggestionTitle": "💰 Đề xuất giá AI (dựa trên phân tích):",
        "priceSuggestionDisclaimer": "Đây là ước tính dựa trên phân tích AI và so sánh mô phỏng.",
        "aiContentLangLabel": "Ngôn ngữ cho nội dung do AI tạo:",
        "generatedAdTitle": "📝 Quảng cáo eBay Kleinanzeigen đã tạo:",
        "adFieldTitle": "Tiêu đề:",
        "suggestTitlesBtn": "✨ Ý tưởng tiêu đề khác",
        "alternativeTitlesHeader": "Đề xuất tiêu đề thay thế:",
        "adFieldBody": "Nội dung quảng cáo:",
        "prevVersionBtn": "< Trước",
        "versionInfoBase": "Phiên bản",
        "nextVersionBtn": "Tiếp >",
        "copyAdBtn": "Sao chép quảng cáo",
        "newCreativeBtn": "✨ Phiên bản sáng tạo mới",
        "suggestKeywordsBtn": "✨ Đề xuất Từ khóa & Hashtag",
        "keywordsTitle": "🔑 Từ khóa & Hashtag được đề xuất:",
        "errorPrefix": "Lỗi: ",
        "statusLoadingImages": "Đang tải {count} hình ảnh...",
        "statusIdentifyingItems": "Đang phân tích {count} hình ảnh...",
        "statusItemsIdentified": "Đã xác định các mục!",
        "statusSuggestingPrice": "Đang đề xuất giá...",
        "statusPriceSuggested": "Đã đề xuất giá! Bây giờ đang tạo quảng cáo tiêu chuẩn...",
        "statusGeneratingAd": "Đang tạo quảng cáo eBay Kleinanzeigen...",
        "statusGeneratingCreativeAd": "Đang tạo phiên bản sáng tạo mới...",
        "statusAdGenerated": "Đã tạo quảng cáo thành công!",
        "statusCreativeAdGenerated": "Đã tạo phiên bản sáng tạo mới!",
        "statusSuggestingTitles": "Đang đề xuất tiêu đề thay thế...",
        "statusTitlesSuggested": "Đã tải đề xuất tiêu đề thay thế.",
        "statusNoAlternativeTitles": "Không tìm thấy tiêu đề thay thế.",
        "statusSuggestingKeywords": "Đang đề xuất từ khóa & hashtag...",
        "statusKeywordsSuggested": "Đã đề xuất từ khóa & hashtag.",
        "toastAdCopied": "Đã sao chép quảng cáo & thông tin vào bộ nhớ tạm!",
        "toastCopyFailed": "Sao chép thất bại.",
        "toastTitleUpdated": "Đã cập nhật tiêu đề!",
        "toastAiLangChanged": "Ngôn ngữ nội dung AI đã thay đổi. Quảng cáo tiêu chuẩn sẽ được tạo lại...",
        "toastAiLangNoItems": "Ngôn ngữ nội dung AI đã thay đổi cho các quảng cáo trong tương lai.",
        "errorMaxImages": "Vui lòng chọn tối đa {max} hình ảnh.",
        "errorReadingFile": "Lỗi đọc tệp {fileName}: {errorMessage}",
        "errorNoImagesToAnalyze": "Không có hình ảnh để phân tích.",
        "errorImageIdentification": "Đã xảy ra lỗi trong quá trình nhận dạng hình ảnh.",
        "errorNoItemsForPrice": "Không có (hoặc lỗi) nhận dạng mục cho đề xuất giá.",
        "errorPriceSuggestionFailed": "Đề xuất giá thất bại.",
        "errorPriceSuggestionNotPossible": "Không thể đề xuất giá nếu không có nhận dạng mục rõ ràng.",
        "errorNoItemsForAd": "Không có mục hợp lệ nào được xác định để tạo quảng cáo.",
        "errorAdGeneration": "Đã xảy ra lỗi trong quá trình tạo quảng cáo.",
        "errorEmptyAdResponse": "AI không thể tạo quảng cáo (phản hồi trống).",
        "errorEmptyCreativeAdResponse": "AI không thể tạo phiên bản sáng tạo mới (phản hồi trống). Quảng cáo hiện tại được giữ lại.",
        "errorSimilarCreativeAd": "AI đã tạo một phiên bản sáng tạo tương tự. Quảng cáo hiện tại được giữ lại.",
        "errorAdFormat": "Quảng cáo đã tạo (lỗi định dạng).",
        "errorAdFormatCreative": "Lỗi định dạng trong phiên bản sáng tạo. Quảng cáo hiện tại được giữ lại.",
        "errorSuggestingTitles": "Lỗi đề xuất tiêu đề thay thế.",
        "errorSuggestingKeywords": "Lỗi đề xuất từ khóa/hashtag.",
        "errorNoAdForTitles": "Phải tạo quảng cáo tiêu chuẩn trước để đề xuất tiêu đề.",
        "errorNoAdForKeywords": "Phải tạo quảng cáo trước để đề xuất từ khóa.",
        "errorNoAdContentForKeywords": "Quảng cáo hiện tại không có tiêu đề hoặc nội dung cho đề xuất từ khóa.",
        "errorApiKeyMissing": "Vui lòng nhập Khóa API Google của bạn vào tập lệnh trước.",
        "genericAdItems": "Nhiều mặt hàng (xem chi tiết trong hình)",
        "langName": "Tiếng Việt",
        "promptIdentifyItems": "Xác định các mặt hàng có thể bán được sau đây trong hình ảnh và liệt kê chúng. Tạo một danh sách hoặc mô tả mạch lạc duy nhất bằng tiếng Việt. Ví dụ: 'Một chiếc xe đạp màu đỏ, một máy tính xách tay đã qua sử dụng với chuột và một bộ sưu tập sách cũ'. Tập trung vào các mục chính.",
        "promptSuggestPrice": "Bạn là một trợ lý AI giúp tìm giá bán thực tế cho các mặt hàng trên eBay Kleinanzeigen ở Đức. Dựa trên mô tả sau về các mặt hàng: '{items}'. Giả sử các mặt hàng ở 'tình trạng đã qua sử dụng tốt' trừ khi mô tả ngụ ý khác. Vui lòng đề xuất một mức giá hoặc khoảng giá cạnh tranh bằng EUR. Nếu bạn liệt kê các yếu tố hoặc chi tiết, vui lòng sử dụng dấu gạch ngang (-) hoặc dấu đầu dòng (.) ở đầu dòng và tránh định dạng đậm (ví dụ: không có ** **). Hãy hành động như thể bạn đã nghiên cứu các danh sách hiện tại tương tự trên Kleinanzeigen. Trả lời ngắn gọn bằng tiếng Việt.",
        "promptGenerateAd": "Bạn là chuyên gia viết quảng cáo bán hàng cho eBay Kleinanzeigen ở Đức. Dựa trên mô tả mặt hàng sau: '{items}', và xem xét giá đề xuất trước đó (mà bạn không nên nêu rõ, nhưng phản ánh giá trị), hãy tạo một quảng cáo bán hàng hấp dẫn và nhiều thông tin bằng tiếng Việt. Trả lời ĐỘC QUYỀN bằng một đối tượng JSON chứa các trường \"titel\" và \"anzeigentext\". Định dạng câu trả lời của bạn chính xác như sau:\n{\n  \"titel\": \"Một tiêu đề phù hợp cho quảng cáo (tối đa 65 ký tự) bằng tiếng Việt\",\n  \"anzeigentext\": \"Toàn bộ nội dung quảng cáo bằng tiếng Việt. Đề cập đến tình trạng. Thêm lời kêu gọi hành động thân thiện. Không đề cập rõ ràng đến giá trong văn bản.\"\n}\nMô tả mặt hàng: '{items}'",
        "promptGenerateCreativeAd": "Bạn là chuyên gia viết quảng cáo bán hàng cho eBay Kleinanzeigen ở Đức. Dựa trên mô tả mặt hàng sau: '{items}', và xem xét giá đề xuất trước đó (mà bạn không nên nêu rõ, nhưng phản ánh giá trị), hãy tạo một quảng cáo bán hàng ĐẶC BIỆT SÁNG TẠO và THU HÚT SỰ CHÚ Ý bằng tiếng Việt. Hãy thoải mái hài hước hoặc độc đáo một chút, nhưng vẫn đủ nghiêm túc để bán hàng. Trả lời ĐỘC QUYỀN bằng một đối tượng JSON chứa các trường \"titel\" và \"anzeigentext\". Định dạng câu trả lời của bạn chính xác như sau:\n{\n  \"titel\": \"Một tiêu đề sáng tạo cho quảng cáo (tối đa 65 ký tự) bằng tiếng Việt\",\n  \"anzeigentext\": \"Nội dung quảng cáo sáng tạo bằng tiếng Việt. Đề cập đến tình trạng. Thêm lời kêu gọi hành động độc đáo. Không đề cập rõ ràng đến giá trong văn bản.\"\n}\nMô tả mặt hàng: '{items}'",
        "promptSuggestTitles": "Dựa trên các mục đã xác định: '{items}' và tiêu đề quảng cáo hiện tại: '{currentTitle}', đề xuất 3-4 tiêu đề thay thế, ngắn gọn và hấp dẫn (tối đa 65 ký tự mỗi tiêu đề) cho quảng cáo eBay Kleinanzeigen bằng tiếng Việt. Chỉ liệt kê các tiêu đề mới, mỗi tiêu đề trên một dòng mới. Không cung cấp giải thích hoặc giới thiệu bổ sung.",
        "promptSuggestKeywords": "Đề xuất 5-7 từ khóa liên quan (phân tách bằng dấu phẩy) VÀ 3-5 hashtag phù hợp (mỗi hashtag bắt đầu bằng # và phân tách bằng dấu cách) cho quảng cáo eBay Kleinanzeigen bằng tiếng Việt với tiêu đề '{title}' và mô tả '{body}'. Định dạng câu trả lời rõ ràng, ví dụ:\nKeywords: Keyword1, Keyword2, Keyword3\nHashtags: #Hashtag1 #Hashtag2"
        }
    };


    // --- Language Switching Logic ---
    // Function to set the application's UI language
    function setAppLanguage(lang) {
        if (!translations[lang]) {
            console.error("App language not supported:", lang);
            return;
        }
        currentAppLanguage = lang;
        document.documentElement.lang = lang; 
        localStorage.setItem('appLanguage', lang);

        // Translate all elements with data-translate-key attribute
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.getAttribute('data-translate-key');
            if (translations[lang][key]) {
                if (el.id === 'adVersionInfo' && key === 'versionInfoBase') { 
                    const versionText = `${translations[lang][key]} ${currentAdHistoryIndex + 1}/${adHistory.length || 0}`;
                    el.textContent = versionText;
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Update active button style for app language in modal
        [modalLangDeBtn, modalLangEnBtn, modalLangViBtn].forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `modal-lang-${lang}`) {
                btn.classList.add('active');
            }
        });
        console.log("App language set to:", lang);
        
        // If items were already identified and price suggested, re-fetch them in the new app language.
        // Ad content (title, body) itself remains in its originally generated AI Content Language.
        if (currentIdentifiedItems && !identifiedItemsContainer.classList.contains('hidden')) {
            identifyItemsFromMultipleImages(); 
        }
    }

    // Function to set the language for AI-generated content (ad title, body, suggestions)
    function setAiContentLanguage(lang) {
        if (!translations[lang]) { 
            console.error("AI Content language not supported:", lang);
            return;
        }
        const previousAiContentLanguage = currentAiContentLanguage;
        currentAiContentLanguage = lang;
        localStorage.setItem('aiContentLanguage', lang);

        // Update active button style for AI content language
        [aiContentLangDeBtn, aiContentLangEnBtn, aiContentLangViBtn].forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `aiContentLang-${lang}`) {
                btn.classList.add('active');
            }
        });
        console.log("AI Content language set to:", lang);

        // If items are already identified and an ad history exists,
        // and the AI content language has actually changed,
        // clear ad history and regenerate the standard ad in the new AI content language.
        if (currentIdentifiedItems && adHistory.length > 0 && lang !== previousAiContentLanguage) {
            showToast("toastAiLangChanged"); 
            adHistory = []; 
            currentAdHistoryIndex = -1;
            adTitleInput.value = "";
            adBodyTextarea.value = "";
            alternativeTitlesContainer.classList.add('hidden');
            alternativeTitlesList.innerHTML = '';
            keywordsContainer.classList.add('hidden');
            keywordsText.innerHTML = '';
            updateAdNavigationButtons();
            generateEbayAd(currentIdentifiedItems, false); 
        } else if (currentIdentifiedItems && lang !== previousAiContentLanguage) {
             showToast("toastAiLangNoItems"); 
        }
    }

    // Settings Modal Logic
    menuIcon.addEventListener('click', () => {
        settingsModalOverlay.classList.add('active');
    });
    closeSettingsModalBtn.addEventListener('click', () => {
        settingsModalOverlay.classList.remove('active');
    });
    settingsModalOverlay.addEventListener('click', (event) => { 
        if (event.target === settingsModalOverlay) {
            settingsModalOverlay.classList.remove('active');
        }
    });

    // Event listeners for app language buttons in modal
    modalLangDeBtn.addEventListener('click', () => setAppLanguage('de'));
    modalLangEnBtn.addEventListener('click', () => setAppLanguage('en'));
    modalLangViBtn.addEventListener('click', () => setAppLanguage('vi'));

    // Event listeners for AI content language buttons
    aiContentLangDeBtn.addEventListener('click', () => setAiContentLanguage('de'));
    aiContentLangEnBtn.addEventListener('click', () => setAiContentLanguage('en'));
    aiContentLangViBtn.addEventListener('click', () => setAiContentLanguage('vi'));

    // Load saved languages or set defaults on page load
    document.addEventListener('DOMContentLoaded', () => {
        const savedAppLang = localStorage.getItem('appLanguage');
        if (savedAppLang && translations[savedAppLang]) {
            setAppLanguage(savedAppLang);
        } else {
            setAppLanguage('de'); 
        }

        const savedAiContentLang = localStorage.getItem('aiContentLanguage');
        if (savedAiContentLang && translations[savedAiContentLang]) {
            setAiContentLanguage(savedAiContentLang);
        } else {
            setAiContentLanguage(currentAppLanguage); // Default AI content lang to app lang initially
        }
    });


    // --- Core App Logic (adapted for language) ---
    // Handles image file selection
    imageUpload.addEventListener('change', async (event) => {
        if (GOOGLE_API_KEY === "YOUR_GOOGLE_API_KEY") { 
             showError(translations[currentAppLanguage].errorApiKeyMissing);
             return;
        }
        resetUIForNewImage();
        const files = event.target.files;

        if (files.length === 0) return;
        if (files.length > MAX_IMAGES) {
            showError(translations[currentAppLanguage].errorMaxImages.replace('{max}', MAX_IMAGES));
            imageUpload.value = ""; 
            return;
        }

        showLoading(translations[currentAppLanguage].statusLoadingImages.replace('{count}', files.length), "initial");
        base64ImageObjects = [];
        imagePreviewGrid.innerHTML = ''; 

        let filesProcessed = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const dataUrl = await readFileAsDataURL(file);
                const { mimeType, data } = extractBase64Data(dataUrl);
                if (!mimeType || !data) {
                    throw new Error("Ungültiges Bildformat oder Fehler beim Extrahieren der Daten."); // Should be translated or use a key
                }
                base64ImageObjects.push({ mimeType, data }); 

                const imgElement = document.createElement('img');
                imgElement.src = dataUrl; 
                imgElement.alt = `Vorschau ${i + 1}`;
                imgElement.classList.add('image-preview-item');
                imagePreviewGrid.appendChild(imgElement);
                
                filesProcessed++;
                if (filesProcessed === files.length) {
                    imagePreviewContainer.classList.remove('hidden');
                    hideLoading(); 
                    identifyItemsFromMultipleImages();
                }
            } catch (error) {
                console.error("Fehler beim Lesen der Datei:", error);
                showError(translations[currentAppLanguage].errorReadingFile.replace('{fileName}', file.name).replace('{errorMessage}', error.message));
                if (filesProcessed === files.length && base64ImageObjects.length > 0) {
                     identifyItemsFromMultipleImages(); 
                } else if (base64ImageObjects.length === 0) {
                    hideLoading(); 
                }
                return; 
            }
        }
    });

    // Reads a file and returns its Data URL representation
    function readFileAsDataURL(file) { 
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Extracts MIME type and base64 data from a Data URL
    function extractBase64Data(dataUrl) { 
         const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
        if (match && match.length === 3) {
            return { mimeType: match[1], data: match[2] };
        }
        return { mimeType: null, data: null }; 
    }

    // Resets the UI to its initial state when new images are uploaded or language changes significantly
    function resetUIForNewImage() { 
        imagePreviewContainer.classList.add('hidden');
        imagePreviewGrid.innerHTML = '';
        identifiedItemsContainer.classList.add('hidden');
        aiPriceSuggestionContainer.classList.add('hidden'); 
        adContainer.classList.add('hidden');
        alternativeTitlesContainer.classList.add('hidden');
        alternativeTitlesList.innerHTML = '';
        keywordsContainer.classList.add('hidden');
        keywordsText.innerHTML = '';
        
        statusMessage.textContent = '';
        statusMessage.classList.remove('text-red-500');
        loadingSpinner.classList.add('hidden');
        
        base64ImageObjects = [];
        currentIdentifiedItems = "";
        adHistory = [];
        currentAdHistoryIndex = -1;
        updateAdNavigationButtons(); 
    }

    // Shows a loading message and spinner
    function showLoading(message, stage = "initial") { 
        statusMessage.textContent = message;
        statusMessage.classList.remove('text-red-500');
        loadingSpinner.classList.remove('hidden');

        if (stage === "initial") {
            identifiedItemsContainer.classList.add('hidden');
            aiPriceSuggestionContainer.classList.add('hidden');
            adContainer.classList.add('hidden');
            alternativeTitlesContainer.classList.add('hidden');
            keywordsContainer.classList.add('hidden');
        } else if (stage === "price") {
            aiPriceSuggestionContainer.classList.add('hidden');
            adContainer.classList.add('hidden');
            alternativeTitlesContainer.classList.add('hidden');
            keywordsContainer.classList.add('hidden');
        } else if (stage === "ad_creative" || stage === "titles" || stage === "keywords") { 
            // For these stages, we don't hide already displayed content like the ad itself
        } else if (stage === "ad") { 
            adContainer.classList.add('hidden'); 
            alternativeTitlesContainer.classList.add('hidden');
            keywordsContainer.classList.add('hidden');
        }
    }

    // Hides the loading spinner
    function hideLoading() { 
        loadingSpinner.classList.add('hidden');
    }

    // Displays an error message
    function showError(message) { 
        let displayMessage = `${translations[currentAppLanguage].errorPrefix}${message}`;
         // Append more specific advice based on error content
         if (message && message.toLowerCase().includes("internal server error")) {
            displayMessage += "\nDies ist oft ein serverseitiges Problem beim API Anbieter. Bitte versuchen Sie es später erneut oder überprüfen Sie Ihren API-Schlüssel und den API-Status.";
        } else if (message && (message.toLowerCase().includes("api key") || message.toLowerCase().includes("api-schlüssel") || message.toLowerCase().includes("authentication") || message.toLowerCase().includes("unauthorized"))) {
            displayMessage += "\nBitte überprüfen Sie Ihren API-Schlüssel im Skript.";
        } else if (message && (message.toLowerCase().includes("unsupported image") || message.toLowerCase().includes("invalid_image_format") || message.toLowerCase().includes("invalid image format"))) {
            displayMessage += "\nDas Bildformat wird vom aktuellen KI-Modell möglicherweise nicht unterstützt oder konnte nicht verarbeitet werden. Versuchen Sie gängige Formate wie PNG, JPEG, WEBP oder GIF.";
        }
        statusMessage.textContent = displayMessage;
        statusMessage.classList.add('text-red-500');
        loadingSpinner.classList.add('hidden');
    }

    // Shows a short-lived toast notification
    function showToast(messageKey) { 
        toastNotification.textContent = translations[currentAppLanguage][messageKey] || messageKey;
        toastNotification.classList.add('show');
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 3000);
    }

    // Makes a call to the Google Gemini API
    async function callGoogleGeminiAPI(payloadContents, model = GOOGLE_GEMINI_MODEL, expectJson = false) { 
        if (GOOGLE_API_KEY === "YOUR_GOOGLE_API_KEY") {
             throw new Error("Google API Key nicht konfiguriert."); // This should be translated if shown to user directly
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_API_KEY}`;
        const payload = { contents: payloadContents };
        if (expectJson) {
            payload.generationConfig = { responseMimeType: "application/json" };
        }
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorResult = await response.json();
                console.error("Google Gemini API Error Response:", errorResult);
                throw new Error(errorResult.error?.message || `API-Anfrage fehlgeschlagen mit Status ${response.status}`);
            }
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else {
                if (result.candidates && result.candidates.length > 0 && result.candidates[0].finishReason === "SAFETY") {
                    console.warn("Google Gemini API: Content blocked due to safety ratings.", result.candidates[0].safetyRatings);
                    throw new Error("Inhalt aufgrund von Sicherheitsrichtlinien blockiert."); // Translate this
                }
                console.error("Unerwartete Google Gemini API-Antwortstruktur:", result);
                throw new Error("Unerwartete Antwortstruktur von Google Gemini erhalten."); // Translate this
            }
        } catch (error) {
            console.error("Fehler beim Aufruf der Google Gemini API:", error);
            throw error;
        }
    }

    // Identifies items from the uploaded images using the AI
    async function identifyItemsFromMultipleImages() {
        if (base64ImageObjects.length === 0) {
            showError(translations[currentAppLanguage].errorNoImagesToAnalyze);
            return;
        }
        showLoading(translations[currentAppLanguage].statusIdentifyingItems.replace('{count}', base64ImageObjects.length), "initial");

        // Use currentAppLanguage for the item identification prompt language
        const parts = [{ text: translations[currentAppLanguage].promptIdentifyItems }]; 
        base64ImageObjects.forEach(imgObj => { 
            parts.push({ inlineData: { mimeType: imgObj.mimeType, data: imgObj.data } });
        });
        const payloadContents = [{ role: "user", parts: parts }];

        try {
            const identifiedText = await callGoogleGeminiAPI(payloadContents, GOOGLE_GEMINI_MODEL); 
            if (!identifiedText || identifiedText.trim() === "") {
                // This message is internal, use a key if it needs to be shown directly
                currentIdentifiedItems = "Konnte keine spezifischen Gegenstände identifizieren. Bitte versuchen Sie es mit anderen Bildern oder einer genaueren Beschreibung."; 
            } else {
                currentIdentifiedItems = identifiedText;
            }
            identifiedItemsText.textContent = currentIdentifiedItems; 
            identifiedItemsContainer.classList.remove('hidden');
            statusMessage.textContent = translations[currentAppLanguage].statusItemsIdentified;
            hideLoading();
            suggestPriceForIdentifiedItems(); 
        } catch (error) {
            showError(error.message || translations[currentAppLanguage].errorImageIdentification);
            currentIdentifiedItems = translations[currentAppLanguage].errorImageIdentification; 
            identifiedItemsText.textContent = currentIdentifiedItems;
            identifiedItemsContainer.classList.remove('hidden'); 
            hideLoading();
        }
    }

    // Suggests a price for the identified items using the AI
    async function suggestPriceForIdentifiedItems() {
        if (!currentIdentifiedItems || currentIdentifiedItems.includes(translations[currentAppLanguage].errorImageIdentification.split(": ")[1]) || currentIdentifiedItems.includes("Konnte keine spezifischen Gegenstände identifizieren")) {
            showError(translations[currentAppLanguage].errorNoItemsForPrice);
            aiPriceSuggestionText.textContent = translations[currentAppLanguage].errorPriceSuggestionNotPossible;
            aiPriceSuggestionContainer.classList.remove('hidden');
            generateEbayAd(translations[currentAppLanguage].genericAdItems, false); 
            return;
        }
        showLoading(translations[currentAppLanguage].statusSuggestingPrice, "price");
        aiPriceSuggestionContainer.classList.add('hidden'); 

        // Use currentAppLanguage for the price suggestion prompt language
        const prompt = translations[currentAppLanguage].promptSuggestPrice.replace('{items}', currentIdentifiedItems); 
        const payloadContents = [{ role: "user", parts: [{text: prompt}] }];

        try {
            const suggestedPrice = await callGoogleGeminiAPI(payloadContents, GOOGLE_GEMINI_MODEL); 
            aiPriceSuggestionText.textContent = suggestedPrice; 
            aiPriceSuggestionContainer.classList.remove('hidden');
            statusMessage.textContent = translations[currentAppLanguage].statusPriceSuggested;
            hideLoading();
            // Generate ad using the currentAiContentLanguage
            generateEbayAd(currentIdentifiedItems, false); 
        } catch (error) {
            showError(error.message || translations[currentAppLanguage].errorPriceSuggestionFailed);
            aiPriceSuggestionText.textContent = "Preisvorschlag konnte nicht ermittelt werden."; 
            aiPriceSuggestionContainer.classList.remove('hidden'); 
            hideLoading();
            if (currentIdentifiedItems) { 
                statusMessage.textContent = translations[currentAppLanguage].errorPriceSuggestionFailed + " " + translations[currentAppLanguage].statusGeneratingAd.split("...")[1]; 
                generateEbayAd(currentIdentifiedItems, false);
            }
        }
    }

    // Displays an ad from the adHistory based on currentAdHistoryIndex
    function displayAdFromHistory() { 
        if (currentAdHistoryIndex >= 0 && currentAdHistoryIndex < adHistory.length) {
            const ad = adHistory[currentAdHistoryIndex];
            adTitleInput.value = ad.title;
            adBodyTextarea.value = ad.body;
            adContainer.classList.remove('hidden'); 
        } else if (adHistory.length === 0) { 
            adTitleInput.value = "";
            adBodyTextarea.value = "";
        }
        updateAdNavigationButtons();
    }

    // Updates the state and text of ad navigation buttons
    function updateAdNavigationButtons() { 
        const baseText = translations[currentAppLanguage].versionInfoBase || "Version";
        if (adHistory.length === 0) {
            adVersionInfo.textContent = `${baseText} 0/0`;
        } else {
            adVersionInfo.textContent = `${baseText} ${currentAdHistoryIndex + 1}/${adHistory.length}`;
        }
        previousAdVersionBtn.disabled = currentAdHistoryIndex <= 0;
        nextAdVersionBtn.disabled = currentAdHistoryIndex >= adHistory.length - 1;
    }
    
    // Cleans the JSON string received from AI, removing markdown code blocks
    function cleanJsonString(str) { 
        console.log("Original adJsonText from API:", str);
        let cleanedStr = str.trim();
        const jsonRegex = /```(?:json)?\s*([\s\S]+?)\s*```/;
        const match = cleanedStr.match(jsonRegex);

        if (match && match[1]) {
            cleanedStr = match[1].trim();
        }
        console.log("Cleaned adJsonText for parsing:", cleanedStr);
        return cleanedStr;
    }

    // Generates an eBay ad (standard or creative) using the AI
    async function generateEbayAd(items, creative = false) {
        if (!items || items.trim() === "" || items.includes(translations[currentAppLanguage].errorImageIdentification.split(": ")[1]) || items.includes("Konnte keine spezifischen Gegenstände identifizieren")) {
            showError(translations[currentAppLanguage].errorNoItemsForAd);
            adTitleInput.value = translations[currentAppLanguage].errorPrefix + "Keine Artikelbeschreibung";
            adBodyTextarea.value = "Bitte laden Sie Bilder hoch, damit Artikel erkannt und eine Anzeige erstellt werden kann.";
            adContainer.classList.remove('hidden');
            updateAdNavigationButtons();
            return;
        }

        showLoading(creative ? translations[currentAppLanguage].statusGeneratingCreativeAd : translations[currentAppLanguage].statusGeneratingAd, creative ? "ad_creative" : "ad");

        let promptKey = creative ? "promptGenerateCreativeAd" : "promptGenerateAd";
        // Use currentAiContentLanguage for the ad generation prompts
        let prompt = translations[currentAiContentLanguage][promptKey].replace('{items}', items); 
        
        const payloadContents = [{ role: "user", parts: [{text: prompt}] }];

        try {
            let adJsonText = await callGoogleGeminiAPI(payloadContents, GOOGLE_GEMINI_MODEL, true); 
            console.log("[DEBUG] Raw response for ad generation:", adJsonText);
            adJsonText = cleanJsonString(adJsonText); 
            console.log("[DEBUG] Cleaned response for ad generation:", adJsonText);

            try { 
                let parsedObject = JSON.parse(adJsonText);
                let adObjectToUse = parsedObject;

                if (Array.isArray(parsedObject) && parsedObject.length > 0) {
                    console.log("[DEBUG] API returned an array of ads, using the first one.");
                    adObjectToUse = parsedObject[0]; 
                } else if (Array.isArray(parsedObject) && parsedObject.length === 0) {
                    throw new Error("API returned an empty array for ad suggestions.");
                }
                if (typeof adObjectToUse !== 'object' || adObjectToUse === null) {
                    throw new Error("Parsed ad data is not a valid object.");
                }

                console.log("[DEBUG] Ad object to use for ad generation:", adObjectToUse);
                const newTitle = adObjectToUse.titel || ""; 
                const newBody = adObjectToUse.anzeigentext || "";

                if (newTitle.trim() === "" && newBody.trim() === "") {
                    const failMessageKey = creative ? "errorEmptyCreativeAdResponse" : "errorEmptyAdResponse";
                    statusMessage.textContent = translations[currentAppLanguage][failMessageKey];
                    console.warn("AI returned empty title and body after parsing.");
                    if (adHistory.length > 0 && currentAdHistoryIndex >= 0 && currentAdHistoryIndex < adHistory.length && adHistory[currentAdHistoryIndex]) {
                        displayAdFromHistory(); 
                    } else { 
                        adTitleInput.value = translations[currentAppLanguage].errorPrefix + "Leere Antwort von KI"; 
                        adBodyTextarea.value = "Die KI konnte keinen Titel oder Text für die Anzeige generieren."; 
                        adContainer.classList.remove('hidden'); 
                        updateAdNavigationButtons(); 
                    }
                } else { 
                    if (creative && adHistory.length > 0 && currentAdHistoryIndex === adHistory.length - 1) {
                        const lastAd = adHistory[currentAdHistoryIndex];
                        if (lastAd.title === newTitle && lastAd.body === newBody) {
                            statusMessage.textContent = translations[currentAppLanguage].errorSimilarCreativeAd;
                            console.warn("New creative ad is identical to the last one.");
                            displayAdFromHistory(); 
                            hideLoading();
                            return; 
                        }
                    }
                    
                    const newAd = {
                        title: newTitle,
                        body: newBody
                    };
                    
                    adHistory.push(newAd);
                    currentAdHistoryIndex = adHistory.length - 1;
                    displayAdFromHistory(); 
                    
                    statusMessage.textContent = creative ? translations[currentAppLanguage].statusCreativeAdGenerated : translations[currentAppLanguage].statusAdGenerated;
                }
            } catch (parseError) { 
                console.error("Fehler beim Parsen des JSON für die Anzeige:", parseError, "\nBereinigter Text:", adJsonText);
                const formatErrorMessageKey = creative ? "errorAdFormatCreative" : "errorAdFormat";
                 statusMessage.textContent = translations[currentAppLanguage][formatErrorMessageKey];
                if (adHistory.length > 0 && currentAdHistoryIndex >= 0 && currentAdHistoryIndex < adHistory.length && adHistory[currentAdHistoryIndex]) {
                    displayAdFromHistory(); 
                } else {
                    adTitleInput.value = translations[currentAppLanguage].errorPrefix + "Formatierungsfehler im Titel"; 
                    adBodyTextarea.value = "Konnte die Anzeige nicht korrekt formatieren. Rohtext:\n\n" + adJsonText; 
                    adContainer.classList.remove('hidden'); 
                    updateAdNavigationButtons(); 
                }
            }
        } catch (error) { 
            const apiErrorMessage = error.message || translations[currentAppLanguage].errorAdGeneration;
            showError(creative ? apiErrorMessage + " " + translations[currentAppLanguage].errorEmptyCreativeAdResponse.split(". ")[1] : apiErrorMessage); 
            if (adHistory.length > 0 && currentAdHistoryIndex >= 0 && currentAdHistoryIndex < adHistory.length && adHistory[currentAdHistoryIndex]) {
                 displayAdFromHistory();
            } else {
                adTitleInput.value = translations[currentAppLanguage].errorPrefix + "Fehler bei Titelgenerierung"; 
                adBodyTextarea.value = translations[currentAppLanguage].errorPrefix + "Fehler bei Anzeigenerstellung: " + apiErrorMessage; 
                adContainer.classList.remove('hidden'); 
                updateAdNavigationButtons();
            }
        } finally {
            hideLoading();
        }
    }

    // --- Suggest Alternative Titles ---
    suggestTitlesBtn.addEventListener('click', async () => {
        if (!currentIdentifiedItems || currentIdentifiedItems.startsWith("Konnte keine") || currentIdentifiedItems.startsWith("Fehler bei")) {
            showError(translations[currentAppLanguage].errorNoItemsForAd.replace("Anzeigenerstellung", "Titelvorschläge"));
            return;
        }
        if (adHistory.length === 0 || currentAdHistoryIndex < 0) {
            showError(translations[currentAppLanguage].errorNoAdForTitles);
            return;
        }

        const currentAd = adHistory[currentAdHistoryIndex];
        showLoading(translations[currentAppLanguage].statusSuggestingTitles, "titles");
        alternativeTitlesList.innerHTML = ''; 
        alternativeTitlesContainer.classList.add('hidden');

        const prompt = translations[currentAiContentLanguage].promptSuggestTitles 
            .replace('{items}', currentIdentifiedItems)
            .replace('{currentTitle}', currentAd.title);
        const payloadContents = [{ role: "user", parts: [{text: prompt}] }];

        try {
            const titlesText = await callGoogleGeminiAPI(payloadContents, GOOGLE_GEMINI_MODEL);
            const titlesArray = titlesText.split('\n').map(t => t.trim()).filter(t => t.length > 0 && t.length <= 65);

            if (titlesArray.length > 0) {
                titlesArray.forEach(title => {
                    const li = document.createElement('li');
                    li.textContent = title;
                    li.classList.add('p-1', 'hover:bg-blue-100', 'cursor-pointer', 'rounded');
                    li.onclick = () => {
                        adTitleInput.value = title;
                        if (adHistory[currentAdHistoryIndex]) {
                            adHistory[currentAdHistoryIndex].title = title;
                        }
                        alternativeTitlesContainer.classList.add('hidden'); 
                        showToast("toastTitleUpdated");
                    };
                    alternativeTitlesList.appendChild(li);
                });
                alternativeTitlesContainer.classList.remove('hidden');
                statusMessage.textContent = translations[currentAppLanguage].statusTitlesSuggested;
            } else {
                statusMessage.textContent = translations[currentAppLanguage].statusNoAlternativeTitles;
            }
        } catch (error) {
            showError(error.message || translations[currentAppLanguage].errorSuggestingTitles);
        } finally {
            hideLoading();
        }
    });

    // --- Suggest Keywords & Hashtags ---
    suggestKeywordsBtn.addEventListener('click', async () => {
        if (adHistory.length === 0 || currentAdHistoryIndex < 0) {
            showError(translations[currentAppLanguage].errorNoAdForKeywords);
            return;
        }
        const currentAd = adHistory[currentAdHistoryIndex];
        if (!currentAd.title || !currentAd.body) {
             showError(translations[currentAppLanguage].errorNoAdContentForKeywords);
            return;
        }

        showLoading(translations[currentAppLanguage].statusSuggestingKeywords, "keywords");
        keywordsText.innerHTML = '';
        keywordsContainer.classList.add('hidden');

        const prompt = translations[currentAiContentLanguage].promptSuggestKeywords 
            .replace('{title}', currentAd.title)
            .replace('{body}', currentAd.body);
        const payloadContents = [{ role: "user", parts: [{text: prompt}] }];
        
        try {
            const suggestions = await callGoogleGeminiAPI(payloadContents, GOOGLE_GEMINI_MODEL);
            keywordsText.textContent = suggestions;
            keywordsContainer.classList.remove('hidden');
            statusMessage.textContent = translations[currentAppLanguage].statusKeywordsSuggested;
        } catch (error) {
            showError(error.message || translations[currentAppLanguage].errorSuggestingKeywords);
        } finally {
            hideLoading();
        }
    });
    
    // Event listener for "New Creative Version" button
    regenerateAdCreativeBtn.addEventListener('click', () => {
        if (!currentIdentifiedItems || currentIdentifiedItems.startsWith("Konnte keine") || currentIdentifiedItems.startsWith("Fehler bei")) {
            showError(translations[currentAppLanguage].errorNoItemsForAd.replace("Anzeigenerstellung", "kreative Version"));
            return;
        }
        regenerateAdCreativeBtn.disabled = true; 
        generateEbayAd(currentIdentifiedItems, true).finally(() => {
            regenerateAdCreativeBtn.disabled = false; 
        }); 
    });

    // Event listener for "Previous Version" button
    previousAdVersionBtn.addEventListener('click', () => {
        if (currentAdHistoryIndex > 0) {
            currentAdHistoryIndex--;
            displayAdFromHistory();
        }
    });

    // Event listener for "Next Version" button
    nextAdVersionBtn.addEventListener('click', () => {
        if (currentAdHistoryIndex < adHistory.length - 1) {
            currentAdHistoryIndex++;
            displayAdFromHistory();
        }
    });

    // Event listener for "Copy Ad" button
    copyAdButton.addEventListener('click', () => {
        const title = adTitleInput.value;
        const body = adBodyTextarea.value;
        const suggestedPriceInfo = aiPriceSuggestionText.textContent ? `\n\nPreisvorstellung (basierend auf KI-Analyse): ${aiPriceSuggestionText.textContent}` : "";
        const suggestedKeywords = keywordsText.textContent ? `\n\nKeywords/Hashtags:\n${keywordsText.textContent}` : "";
        const fullAdText = `Titel: ${title}\n\n${body}${suggestedPriceInfo}${suggestedKeywords}`;
        
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = fullAdText;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        try {
            const successful = document.execCommand('copy');
            showToast(successful ? "toastAdCopied" : "toastCopyFailed");
        } catch (err) {
            showToast("toastCopyFailed");
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(tempTextArea);
    });

    // Initial language setup on page load
    const savedAppLang = localStorage.getItem('appLanguage');
    if (savedAppLang && translations[savedAppLang]) {
        setAppLanguage(savedAppLang);
    } else {
        setAppLanguage('de'); 
    }
    const savedAiContentLang = localStorage.getItem('aiContentLanguage');
    if (savedAiContentLang && translations[savedAiContentLang]) {
        setAiContentLanguage(savedAiContentLang);
    } else {
        setAiContentLanguage(currentAppLanguage); // Default AI content language to current app language
    }