export interface GlossaryTerm {
  id: string;
  term: string;               // Display Hebrew term
  englishTerm?: string;       // Medical English name & abbreviation
  aliases: string[];          // Variants to match in text
  category: 'pathology' | 'anatomy' | 'diagnostics' | 'treatments' | 'medications' | 'surgery';
  categoryHebrew: string;     // Friendly category name in Hebrew
  simpleDefinition: string;   // Warm, jargon-free explanation in everyday Hebrew
  clinicalSignificance: string; // Why it matters for retinal & cataract patient care
}

export const CATEGORIES = [
  { id: 'all', label: 'כל המונחים' },
  { id: 'pathology', label: 'מחלות ופתולוגיות' },
  { id: 'anatomy', label: 'מבנה ואנטומיה' },
  { id: 'diagnostics', label: 'בדיקות והדמיה' },
  { id: 'treatments', label: 'הזרקות וטיפולים' },
  { id: 'medications', label: 'תרופות וטיפות' },
  { id: 'surgery', label: 'ניתוחים וטכנולוגיות' }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'brvo',
    term: 'חסימת סעיף וריד הרשתית',
    englishTerm: 'Branch Retinal Vein Occlusion (BRVO)',
    aliases: ['חסימת סעיף וריד הרשתית', 'חסימת סעיף וריד', 'חסימת וריד הרשתית', 'BRVO'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'בדומה לצינור ניקוז שנסתם, וריד קטן ברשתית נחסם ואינו מאפשר לדם לזרום החוצה באופן חופשי. עקב כך, הלחץ בתוך כלי הדם עולה ונוזלים מתחילים לדלוף החוצה אל תוך רקמת העין העדינה.',
    clinicalSignificance: 'זהו שורש הבעיה בעין שמאל; החסימה הובילה להצטברות נוזלים (בצקת) במרכז הראייה ולפגיעה בחדות הראייה.'
  },
  {
    id: 'cme',
    term: 'בצקת מקולרית ציסטואידית',
    englishTerm: 'Cystoid Macular Edema (CME)',
    aliases: ['בצקת מקולרית ציסטואידית', 'בצקת מקולרית ציסטית', 'בצקת מקולרית', 'CME'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'הצטברות של נוזלים בתוך "כיסים" זעירים (ציסטות) במרכז הרשתית, הגורמת לרקמה להתנפח ולהתעבות כמו ספוג ספוג במים במקום להישאר דקה ויבשה.',
    clinicalSignificance: 'הבצקת מעוותת ומטשטשת את מרכז הראייה; ככל שהרשתית מעובה יותר (מעל 280 מיקרון), הראייה פחות חדה, והיעד הטיפולי המרכזי הוא ייבוש הנוזלים הללו.'
  },
  {
    id: 'oct',
    term: 'טומוגרפיה אופטית קוהרנטית',
    englishTerm: 'Optical Coherence Tomography (OCT)',
    aliases: ['טומוגרפיה אופטית קוהרנטית', 'סריקות OCT', 'סריקת OCT', 'בדיקות OCT', 'בדיקת OCT', 'OCT'],
    category: 'diagnostics',
    categoryHebrew: 'בדיקות והדמיה',
    simpleDefinition: 'צילום לייזר מתקדם, מהיר וללא כל מגע או כאב, המספק תמונת חתך בדיוק מיקרוני של כל שכבות הרשתית – מעין "אולטרסאונד של אור" ברזולוציה גבוהה.',
    clinicalSignificance: 'הכלי המדויק ביותר למעקב: מודד בדיוק של מיקרונים בודדים האם הבצקת מתייבשת או מתגברת, ומאפשר לרופא להחליט מתי נדרשת זריקה או טיפול נוסף.'
  },
  {
    id: 'anti-vegf',
    term: 'נוגדי חלבון דלף וצמיחה',
    englishTerm: 'Anti-VEGF Therapy',
    aliases: ['נוגדי VEGF', 'נוגד VEGF', 'אנטי-VEGF', 'Anti-VEGF'],
    category: 'treatments',
    categoryHebrew: 'הזרקות וטיפולים',
    simpleDefinition: 'תרופות ביולוגיות ממוקדות המוזרקות ישירות לעין, שתפקידן ללכוד ולנטרל את החלבון שגורם לכלי הדם להיות חדירים ולדלוף נוזלים.',
    clinicalSignificance: 'זהו קו הטיפול המקובל ברשתית (כולל אבסטין, לוסנטיס ואייליאה); בעין שמאל התפתחה לאורך השנים עמידות לנוגדים אלו, מה שהצריך שילוב של סטרואידים ולייזר.'
  },
  {
    id: 'vegf',
    term: 'חלבון צמיחה וחדירות כלי דם',
    englishTerm: 'Vascular Endothelial Growth Factor (VEGF)',
    aliases: ['פקטור גדילת אנדותל', 'VEGF'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'חלבון טבעי שהגוף מייצר כאשר רקמה חשה מחסור בחמצן. בעין, חלבון זה גורם לצערנו לפריצת דפנות כלי הדם ולדליפת נוזלים מוגברת.',
    clinicalSignificance: 'הגורם הביולוגי הראשי לבצקת מקולרית לאחר חסימת וריד; נטרולו מונע המשך דלף נוזלים לתוך המקולה.'
  },
  {
    id: 'photoreceptors',
    term: 'פוטורצפטורים (קולטני אור)',
    englishTerm: 'Photoreceptors (Rods & Cones)',
    aliases: ['פוטורצפטורים', 'קולטני האור', 'קולטנים הרגישים לאור', 'קנים ומדוכים'],
    category: 'anatomy',
    categoryHebrew: 'מבנה ואנטומיה',
    simpleDefinition: 'התאים הרגישים ביותר ברשתית – מעין "פיקסלים ביולוגיים" זעירים הקולטים את קרני האור והופכים אותן לאותות חשמליים המועברים למוח כדי שנוכל לראות.',
    clinicalSignificance: 'בצקת ממושכת לוחצת על תאים אלו ומעוותת אותם; ייבוש הבצקת שומר על בריאותם ומגן על חדות הראייה לטווח הארוך.'
  },
  {
    id: 'brb',
    term: 'מחסום דם-רשתית',
    englishTerm: 'Blood-Retinal Barrier (BRB)',
    aliases: ['מחסום דם-רשתית', 'מחסום הדם-רשתית', 'Blood-Retinal Barrier', 'BRB'],
    category: 'anatomy',
    categoryHebrew: 'מבנה ואנטומיה',
    simpleDefinition: 'שכבת הגנה מיוחדת ואטומה בין זרם הדם לבין הרשתית העדינה, המבטיחה שרק חמצן ומזון חיוניים יעברו, בעוד שנוזלים עודפים יישארו מחוץ לרקמת הראייה.',
    clinicalSignificance: 'בחסימת וריד (BRVO) הלחץ הגבוה פורץ מחסום זה וגורם לדליפה; חיזוקו ושיקומו מושגים באמצעות תרופות נוגדות דלקת ונוגדי VEGF.'
  },
  {
    id: 'fovea',
    term: 'הפוביאה המרכזית',
    englishTerm: 'Fovea Centralis',
    aliases: ['הפוביאה המרכזית', 'פוביאה', 'פוביאלי', 'השקע הפוביאלי', 'Fovea Centralis', 'Fovea'],
    category: 'anatomy',
    categoryHebrew: 'מבנה ואנטומיה',
    simpleDefinition: 'השקע הקטנטן במרכז המקולה, שבו מרוכזת הצפיפות הגבוהה ביותר של תאי ראייה. זהו הנקודה המדויקת שבה נקלטת התמונה החדה ביותר.',
    clinicalSignificance: 'העובי התקין כאן הוא כ-200–240 מיקרון (כמו בעין ימין הבריאה); בעין שמאל הבצקת מחקה את השקע והביאה לעובי של מעל 500 מיקרון.'
  },
  {
    id: 'macula',
    term: 'המקולה (מרכז הראייה)',
    englishTerm: 'Macula Lutea',
    aliases: ['המקולה', 'מקולה', 'מקולרי', 'Macula'],
    category: 'anatomy',
    categoryHebrew: 'מבנה ואנטומיה',
    simpleDefinition: 'האזור העגול והרגיש במרכז הרשתית האחראי על הראייה הישרה, המאפשר לנו לקרוא, לזהות פנים, לקלוט צבעים ולראות פרטים קטנים וחדים.',
    clinicalSignificance: 'בצקת במקולה (CME) היא הגורם הישיר לירידה באיכות הקריאה והראייה בעין שמאל.'
  },
  {
    id: 'macroaneurysm',
    term: 'מאקרואנוריזמה ברשתית',
    englishTerm: 'Retinal Macroaneurysm',
    aliases: ['מאקרואנוריזמה', 'מאקרואנוריזמות', 'Macroaneurysm'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'התרחבות מקומית דמוית בלון קטן בדופן כלי דם עורקי ברשתית, הנוצרת בגלל עומס לחצים ומאבדת את האטימות שלה.',
    clinicalSignificance: 'בעין שמאל מאקרואנוריזמות בארקדה העליונה דלפו נוזלים ושומנים למרכז הראייה; הן טופלו ונצרבו באמצעות לייזר פוקאלי ממוקד כדי לאטום אותן.'
  },
  {
    id: 'hard-exudates',
    term: 'אקסודטים קשים',
    englishTerm: 'Hard Exudates',
    aliases: ['אקסודטים קשים', 'אקסודטים', 'תפליטים', 'Hard Exudates'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'משקעים זעירים של שומנים וחלבונים שנשארים ברקמת הרשתית לאחר שנוזל הדלף מתאדה או נספג חלקית, ונראים כמו נקודות צהבהבות מבריקות.',
    clinicalSignificance: 'מעידים על דלף כרוני וממושך מכלי דם פגומים; מופיעים לעיתים קרובות סביב מאקרואנוריזמות ומעידים על הצורך באיטום בלייזר וייבוש.'
  },
  {
    id: 'fa',
    term: 'אנגיוגרפיה פלואורסצאינית',
    englishTerm: 'Fluorescein Angiography (FA)',
    aliases: ['אנגיוגרפיה פלואורסצאינית', 'צילומי FA', 'צילום FA', 'אנגיוגרפיה (FA)', 'צילום אנגיוגרפיה', 'FA'],
    category: 'diagnostics',
    categoryHebrew: 'בדיקות והדמיה',
    simpleDefinition: 'צילום כלי הדם ברשתית בעזרת חומר ניגוד צהוב זוהר מיוחד (פלואורסצאין) המוזרק לווריד היד, ומאיר בדיוק היכן כלי הדם אטומים והיכן יש דליפה פעילה.',
    clinicalSignificance: 'איפשר לרופאים לזהות במדויק את המאקרואנוריזמות הדולפות, מעקפי הדם ואזורי חוסר החמצן, וכך לכוון את קרן הלייזר בדיוק מרבי.'
  },
  {
    id: 'photocoagulation',
    term: 'פוטוקואגולציה (צריבת לייזר)',
    englishTerm: 'Laser Photocoagulation',
    aliases: ['פוטוקואגולציה', 'קואגולציה', 'Photocoagulation', 'צריבה בלייזר', 'צריבת לייזר'],
    category: 'treatments',
    categoryHebrew: 'הזרקות וטיפולים',
    simpleDefinition: 'שימוש באנרגיית אור ממוקדת של לייזר שהופכת לחום עדין, כדי לצרוב, לאטום ולהצליק כלי דם דולפים או אזורים חסרי חמצן ברשתית.',
    clinicalSignificance: 'בעין שמאל בוצעו 4 סבבי לייזר שאטמו בהצלחה מאקרואנוריזמות דולפות וסייעו להפחית את עומס הנוזלים המגיע למקולה.'
  },
  {
    id: 'focal-grid-laser',
    term: 'לייזר פוקאלי וגריד',
    englishTerm: 'Focal & Grid Laser Treatment',
    aliases: ['לייזר פוקאלי וגריד', 'לייזר פוקאלי', 'גריד טמפורלי', 'לייזר גריד'],
    category: 'treatments',
    categoryHebrew: 'הזרקות וטיפולים',
    simpleDefinition: 'שתי שיטות צריבה מדויקות: "פוקאלי" ממוקד ישירות על כלי דם בודד דולף (כמו מאקרואנוריזמה), ו"גריד" מייצר רשת של נקודות צריבה עדינות בשטח רחב לעידוד ספיגת נוזלים.',
    clinicalSignificance: 'שילוב זה סייע בייצוב המבנה ההיקפי של הרשתית בעין שמאל ומנע זליגת נוזלים נוספת לכיוון מרכז הראייה.'
  },
  {
    id: 'pxf',
    term: 'תסמונת פסאודואקספוליאציה',
    englishTerm: 'Pseudoexfoliation Syndrome (PXF)',
    aliases: ['תסמונת פסאודואקספוליאציה', 'פסאודואקספוליאציה', 'PXF'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'מצב גנטי-מבני שבו שוקעים פירורי חלבון לבנים זעירים על גבי עדשת העין והסיבים העדינים (זונולות) שמחזיקים אותה תלויה במקומה.',
    clinicalSignificance: 'הסיבים התומכים בעדשה חלשים ורפויים יותר, דבר שמצריך מיומנות כירורגית מיוחדת בניתוח קטרקט ומעלה נטייה לעליית לחץ תוך-עיני.'
  },
  {
    id: 'iop',
    term: 'לחץ תוך-עיני',
    englishTerm: 'Intraocular Pressure (IOP)',
    aliases: ['לחץ תוך-עיני', 'הלחץ התוך-עיני', 'IOP'],
    category: 'diagnostics',
    categoryHebrew: 'בדיקות והדמיה',
    simpleDefinition: 'הלחץ הפנימי של נוזלי העין, השומר על צורתו הכדורית של גלגל העין (בדומה ללחץ אוויר בצמיג). הערך התקין נע לרוב בין 10 ל-21 מ"מ כספית.',
    clinicalSignificance: 'שתלי סטרואידים (אוזורדקס) גרמו בעין שמאל לעליית לחץ עד 29 מ"מ כספית; מעקב קפדני וטיפול בטיפות קוסופט מנעו פגיעה בעצב הראייה.'
  },
  {
    id: 'erm',
    term: 'קרום אפירטינלי',
    englishTerm: 'Epiretinal Membrane (ERM)',
    aliases: ['קרום אפירטינלי', 'קרומים אפירטינליים', 'ממברנה אפירטינלית', 'ERM'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'שכבת רקמת צלקת שקופה ועדינה ביותר הנוצרת לעיתים על פני השטח של הרשתית, ויכולה להתכווץ ולמשוך את הרשתית כעין צלופן מקומט.',
    clinicalSignificance: 'תועד בצילומי OCT של עין שמאל; משיכתו המכנית יכולה לתרום לעקשנות הבצקת, ומהווה שיקול לשקילת ניתוח קילוף עדין (קילוף ממברנה).'
  },
  {
    id: 'vitreous',
    term: 'חלל הזגוגית וגוף הזגוגית',
    englishTerm: 'Vitreous Body / Vitreous Cavity',
    aliases: ['חלל הזגוגית', 'זגוגית העין', 'הגוף הזגוגי', 'ג׳ל הזגוגית', 'Vitreous'],
    category: 'anatomy',
    categoryHebrew: 'מבנה ואנטומיה',
    simpleDefinition: 'ג\'ל שקוף וצלול במרקם דמוי חלבון ביצה הממלא כ-80% מנפח גלגל העין, שומר על צורתו ומאפשר לקרני האור לעבור באין מפריע לעבר הרשתית.',
    clinicalSignificance: 'זהו היעד שלתוכו מוזרקות תרופות הרשתית (אוזורדקס ונוגדי VEGF); במחלה כרונית הוא עלול ללכוד מתווכי דלקת המזינים את הבצקת.'
  },
  {
    id: 'pars-plana',
    term: 'פארס פלנה (אתר ההזרקה הבטוח)',
    englishTerm: 'Pars Plana',
    aliases: ['Pars Plana', 'פארס פלנה'],
    category: 'anatomy',
    categoryHebrew: 'מבנה ואנטומיה',
    simpleDefinition: 'אזור צר ו"בטוח" בלובן העין (כ-3.5–4 מ"מ מקצה הקרנית), שאין בו כלי דם גדולים או רקמת רשתית פעילה.',
    clinicalSignificance: 'דרך נקודה אנטומית מדויקת זו מחדיר הרופא את המחט הזעירה בהזרקות תוך-עיניות, כדי להגיע ישירות לזגוגית בלי לפגוע בעדשה או ברשתית.'
  },
  {
    id: 'ischemia',
    term: 'איסכמיה ברשתית (חוסר חמצן)',
    englishTerm: 'Retinal Ischemia',
    aliases: ['איסכמיה', 'איסכמי', 'תת-אספקת חמצן', 'Ischemia'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'מצב שבו אזור מסוים ברשתית אינו מקבל אספקת דם וחמצן מספקת, עקב חסימת כלי דם מקומיים.',
    clinicalSignificance: 'הרקמה שסובלת ממחסור בחמצן "זועקת לעזרה" ומפרישה חלבון VEGF ומתווכי דלקת, מה שמגביר את הדליפה והבצקת.'
  },
  {
    id: 'cytokines',
    term: 'ציטוקינים ומתווכי דלקת',
    englishTerm: 'Inflammatory Cytokines',
    aliases: ['ציטוקינים', 'מתווכי דלקת', 'Cytokines'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'מולקולות איתות ביולוגיות קטנות המופרשות על ידי תאי מערכת החיסון ומעוררות תגובת דלקת, הרחבת כלי דם והגברת חדירות הדפנות.',
    clinicalSignificance: 'מסבירים מדוע נוגדי VEGF לבדם לא תמיד מספיקים: סטרואידים כמו אוזורדקס יעילים במיוחד משום שהם מדכאים קשת רחבה של ציטוקינים דלקתיים אלו.'
  },
  {
    id: 'ozurdex',
    term: 'אוזורדקס (שתל דקסמתזון)',
    englishTerm: 'Ozurdex (Dexamethasone 700µg Implant)',
    aliases: ['אוזורדקס', 'Ozurdex', 'דקסמתזון', 'שתל סטרואידי'],
    category: 'medications',
    categoryHebrew: 'תרופות וטיפות',
    simpleDefinition: 'שתל מיקרוסקופי מתכלה המוזרק לחלל הזגוגית ומשחרר בהדרגה סטרואיד אנטי-דלקתי חזק לאורך מספר חודשים, ללא צורך בהזרקות חודשיות חוזרות.',
    clinicalSignificance: 'השיג ייבוש משמעותי של הבצקת בעין שמאל (הוריד עובי מ-461 ל-348 מיקרון) והגן על הרשתית סביב ניתוח הקטרקט; מחייב מעקב לחץ תוך-עיני.'
  },
  {
    id: 'cosopt',
    term: 'קוסופט (טיפות להורדת לחץ)',
    englishTerm: 'Cosopt Eye Drops (Dorzolamide + Timolol)',
    aliases: ['קוסופט', 'Cosopt', 'טיפות קוסופט'],
    category: 'medications',
    categoryHebrew: 'תרופות וטיפות',
    simpleDefinition: 'טיפות עיניים המשלבות שני חומרים פעילים המפחיתים את ייצור הנוזלים בתוך העין ובכך מורידים ביעילות את הלחץ התוך-עיני.',
    clinicalSignificance: 'שימשו כ"רשת ביטחון" קריטית להורדת הלחץ שזינק עקב שתלי האוזורדקס, והחזירו את הלחץ לטווח תקין ובטוח (עד 9–10 מ"מ כספית).'
  },
  {
    id: 'cataract',
    term: 'קטרקט (ירוד ועכירות העדשה)',
    englishTerm: 'Cataract (Nuclear Sclerosis & PSC)',
    aliases: ['קטרקט', 'ירוד', 'עכירות העדשה', 'Cataract', 'NS+3'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'תהליך טבעי או מואץ שבו עדשת העין השקופה הופכת עכורה וצהבהבה (כמו חלון זכוכית מאובק או שרוט), מה שגורם לראייה מטושטשת ומסנוורת.',
    clinicalSignificance: 'בעין שמאל הקטרקט הואץ הן עקב הגיל והן עקב שתלי האוזורדקס; הוסר בהצלחה בניתוח ב-02/11/2026 עם שיפור ראייה מיידי.'
  },
  {
    id: 'pciol',
    term: 'עדשה תוך-עינית מלאכותית',
    englishTerm: 'Posterior Chamber Intraocular Lens (PCIOL)',
    aliases: ['עדשה תוך-עינית', 'עדשה מלאכותית', 'PCIOL', 'עדשת IOL'],
    category: 'surgery',
    categoryHebrew: 'ניתוחים וטכנולוגיות',
    simpleDefinition: 'עדשה שקופה סינתטית קטנטנה וקבועה המושתלת בתוך קופסית העדשה המקורית של העין במהלך ניתוח קטרקט, במקום העדשה הטבעית העכורה שהוסרה.',
    clinicalSignificance: 'הושתלה בהצלחה בעין שמאל (דגם DCBOO +12.5D), אינה דוהה או מתבלה לעולם, ומחזירה חדות מיקוד אופטית צלולה.'
  },
  {
    id: 'pseudophakia',
    term: 'פסאודופאקיה (עין לאחר ניתוח קטרקט)',
    englishTerm: 'Pseudophakia',
    aliases: ['פסאודופאקיה', 'פסאודופאקית', 'Pseudophakia'],
    category: 'surgery',
    categoryHebrew: 'ניתוחים וטכנולוגיות',
    simpleDefinition: 'המונח הרפואי לעין שבה העדשה הטבעית הוחלפה כבר בעדשה מלאכותית נקייה וצלולה.',
    clinicalSignificance: 'סטטוס חשוב: בעין כזו כבר אין סיכון להתפתחות קטרקט בעתיד, מה שפותח דלת בטוחה יותר לטיפולים נוספים (כגון ניתוח ויטרקטומיה).'
  },
  {
    id: 'vitrectomy',
    term: 'ניתוח ויטרקטומיה',
    englishTerm: 'Pars Plana Vitrectomy (PPV)',
    aliases: ['ויטרקטומיה', 'PPV', 'Pars Plana Vitrectomy', 'ניתוח ויטרקטומיה'],
    category: 'surgery',
    categoryHebrew: 'ניתוחים וטכנולוגיות',
    simpleDefinition: 'ניתוח זעיר-פולשני עדין שבו שואבים ומסירים את ג\'ל הזגוגית הפנימי ומחליפים אותו בתמיסה צלולה, כדי לנקות דלקות ולשחרר משיכות מכניות מהרשתית.',
    clinicalSignificance: 'אפשרות טיפולית מתקדמת שנשקלת במקרים של בצקת עקשנית שאינה מגיבה להזרקות, להסרת מאגר הדלקת וקילוף קרומים מציקים.'
  },
  {
    id: 'ilm-peeling',
    term: 'קילוף שכבת ה-ILM',
    englishTerm: 'Internal Limiting Membrane (ILM) Peeling',
    aliases: ['קילוף ILM', 'קילוף שכבת ה-ILM', 'קילוף ממברנה', 'ILM'],
    category: 'surgery',
    categoryHebrew: 'ניתוחים וטכנולוגיות',
    simpleDefinition: 'פעולה מיקרו-כירורגית שבה מקלפים בעדינות מרבית את שכבת הציפוי הפנימית והדקה ביותר של הרשתית (בעובי של מיקרונים ספורים) באזור מרכז הראייה.',
    clinicalSignificance: 'משחררת כוחות מתח ומשיכה מכניים מעל המקולה, ומסייעת לפתיחת המבנה ולספיגה טובה יותר של נוזלים עקשניים.'
  },
  {
    id: 'eylea-hd',
    term: 'אייליאה במינון גבוה',
    englishTerm: 'Eylea HD (Aflibercept 8mg)',
    aliases: ['אייליאה במינון גבוה', 'Eylea HD', 'אייליאה 8 מ"ג', 'אייליאה 8mg'],
    category: 'medications',
    categoryHebrew: 'תרופות וטיפות',
    simpleDefinition: 'גרסה חדשה ועוצמתית של תרופת הרשתית המוכרת, המכילה ריכוז מולקולרי גבוה פי 4 בהשוואה להזרקה הסטנדרטית.',
    clinicalSignificance: 'מיועדת להתגבר על עמידות תרופתית ולהאריך את משך הייבוש וההפוגה בין הזרקה להזרקה ל-8 עד 16 שבועות.'
  },
  {
    id: 'vabysmo',
    term: 'וביסמו (פאריצימאב)',
    englishTerm: 'Vabysmo (Faricimab)',
    aliases: ['וביסמו', 'Vabysmo', 'פאריצימאב', 'Faricimab'],
    category: 'medications',
    categoryHebrew: 'תרופות וטיפות',
    simpleDefinition: 'הנוגדן הבי-ספציפי הראשון מסוגו, התוקף במקביל שני חלבונים שונים (VEGF וכן אנגיופויאטין-2) במטרה לחזק את דפנות כלי הדם.',
    clinicalSignificance: 'נוסה בעין שמאל בסדרה של 4 זריקות; על אף הציפייה, הבצקת הוסיפה להיות עקשנית ולא הגיבה, מה שהוביל להחלטה לחזור לשילוב עם סטרואידים.'
  },
  {
    id: 'shunts',
    term: 'מעקפים ורידיים (שאנטים)',
    englishTerm: 'Venovenous Shunts / Collaterals',
    aliases: ['מעקפים ורידיים', 'שאנטים', 'מעקפים', 'Shunts'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'כלי דם קטנים חדשים שהעין מפתחת באופן ספונטני כדי לעקוף את אזור הווריד החסום, כמו דרך עוקפת בפקק תנועה.',
    clinicalSignificance: 'מנגנון פיצוי טבעי של הגוף להקלת הלחץ; עם זאת, הם עלולים להיות רגישים לדלף וטופלו בלייזר בחלקם.'
  },
  {
    id: 'tight-junctions',
    term: 'חיבורים בין-תאיים הדוקים',
    englishTerm: 'Tight Junctions',
    aliases: ['חיבורים הדוקים', 'צמתים בין-תאיים', 'Tight Junctions'],
    category: 'anatomy',
    categoryHebrew: 'מבנה ואנטומיה',
    simpleDefinition: 'חיבורים דמויי "רוכסן ביולוגי" חזק המחברים את תאי דופן כלי הדם ומונעים דליפת נוזלים לרקמה.',
    clinicalSignificance: 'שמירה על חיבורים אלו היא המפתח לרשתית יבשה ובריאה; סטרואידים ונוגדי VEGF פועלים לחיזוקם מחדש.'
  },
  {
    id: 'pinhole',
    term: 'בדיקת ראייה עם חריר',
    englishTerm: 'Pinhole Visual Acuity Test',
    aliases: ['בדיקת חריר', 'חריר', 'עם חריר', 'Pinhole'],
    category: 'diagnostics',
    categoryHebrew: 'בדיקות והדמיה',
    simpleDefinition: 'בדיקת ראייה שבה המטופל מביט בלוח האותיות דרך חור קטנטן במחיצה שחורה, החוסם קרני אור תועות וממקד רק קרניים מרכזיות.',
    clinicalSignificance: 'מבדילה בין בעיית מיקוד אופטית (קטרקט/משקפיים) לבין בעיה ברשתית: אם הראייה משתפרת עם חריר (כמו מ-6/60 ל-6/24 או מ-6/21 ל-6/12), יש פוטנציאל ראייה טוב.'
  },
  {
    id: 'irvine-gass',
    term: 'תסמונת אירווין-גאס',
    englishTerm: 'Irvine-Gass Syndrome (Post-Cataract CME)',
    aliases: ['תסמונת אירווין-גאס', 'אירווין-גאס', 'Irvine-Gass'],
    category: 'pathology',
    categoryHebrew: 'מחלות ופתולוגיות',
    simpleDefinition: 'בצקת מקולרית הנוצרת בעקבות הדלקת הטבעית של ניתוח קטרקט, במיוחד בעיניים שסבלו מראש מבעיה בכלי הדם.',
    clinicalSignificance: 'שתל האוזורדקס המקדים שהוזרק שבועיים לפני ניתוח הקטרקט מנע בהצלחה סיבוך זה ושמר על יציבות הרשתית.'
  },
  {
    id: 'cst',
    term: 'מדד עובי מקולרי מרכזי',
    englishTerm: 'Central Subfield Thickness (CST)',
    aliases: ['עובי מקולרי מרכזי', 'עובי מרכזי', 'CST'],
    category: 'diagnostics',
    categoryHebrew: 'בדיקות והדמיה',
    simpleDefinition: 'המספר המדויק במיקרונים (µm) שמודד מכשיר ה-OCT בעיגול המרכזי של מרכז הראייה (רוחב של 1 מ"מ סביב הפוביאה).',
    clinicalSignificance: 'המדד המספרי הראשי למעקב: ערך תקין הוא ~240 מיקרון (עין ימין); ערכים של 450–565 מיקרון משקפים בצקת פעילה הדורשת טיפול.'
  }
];

// Helper to look up a term by alias or id
export function findGlossaryTerm(search: string): GlossaryTerm | undefined {
  const normalized = search.trim().toLowerCase();
  return GLOSSARY_TERMS.find(t => 
    t.id.toLowerCase() === normalized ||
    t.term.toLowerCase() === normalized ||
    (t.englishTerm && t.englishTerm.toLowerCase().includes(normalized)) ||
    t.aliases.some(a => a.toLowerCase() === normalized)
  );
}
