import json

file_path = 'src/data/medicalContent.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. Update octTimeline
new_entry = {
    'id': '2026-11-16',
    'date': '16/11/2026',
    'period': 'נובמבר 2026 (מעקב פוסט-ניתוחי)',
    'od': 'שמורה, שקטה ותקינה לחלוטין; עובי מרכזי 235 מיקרון (ETDRS מרכזי 276 מיקרון, נפח כולל 8.14 מ"ק), שקע פוביאלי שמור וללא עדות לבצקת.',
    'odThickness': '235 µm',
    'os': 'מעקב שבועיים לאחר ניתוח קטרקט וחודש לאחר אוזורדקס: עובי מרכזי 525–543 מיקרון (שיא סקטוריאלי 625 מיקרון; סופריורית 567–590 מיקרון, נזלית 497 מיקרון). בפרופיל הפוביאלי ירידה קלה ל-354 מיקרון (-35 מיקרון). נוזל ציסטי כרוני פעיל ללא התלקחות סוערת.',
    'osThickness': '543 µm (שיא 625 µm)',
    'significance': 'הגנה מוכחת מפני התלקחות פוסט-ניתוחית: שתל האוזורדקס השיג את מטרתו הקלינית המרכזית ומנע התלקחות חריפה (Irvine-Gass) האופיינית לאחר ניתוח קטרקט. הבצקת הציסטואידית הכרונית נותרה עקשנית ומחייבת המשך מעקב וניהול טיפולי הדוק.',
    'stage': 'followup'
}

# Check if already present
timeline_ids = [item['id'] for item in data['octTimeline']]
if '2026-11-16' not in timeline_ids:
    data['octTimeline'].append(new_entry)
else:
    for idx, item in enumerate(data['octTimeline']):
        if item['id'] == '2026-11-16':
            data['octTimeline'][idx] = new_entry

# Update 2026-11 entry significance
for item in data['octTimeline']:
    if item['id'] == '2026-11':
        item['significance'] = 'יישום הפרוטוקול המשולב: כיסוי אנטי-דלקתי להגנה על הרשתית סביב הניתוח. בדיקת מעקב OCT ראשונה בוצעה שבועיים לאחר מכן (16/11/2026).'

# 2. Update tabs
for tab in data['tabs']:
    if tab['id'] == 'retina-issue':
        tab['summary'] = 'חסימת סעיף וריד הרשתית (BRVO), פריצת מחסום הדם-רשתית, בצקת ציסטואידית עד 565µm (מעקב 16/11/2026: 543µm), מאקרואנוריזמות ומעקב OCT כרונולוגי רב-שנתי.'
        tab['sections'][1]['content'] = 'הלחץ המוגבר החליש את דפנות כלי הדם וגרם לפריצת מחסום הדם-רשתית (BRB). נוזלים, חלבונים ושומנים דלפו לתוך השכבות התוך-רשתיות, ויצרו חללים ציסטיים (כיסי נוזל) בעיקר באזור המקולה והאזורים העליונים והנזליים של הרשתית. כתוצאה מכך, הרשתית התעבתה במידה ניכרת והגיעה לעוביים שנעו בין 340 ל-565 מיקרון (עם שיא עיבוי סופריורי של 598 מיקרון בספטמבר 2026, ו-543 מיקרון עם שיא של 625 מיקרון במעקב פוסט-ניתוחי מ-16/11/2026).'
        tab['comparisonHighlight']['od']['thickness'] = '209–282 µm (מעקב 16/11: 235 µm)'
        tab['comparisonHighlight']['os']['thickness'] = '245 ➔ 565 µm (מעקב 16/11: 543 µm, שיא 625 µm)'
        tab['comparisonHighlight']['os']['status'] = 'חסימת BRVO, בצקת CME רפרקטורית ללא התלקחות פוסט-ניתוחית, מאקרואנוריזמות ושאנטים'
        # Check metrics
        if not any('16/11' in m.get('label', '') for m in tab['metrics']):
            tab['metrics'].append({
                'label': 'מעקב OCT אחרון (16/11)',
                'value': '543 µm (שיא 625 µm)',
                'tone': 'warning'
            })
    elif tab['id'] == 'cataract':
        tab['sections'][2]['content'] = 'כדי לאפשר הסרת העדשה העכורה מבלי לסכן את הרשתית, יושמה אסטרטגיה מתוזמנת: (1) ב-18/10/2026, שבועיים לפני הניתוח, הוזרק שתל אוזורדקס מגן ליצירת כיסוי אנטי-דלקתי מרבי; (2) שולב טיפול בטיפות קוסופט למניעת עליית לחץ; (3) ב-02/11/2026 בוצע ניתוח קטרקט מוצלח בהרדמה מקומית עם השתלת עדשה תוך-עינית אחורית (PCIOL מסוג DCBOO +12.5D). בבדיקת יום לאחר הניתוח נמדד לחץ תקין לחלוטין (9–10 מ"מ כספית), וחדות הראייה זינקה מיידית מ-6/60 ל-6/21 (ועם חריר 6/12). בבדיקת מעקב OCT שבועיים לאחר הניתוח (16/11/2026) אושר כי שתל האוזורדקס מנע בהצלחה התלקחות דלקתית סוערת (Irvine-Gass) חרף הבצקת הכרונית העקשנית: עין ימין שמורה לחלוטין (235 µm) ובעין שמאל נשמרה יציבות מבנית (525–543 µm, פרופיל פוביאלי 354 µm).'
        if not any('16/11' in m.get('label', '') for m in tab['metrics']):
            tab['metrics'].append({
                'label': 'מעקב OCT שבועיים מניתוח',
                'value': '543 µm (מניעת התלקחות CME)',
                'tone': 'healthy'
            })

# 3. Update clinicalTakeaways
for takeaway in data.get('clinicalTakeaways', []):
    if takeaway.get('id') == 'takeaway-4':
        takeaway['content'] = 'האסטרטגיה של תזמון מדויק – מתן שתל אוזורדקס מגן כשבועיים לפני הסרת הקטרקט יחד עם כיסוי קוסופט – אפשרה לנטרל את התגובה הדלקתית הניתוחית ולמנוע החמרה חדה בבצקת המקולרית (Post-Operative CME). בדיקת ה-OCT מ-16/11/2026 איששה כי נמנעה התלקחות סוערת (עובי מרכזי 525–543 µm לעומת 521 µm בספטמבר), תוך שמירה על עין ימין תקינה לחלוטין (235 µm).'

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Updated medicalContent.json successfully! New timeline count:', len(data['octTimeline']))
