You are working on MasjidConnect GY — a Next.js 16 Islamic community app for Guyana.
Repo: /home/karetech/v0-masjid-connect-gy/
Permanently dark: bg-[#0a0b14] base, bg-gray-900 cards, border-gray-800 borders.
NEVER add light-mode/dark: classes. Text: text-[#f9fafb] primary, text-gray-400 secondary.
Arabic text: className="font-arabic" (Amiri font loaded in layout).
All sub-pages: showBack on PageHero, BottomNav at bottom.

After ALL changes, rebuild & redeploy:
  cd /home/karetech/v0-masjid-connect-gy
  docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . && docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod && docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest && docker network connect kt-net-apps kt-masjidconnect-prod && docker network connect kt-net-databases kt-masjidconnect-prod

Then: git add -A && git commit -m "feat: New to Islam hub + Sisters Section + Explore grid updates" && git push origin main

=== TASK 1: NEW TO ISLAM SECTION ===

Create a dedicated hub for new reverts and people exploring Islam.

A) Create app/explore/new-to-islam/page.tsx — "New to Islam" hub:
   - PageHero: title "New to Islam", subtitle "Your Journey Begins Here",
     gradient "from-emerald-950 to-teal-900", showBack, stars
   - Warm, welcoming intro card at top:
     Arabic: "مَرْحَبًا" (Marhaban — Welcome)
     Text: "Whether you've just taken your Shahada or are still exploring, 
     this space is for you. Islam is a journey — take it one step at a time."
   - Grid of topic cards linking to sub-pages:

   Card 1: "The Shahada" → /explore/new-to-islam/shahada
     icon: Star, color: emerald
     subtitle: "Declaration of Faith — The First Step"

   Card 2: "What Do Muslims Believe?" → /explore/new-to-islam/beliefs
     icon: Heart, color: blue
     subtitle: "The 6 Articles of Faith explained simply"

   Card 3: "The 5 Pillars" → /explore/new-to-islam/pillars
     icon: Columns, color: purple
     subtitle: "The foundations of Islamic practice"

   Card 4: "Learn to Pray" → /explore/madrasa/salah (existing)
     icon: BookOpen, color: amber
     subtitle: "Wudu + step-by-step Salah guide"

   Card 5: "Islamic Vocabulary" → /explore/new-to-islam/vocabulary
     icon: MessageCircle, color: teal
     subtitle: "Common Arabic words every Muslim uses"

   Card 6: "Common Questions" → /explore/new-to-islam/faq
     icon: HelpCircle, color: rose
     subtitle: "New Muslims ask — Islam answers"

   Card 7: "Find a Community" → /masjids (existing)
     icon: MapPin, color: orange
     subtitle: "Masjids in Georgetown ready to welcome you"

   Card 8: "Duas for New Muslims" → /explore/new-to-islam/duas
     icon: Moon, color: indigo
     subtitle: "Supplications for your new journey"

   - Footer encouragement card:
     "💚 You are not alone. There are Muslims across Guyana ready to welcome you."
     "Contact CIOG or any masjid — they have revert support programmes."


B) Create app/explore/new-to-islam/shahada/page.tsx — The Shahada:
   - Title: "The Shahada", subtitle: "Declaration of Faith"
   - Show the Shahada in large Arabic (Amiri font, text-3xl):
     أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ
   - Transliteration: "Ash-hadu an lā ilāha illā-llāhu wa ash-hadu anna Muḥammadan rasūlu-llāh"
   - Meaning: "I bear witness that there is no god but Allah, and I bear witness that Muhammad is the messenger of Allah."
   - What it means section: short explanation of Tawheed (oneness of God) and accepting Muhammad ﷺ as the final prophet
   - How to take it: simple steps (1. Believe it sincerely, 2. Say it with intention, 3. Inform your local masjid/imam if possible)
   - What changes after Shahada: you are Muslim — all previous sins forgiven (hadith reference)
   - Play button: text-to-speech or audio file for the pronunciation (just a note/placeholder since audio needs hosting)
   - Encouraging hadith: "The Prophet ﷺ said: Islam wipes out whatever came before it." (Sahih Muslim)


C) Create app/explore/new-to-islam/beliefs/page.tsx — 6 Articles of Faith:
   Each article as an expandable card:
   1. Belief in Allah — One God, no partners, not like creation. Arabic: الله
   2. Belief in Angels (الملائكة) — Created from light, they carry out Allah's commands. Jibreel, Mikail, Israfil, Izrail.
   3. Belief in the Books (الكتب) — Torah (Tawrat), Psalms (Zabur), Gospel (Injeel), Quran. The Quran is the final and preserved revelation.
   4. Belief in the Prophets (الأنبياء) — 25 named in Quran; Adam was first, Muhammad ﷺ was the last.
   5. Belief in the Day of Judgement (يوم القيامة) — Every soul will be accountable for their deeds.
   6. Belief in Divine Decree (القدر) — Allah knows all things; everything happens by His will and wisdom.
   
   Each card: Arabic name, English title, icon, brief explanation (3-4 sentences), key Quranic reference.


D) Create app/explore/new-to-islam/pillars/page.tsx — 5 Pillars:
   Each pillar as an expandable card with icon, Arabic name, number badge, description:
   1. Shahada (الشهادة) — Declaration of Faith — once in a lifetime (at minimum)
   2. Salah (الصلاة) — Prayer — 5 times daily; link to /explore/madrasa/salah
   3. Zakat (الزكاة) — Charity — 2.5% of savings above nisab annually; link to /explore/zakat
   4. Sawm (الصوم) — Fasting — Ramadan; who is exempt; spiritual meaning
   5. Hajj (الحج) — Pilgrimage — once in lifetime for those who are able; Makkah; Dhul Hijjah


E) Create app/explore/new-to-islam/vocabulary/page.tsx — Islamic Vocabulary:
   A searchable glossary of common Arabic/Islamic terms. At least 30 terms:
   
   Groups: Greetings | About Allah | About the Prophet | Daily Life | Prayer | Quran | After-Life
   
   Terms to include (word, transliteration, meaning, example usage):
   - السلام عليكم / As-salamu alaykum — "Peace be upon you" — greeting between Muslims
   - وعليكم السلام / Wa alaykum as-salam — "And upon you peace" — response to above
   - بسم الله / Bismillah — "In the name of Allah" — said before starting anything
   - الحمد لله / Alhamdulillah — "All praise is for Allah" — gratitude
   - سبحان الله / SubhanAllah — "Glory be to Allah" — wonder, awe
   - الله أكبر / Allahu Akbar — "Allah is the Greatest" — greatness of God
   - إن شاء الله / InshaAllah — "If Allah wills" — expressing intention/hope
   - ما شاء الله / MashaAllah — "What Allah wills" — admiration, to ward off evil eye
   - جزاكم الله خيرا / Jazakallahu Khairan — "May Allah reward you with good" — thank you
   - آمين / Ameen — "Amen" — said after dua
   - صلى الله عليه وسلم / Sallallahu Alayhi Wasallam (ﷺ) — "Peace and blessings of Allah be upon him" — said after Prophet's name
   - رضي الله عنه / Radhi Allahu Anhu — "May Allah be pleased with him" — said about companions
   - رحمه الله / Rahimahullah — "May Allah have mercy on him" — said about deceased scholars
   - استغفر الله / Astaghfirullah — "I seek forgiveness from Allah" — repentance
   - تكبير / Takbir — saying "Allahu Akbar"
   - حلال / Halal — Permissible
   - حرام / Haram — Forbidden
   - سنة / Sunnah — The Prophet's ﷺ practices and sayings
   - حديث / Hadith — Saying/tradition of the Prophet ﷺ
   - أمة / Ummah — The global Muslim community
   - جهاد / Jihad — Striving/struggle (primarily the inner struggle against the nafs/desires)
   - صدقة / Sadaqah — Voluntary charity
   - دعاء / Dua — Supplication/personal prayer to Allah
   - ذكر / Dhikr — Remembrance of Allah
   - تقوى / Taqwa — God-consciousness, piety
   - رمضان / Ramadan — The holy month of fasting
   - عيد / Eid — Islamic celebration/holiday
   - مسجد / Masjid — Mosque
   - إمام / Imam — Prayer leader / scholar
   - جمعة / Jumu'ah — Friday congregational prayer
   
   Show as searchable cards. Each card: Arabic (large, Amiri), transliteration, meaning, usage example.
   Group by category with collapsible sections.


F) Create app/explore/new-to-islam/faq/page.tsx — Common Questions:
   Expandable FAQ cards covering the most common questions new Muslims have:
   
   Q1: "Do I have to change my name?"
   A: No. Unless your name has a meaning that contradicts Islam (e.g., refers to another deity), you can keep your name. Many companions kept their pre-Islamic names.
   
   Q2: "How do I tell my family?"
   A: There's no obligation to announce immediately. When you feel ready, approach it calmly. Share what Islam means to you. Many find it helpful to speak to other reverts or an imam for guidance first.
   
   Q3: "What do I need to do right after taking Shahada?"
   A: Make ghusl (full body purification bath), learn the basics of Salah, and continue learning. The religion is learned gradually — "Make things easy, don't make them difficult." (Bukhari)
   
   Q4: "Are my previous sins forgiven?"
   A: Yes. The Prophet ﷺ said: "Islam wipes out whatever came before it." Your slate is clean.
   
   Q5: "Can I still celebrate Christmas/Diwali/etc with family?"
   A: Scholars differ on this. The consensus is: attending family gatherings is fine, but participating in acts of worship specific to other faiths is not. Prioritise family ties.
   
   Q6: "Do I have to wear hijab immediately?"
   A: For sisters — hijab is an obligation in Islamic scholarship, but new reverts are encouraged to take things step by step. Focus on the fundamentals first. Discuss with a female scholar or imam.
   
   Q7: "I can't pray 5 times yet — am I a bad Muslim?"
   A: No. Learning takes time. Start with what you can. The Prophet ﷺ said: "Do good deeds within your capacity." Every step counts.
   
   Q8: "Can I still eat non-halal food from my family?"
   A: Pork and alcohol are strictly forbidden. Other meat — if you cannot access halal, some scholars permit People of the Book's meat (chicken/beef slaughtered by Christians/Jews). Ask a local imam for guidance on your situation.
   
   Q9: "How do I find other Muslims in Guyana?"
   A: Visit any masjid in Georgetown — the CIOG masjid and Queenstown Jama Masjid are welcoming to new Muslims. There are revert support groups through CIOG.
   
   Q10: "What should I read/watch first?"
   A: Start with the meaning of Al-Fatiha. Then explore the Anwar al-Awlaki "Makkah Period" lectures (available in the Lectures section of this app). For reading: "The Sealed Nectar" biography of the Prophet.


G) Create app/explore/new-to-islam/duas/page.tsx — Duas for New Muslims:
   A curated set of duas especially meaningful for reverts:
   
   1. Dua for guidance (Al-Fatiha verse 6): اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
      "Guide us to the straight path" — your daily prayer in Al-Fatiha
   
   2. Dua for firm faith: اللَّهُمَّ ثَبِّتْ قَلْبِي عَلَى دِينِكَ
      "O Allah, make my heart firm upon Your religion" — from Tirmidhi
   
   3. Dua for ease: اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا
      "O Allah, nothing is easy except what You make easy" — Ibn Hibban
   
   4. Dua when feeling overwhelmed: حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ
      "Allah is sufficient for us and He is the best disposer of affairs" — Quran 3:173
   
   5. Morning dhikr (short): سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
      "Glory be to Allah and praise Him" — 100x in morning/evening, sins forgiven (Bukhari)
   
   Show same format as main Duas page: Arabic, transliteration, meaning, source.
   Link back to the full Duas page for more.


H) Add "New to Islam" card to the Explore grid (app/explore/page.tsx):
   - Icon: Sparkles or Star, color: emerald gradient
   - Label: "New to Islam"
   - Subtitle: "Start your journey here"
   - Place it near the top of the explore grid (second row or so)

=== TASK 2: SISTERS SECTION ===

Create a dedicated space for Muslim women — their specific guidance, resources, and community.

A) Create app/explore/sisters/page.tsx — Sisters Hub:
   - PageHero: title "Sisters", subtitle "For Muslim Women",
     gradient "from-rose-950 to-pink-900", showBack, stars
   - Welcoming header card:
     Arabic: "أُخُوَّةٌ فِي الإِسْلَام" (Sisterhood in Islam)
     Text: "This space is for you, sister — your guidance, your questions, your community."
   - Grid of topic cards:

   Card 1: "Hijab Guide" → /explore/sisters/hijab
     icon: PersonStanding (or Heart), color: rose
     subtitle: "What it is, why, and how to wear it"

   Card 2: "Women in Prayer" → /explore/sisters/prayer
     icon: Moon, color: purple
     subtitle: "How Salah differs for women"

   Card 3: "Ramadan for Sisters" → /explore/sisters/ramadan
     icon: Star, color: amber
     subtitle: "Fasting, exemptions, and making the most of it"

   Card 4: "Women's Duas" → /explore/sisters/duas
     icon: BookOpen, color: teal
     subtitle: "Supplications for mothers, wives, and daughters"

   Card 5: "Rights of Women in Islam" → /explore/sisters/rights
     icon: Scale, color: blue
     subtitle: "What Islam gives you — clearly"

   Card 6: "Sisters Near Me" → (link to masjids filtered for women's section)
     icon: MapPin, color: emerald
     subtitle: "Masjids with a sisters' section in Guyana"

   Card 7: "Inspiring Sisters" → /explore/sisters/scholars
     icon: GraduationCap, color: violet
     subtitle: "Female scholars and their teachings"

   Card 8: "Sisters Community" → /explore/community/dua-board (with sisters filter or just link)
     icon: Users2, color: pink
     subtitle: "Connect with sisters in the community"


B) Create app/explore/sisters/hijab/page.tsx — Hijab Guide:
   - Two sections: "What is Hijab?" and "How to Wear It"
   - What is Hijab:
     * Meaning: "hijab" means barrier/covering, not just headscarf — it's modesty in dress, speech, and behaviour
     * The obligation: Quran 24:31 and 33:59 — explain the verses simply
     * Why sisters wear it: worship, identity, dignity, protection from objectification
     * Common misconceptions addressed: "forced upon you", "oppressive", etc.
   - How to Wear It (basic styles):
     * Simple hijab (square or rectangular scarf)
     * Al-Amira style
     * Wrap style
     * Note: Different styles are valid — choose what works for you and your culture
   - Encouragement card: "Hijab is between you and Allah. Take your time, make your intention, and seek knowledge."
   - Note for new reverts: "Don't feel pressured. Many reverts begin wearing hijab gradually. What matters is your niyyah (intention)."


C) Create app/explore/sisters/prayer/page.tsx — Women's Prayer Guide:
   Start with a reference to the Learn to Pray page (same steps) but highlight the differences:
   
   Differences from men's prayer:
   1. Clothing/Awrah: Women must cover their entire body except face and hands during prayer
   2. Voice: Women pray quietly (do not raise voice for Fajr/Isha/Maghrib aloud prayers)
   3. Position in Ruku: Bring arms closer to body (not widely spread like men)
   4. Position in Sujood: Keep body more compact, arms touching sides
   5. Imamah (leading prayer): Women can lead other women in prayer. A woman leads from the middle of the first row, not in front.
   6. Jumu'ah: Friday prayer is not obligatory for women (though they may attend)
   7. Menstruation: Prayer is not performed during haid (menstruation). No makeup needed. Normal ibadah (dhikr, dua, Quran listening) continues.
   8. Jama'ah at home: Women have full reward for praying at home — it is their choice to attend masjid.
   
   Show each point as an expandable card with a brief daleel (evidence) reference.
   Link to the full Learn to Pray page for the general guide.
   Note at bottom: "These rulings are based on the majority scholarly position (Shafi'i, Hanbali, Hanafi, Maliki)."


D) Create app/explore/sisters/ramadan/page.tsx — Ramadan for Sisters:
   - Section 1: Fasting (same as general, but note):
     * Exemptions from fasting: pregnancy, breastfeeding, illness, travel, menstruation
     * Making up missed fasts (Qadha): must be made up before next Ramadan
     * Fidyah: feeding a poor person per day — only for those permanently unable to fast
   
   - Section 2: Menstruation during Ramadan:
     * During haid: fasting is not permitted and must be made up later
     * She does not pray Salah but can: make dhikr, read Quran (scholarly difference — most allow it), make dua, listen to Quran, do acts of charity
     * Eid: She fully participates even if in period — dress up, make takbir, give Zakat al-Fitr
   
   - Section 3: Tips for sisters in Ramadan:
     * Prepare suhoor ahead of time
     * Use haid days for extra dua and reflection
     * Make a Ramadan plan: Quran reading goal, charity target, dhikr schedule
     * Rest is ibadah — don't exhaust yourself
   
   - Section 4: Laylatul Qadr while in haid:
     * A sister in haid can still worship — dua, dhikr, Quran (on device), istighfar
     * Missing Salah on Laylatul Qadr is forgiven — the exemption is from Allah


E) Create app/explore/sisters/duas/page.tsx — Women's Duas:
   Curated duas meaningful to women:
   
   1. Dua for a righteous husband: رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ
      (Musa's dua — Quran 28:24) — used as dua for a good spouse
   
   2. Dua during pregnancy: رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ
      "My Lord, do not leave me alone, and You are the best of inheritors." — Quran 21:89
   
   3. Dua for children: رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً
      "My Lord, grant me from Yourself a good offspring." — Quran 3:38
   
   4. Dua for ease in childbirth: (general ease dua) لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ
      Dua of Yunus — the dua of distress, used widely
   
   5. Dua for protecting children: أُعِيذُكَ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِن كُلِّ شَيْطَانٍ وَهَامَّةٍ
      "I seek refuge in the perfect words of Allah from every devil and every harmful thing" — Bukhari (said by Maryam over Isa)
   
   6. Dua for a good marriage: اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا
      "O Allah, unite our hearts" — from marriage dua
   
   7. Dua in grief: إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
      "Surely to Allah we belong and to Him we return" — Quran 2:156 — for any loss
   
   8. Dua for beauty (inner): اللَّهُمَّ حَسِّنْ خُلُقِي كَمَا حَسَّنْتَ خَلْقِي
      "O Allah, make my character beautiful as You made my appearance beautiful" — Musnad Ahmad
   
   Same format as Duas page: Arabic (large Amiri), transliteration, meaning, source, copy button.


F) Create app/explore/sisters/rights/page.tsx — Rights of Women in Islam:
   Simple, clear, affirming format. Each right as a card:
   
   1. Right to inheritance — women inherit (Quran 4:11); explains the share structure
   2. Right to marry by choice — a woman's consent is required for a valid marriage (wali assists, but cannot force)
   3. Right to divorce — Khul' (wife-initiated divorce) is valid in Islam
   4. Right to keep her name — a woman does not change her family name in Islamic tradition
   5. Right to own property — her wealth is entirely her own; husband has no claim to it
   6. Right to education — "Seeking knowledge is an obligation upon every Muslim" — regardless of gender
   7. Right to refuse a marriage — silence is consent; explicit objection invalidates the nikah
   8. Right to mahr — the groom gives a gift (mahr/dowry) to the bride, which is hers alone
   9. Right to maintenance — husband is obligated to provide food, clothing, shelter
   10. Right to be treated with kindness — "The best of you are those who are best to their wives" — Tirmidhi
   
   Each card: right name, relevant Quran/hadith reference, brief explanation.
   Footer note: "These rights are from the Quran and Sunnah — they are not favours, they are obligations upon others and entitlements for you."


G) Create app/explore/sisters/scholars/page.tsx — Inspiring Sisters:
   Profiles of notable Muslim women scholars and role models:
   
   1. Aisha bint Abi Bakr (رضي الله عنها) — Scholar, hadith narrator, teacher of the Ummah. Over 2,000 hadith narrated.
   2. Khadijah bint Khuwaylid (رضي الله عنها) — First Muslim, businesswoman, mother of believers.
   3. Fatimah al-Zahra (رضي الله عنها) — Daughter of the Prophet ﷺ, woman of the highest honour in Islam.
   4. Maryam (عليها السلام) — Only woman named in the Quran; had an entire surah named after her.
   5. Yasmin Mogahed — Contemporary scholar/author. "Reclaim Your Heart". Podcast: Soul Food.
   6. Umm Salamah (رضي الله عنها) — Wife of the Prophet ﷺ, known for wisdom and asking bold questions.
   7. Halima as-Sa'diyya (رضي الله عنها) — The Prophet's ﷺ wet nurse. Honoured throughout his life.
   
   Each profile: name, era (Companion/Tabii'ah/Contemporary), brief description, what she is known for, a quote or saying if available.


H) Add "Sisters" card to the Explore grid (app/explore/page.tsx):
   - Icon: Heart or Sparkles, gradient: rose/pink
   - Label: "Sisters"
   - Subtitle: "For Muslim women"
   - Place it in the grid (after New to Islam card)

=== TASK 3: EXPLORE GRID — RE-ORGANISE ===

With all the new cards added, the Explore grid is getting long. Organise it into sections:

Update app/explore/page.tsx:
- Group cards under section headers:
  
  Section: "🌙 Ramadan" (only show during Ramadan season Feb-Apr)
    - Ramadan
  
  Section: "📖 Quran & Learning" 
    - Quran (links to /quran)
    - Madrasa
    - Hifz Mode
    - Lectures

  Section: "🕌 Prayer & Practice"
    - Adhkar
    - Duas
    - Tasbih
    - Qibla
    - Zakat
    - Calendar

  Section: "👥 Community"
    - Community
    - Buddy
    - Masjids (links to /masjids)

  Section: "🌱 New Here?"
    - New to Islam
    - Sisters

  Section: "🔧 Tools"
    - Resources
    - Events

- Each section header: text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 mt-5
- Keep the 2-column grid within each section

=== TASK 4: UPDATE CHANGELOG ===

Add v2.0.0 entry to /home/karetech/v0-masjid-connect-gy/CHANGELOG.md:
- New to Islam hub (Shahada, 6 Beliefs, 5 Pillars, Vocabulary, FAQ, Duas for reverts)
- Sisters section (Hijab guide, Women in Prayer, Ramadan for sisters, Women's Duas, Rights in Islam, Inspiring sisters)
- Explore grid reorganised into 6 sections
- Safe-area fix (viewport-fit: cover, env(safe-area-inset-top))
- Masjid directory: search, area filter, facility badges, detail pages, check-in
- Community features: Dua Board/Feed/Khatam wired to PostgreSQL API
- Home checklist: wired to /api/tracking
- Zakat: GYD formatting, Zakat al-Fitr, 8 asnaf
- Islamic calendar: real 2026 events with Google Calendar links

=== IMPORTANT CONSTRAINTS ===
- Permanently dark: NO bg-white, NO light-mode classes
- Arabic text: font-arabic class (Amiri font)
- All pages: showBack on PageHero, BottomNav at bottom
- Islamic content accuracy matters — double-check the Arabic text and references
- Be respectful and accurate — this is a religious app
- No placeholder Lorem ipsum — all content must be real Islamic content

When all done, run:
openclaw system event --text "Done: Sprint 3 — New to Islam section, Sisters section, Explore reorganised, deployed" --mode now
