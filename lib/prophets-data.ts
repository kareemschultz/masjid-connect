export interface ProphetStory {
  name: string
  arabicName: string
  title?: string
  quranMentions: number
  era: string
  summary: string
  lesson: string
  keyVerse: string
  icon: string
}

export const PROPHETS: ProphetStory[] = [
  {
    name: "Adam",
    arabicName: "آدم",
    title: "Abu al-Bashar (Father of Humanity)",
    quranMentions: 25,
    era: "The Beginning",
    summary:
      "Adam was the first human being, created by Allah from clay and honored when the angels were commanded to prostrate before him. He was taught the names of all things, demonstrating the unique knowledge bestowed upon humanity. He and his wife Hawwa were placed in Paradise but were deceived by Shaytan into eating from the forbidden tree. Upon realizing their error, they turned to Allah in sincere repentance and were forgiven, then sent to earth as vicegerents.",
    lesson:
      "Sincere repentance is always accepted by Allah, and mistakes do not define us if we turn back to Him.",
    keyVerse: "2:31",
    icon: "🌍",
  },
  {
    name: "Idris",
    arabicName: "إدريس",
    quranMentions: 2,
    era: "Pre-Nuh",
    summary:
      "Idris is praised in the Quran as a man of truth and patience who was raised to a high station by Allah. He is regarded as one of the earliest prophets after Adam, known for his dedication to knowledge and worship. He called his people to monotheism and righteous living. Scholars consider him among the first to write with a pen and study the stars and mathematics.",
    lesson:
      "The pursuit of knowledge and steadfast devotion to truth elevate a person in the sight of Allah.",
    keyVerse: "19:56",
    icon: "📜",
  },
  {
    name: "Nuh",
    arabicName: "نوح",
    quranMentions: 43,
    era: "Pre-Ibrahim",
    summary:
      "Nuh called his people to worship Allah alone for 950 years, yet only a few believed. Despite relentless mockery, he persevered in his mission with unwavering patience. Allah commanded him to build an ark, and when the great flood came, he and the believers were saved while the disbelievers, including his own son, perished. The ark came to rest on Mount Judi, marking a new beginning for humanity.",
    lesson:
      "Patience in dawah is essential; a prophet's duty is to convey the message, and guidance belongs to Allah alone.",
    keyVerse: "11:40",
    icon: "🚢",
  },
  {
    name: "Hud",
    arabicName: "هود",
    quranMentions: 7,
    era: "Pre-Ibrahim",
    summary:
      "Hud was sent to the people of Ad, a powerful civilization in southern Arabia known for their towering buildings and immense strength. They were arrogant, worshipped idols, and oppressed the weak. Hud warned them to worship Allah alone and abandon their tyranny, but they rejected him with contempt. Allah destroyed them with a furious wind that raged for seven nights and eight days, leaving nothing but ruins.",
    lesson:
      "No amount of worldly power or material strength can protect a people from the consequences of arrogance and disbelief.",
    keyVerse: "11:50",
    icon: "🏜️",
  },
  {
    name: "Salih",
    arabicName: "صالح",
    quranMentions: 9,
    era: "Pre-Ibrahim",
    summary:
      "Salih was sent to the people of Thamud, who carved magnificent homes out of mountains and lived in prosperity. He called them to worship Allah and brought them a miraculous sign: a she-camel that emerged from a rock by Allah's permission. Despite being warned not to harm her, the arrogant among them hamstrung and killed the camel. Allah then destroyed Thamud with a terrible earthquake and thunderous blast.",
    lesson:
      "Defying Allah's signs and harming what He has made sacred leads to inevitable destruction.",
    keyVerse: "11:61",
    icon: "🐪",
  },
  {
    name: "Ibrahim",
    arabicName: "إبراهيم",
    title: "Khalilullah (Friend of Allah)",
    quranMentions: 69,
    era: "Ibrahim",
    summary:
      "Ibrahim is one of the greatest prophets, known for his unwavering monotheism in a land of idol worship. He challenged his father and his people, smashed their idols, and was thrown into a fire that Allah made cool and safe for him. He was tested with the command to sacrifice his son Ismail, and both submitted to Allah's will before a ram was provided as a ransom. He built the Kaaba in Makkah with Ismail and established the rites of Hajj.",
    lesson:
      "True faith requires complete submission to Allah, even when tested with what is most beloved to us.",
    keyVerse: "2:124",
    icon: "🔥",
  },
  {
    name: "Lut",
    arabicName: "لوط",
    quranMentions: 27,
    era: "Ibrahim",
    summary:
      "Lut was the nephew of Ibrahim and was sent to the people of Sodom, who engaged in unprecedented immorality and highway robbery. He tirelessly called them to abandon their wickedness and return to the worship of Allah, but they mocked him and threatened to expel him. When angels came to Lut in the form of handsome men, the townspeople tried to assault them, confirming their depravity. Allah destroyed their cities by raining upon them stones of baked clay, while Lut and the believers were saved.",
    lesson:
      "Standing for moral truth may bring isolation, but Allah protects those who uphold righteousness.",
    keyVerse: "7:80",
    icon: "⚡",
  },
  {
    name: "Ismail",
    arabicName: "إسماعيل",
    title: "Dhabihullah (Sacrifice of Allah)",
    quranMentions: 12,
    era: "Ibrahim",
    summary:
      "Ismail was the firstborn son of Ibrahim, left as an infant with his mother Hajar in the barren valley of Makkah by Allah's command. When he grew older, his father Ibrahim told him of a vision commanding his sacrifice, and Ismail willingly submitted saying, 'Do as you are commanded; you will find me patient.' Allah ransomed him with a great sacrifice and this act of devotion became the basis of Eid al-Adha. He helped his father Ibrahim build the Kaaba and is regarded as the ancestor of the Prophet Muhammad.",
    lesson:
      "Willingness to sacrifice what we love most for Allah's sake is the highest expression of faith.",
    keyVerse: "37:102",
    icon: "🕋",
  },
  {
    name: "Ishaq",
    arabicName: "إسحاق",
    quranMentions: 17,
    era: "Ibrahim",
    summary:
      "Ishaq was the second son of Ibrahim, born miraculously to his elderly wife Sarah as a gift and glad tidings from Allah. Angels visited Ibrahim and Sarah to announce his birth, and Sarah laughed in astonishment at the news given her old age. Ishaq was blessed with prophethood and righteous offspring, becoming the father of Yaqub. Through his lineage, many of the prophets of Bani Israel were descended.",
    lesson:
      "Allah's blessings come in His own time, and nothing is impossible for Him, no matter how unlikely it seems.",
    keyVerse: "37:112",
    icon: "🌟",
  },
  {
    name: "Yaqub",
    arabicName: "يعقوب",
    title: "Israel",
    quranMentions: 16,
    era: "Ibrahim",
    summary:
      "Yaqub, also known as Israel, was the son of Ishaq and the father of twelve sons who became the tribes of Bani Israel. His most profound trial was the loss of his beloved son Yusuf, whom his other sons cast into a well out of jealousy. Yaqub wept until he lost his sight, yet he never lost hope in Allah's mercy, saying, 'I only complain of my grief and sorrow to Allah.' He was eventually reunited with Yusuf in Egypt, and his sight was miraculously restored.",
    lesson:
      "Beautiful patience means turning to Allah alone in times of grief, never despairing of His mercy.",
    keyVerse: "12:86",
    icon: "💎",
  },
  {
    name: "Yusuf",
    arabicName: "يوسف",
    quranMentions: 27,
    era: "Between Ibrahim & Musa",
    summary:
      "Yusuf's story, described by Allah as the best of stories, began with a dream of eleven stars, the sun, and the moon prostrating to him. His jealous brothers threw him into a well, and he was sold into slavery in Egypt where he resisted the temptation of the minister's wife and was unjustly imprisoned. In prison, he interpreted dreams and eventually interpreted the king's dream, earning his freedom and becoming the treasurer of Egypt. He was finally reunited with his family and forgave his brothers, fulfilling the vision from his childhood.",
    lesson:
      "Patience through hardship, trust in Allah's plan, and the power of forgiveness can transform even the darkest circumstances into triumph.",
    keyVerse: "12:4",
    icon: "🌙",
  },
  {
    name: "Ayyub",
    arabicName: "أيوب",
    quranMentions: 4,
    era: "Between Ibrahim & Musa",
    summary:
      "Ayyub was a wealthy and devout prophet who was tested with the loss of his health, wealth, and children. His illness lasted for years, and people abandoned him, yet he remained steadfastly patient and grateful to Allah. He never complained or questioned Allah's decree, and when he finally called upon his Lord, he said, 'Indeed adversity has touched me, and You are the Most Merciful of the merciful.' Allah restored his health, doubled his wealth, and returned his family to him as a reward for his patience.",
    lesson:
      "True patience in the face of severe trials is rewarded immensely, and Allah never burdens a soul beyond what it can bear.",
    keyVerse: "21:83",
    icon: "🏔️",
  },
  {
    name: "Shuayb",
    arabicName: "شعيب",
    quranMentions: 11,
    era: "Between Ibrahim & Musa",
    summary:
      "Shuayb was sent to the people of Madyan, who were known for cheating in their business dealings by giving short measure and weight. He called them to worship Allah, deal justly in trade, and stop corrupting the land. They rejected his message and threatened to stone him, claiming his prayers made him foolish. Allah destroyed them with an earthquake and a scorching blast from the sky, while Shuayb and the believers were saved.",
    lesson:
      "Honesty and fairness in financial dealings are fundamental aspects of faith, and economic corruption invites divine punishment.",
    keyVerse: "11:84",
    icon: "⚖️",
  },
  {
    name: "Musa",
    arabicName: "موسى",
    title: "Kalimullah (The one who spoke to Allah)",
    quranMentions: 136,
    era: "Musa",
    summary:
      "Musa is the most frequently mentioned prophet in the Quran, sent to liberate Bani Israel from the tyranny of Pharaoh. As an infant, he was placed in a basket on the Nile and raised in Pharaoh's own palace by Allah's design. He was called by Allah at the burning bush on Mount Tur and given nine miraculous signs to confront Pharaoh. After Pharaoh's refusal, Allah parted the sea to save Bani Israel and drowned Pharaoh and his army, then gave Musa the Torah on Mount Sinai.",
    lesson:
      "Allah empowers the oppressed against tyrants, and no worldly power can stand against His decree.",
    keyVerse: "20:12",
    icon: "🌊",
  },
  {
    name: "Harun",
    arabicName: "هارون",
    quranMentions: 20,
    era: "Musa",
    summary:
      "Harun was the elder brother of Musa and was appointed as a prophet and minister at Musa's own request to Allah, to strengthen his mission. He was eloquent in speech and served as Musa's support and spokesperson before Pharaoh. When Musa went to Mount Sinai for forty days, Harun was left in charge, but the people were led astray by As-Samiri who made the golden calf. Harun tried to prevent the idol worship but was overpowered by the people, and he awaited Musa's return to resolve the crisis.",
    lesson:
      "Supporting others in righteous work is itself a noble act of worship, and leadership requires both courage and wisdom.",
    keyVerse: "20:29",
    icon: "🗣️",
  },
  {
    name: "Dhul-Kifl",
    arabicName: "ذو الكفل",
    quranMentions: 2,
    era: "Between Musa & Dawud",
    summary:
      "Dhul-Kifl is mentioned twice in the Quran among the righteous and patient prophets. His name means 'the one of the pledge' or 'the one who fulfilled his portion,' indicating his steadfast commitment to his covenant with Allah. He is praised alongside Ismail and Idris as being among the patient and admitted into Allah's mercy. Scholars have various opinions about his identity, but all agree he was a man of great righteousness and devotion.",
    lesson:
      "Fulfilling one's commitments and maintaining patience through all circumstances earns a lasting place among the righteous.",
    keyVerse: "21:85",
    icon: "🛡️",
  },
  {
    name: "Dawud",
    arabicName: "داود",
    quranMentions: 16,
    era: "Kingdom of Israel",
    summary:
      "Dawud was a young soldier in the army of Talut (Saul) who defeated the mighty warrior Jalut (Goliath) with a single stone, demonstrating that faith overcomes brute strength. Allah granted him kingship, prophethood, wisdom in judgment, and the Zabur (Psalms). The mountains and birds would join him in glorifying Allah, and iron was made soft in his hands to craft armor. He was also known for his just rulings and his devotion, fasting every other day and praying through the night.",
    lesson:
      "True strength lies in faith, and combining worldly leadership with constant remembrance of Allah is the ideal of a believing ruler.",
    keyVerse: "34:10",
    icon: "🎵",
  },
  {
    name: "Sulayman",
    arabicName: "سليمان",
    quranMentions: 17,
    era: "Kingdom of Israel",
    summary:
      "Sulayman, the son of Dawud, inherited his father's kingdom and prophethood and was granted dominion over the wind, the jinn, and the ability to understand the speech of animals and birds. He commanded a vast army of humans, jinn, and birds, and built magnificent structures including a grand palace. The story of his encounter with the Queen of Sheba (Bilqis) and her eventual acceptance of faith is among the most detailed narratives in the Quran. Despite his unparalleled worldly power, he remained devoted to Allah and used his blessings in service of His cause.",
    lesson:
      "Worldly power and authority are blessings that must be used with gratitude and in service to Allah, never as a source of arrogance.",
    keyVerse: "27:16",
    icon: "👑",
  },
  {
    name: "Ilyas",
    arabicName: "إلياس",
    quranMentions: 2,
    era: "Kingdom of Israel",
    summary:
      "Ilyas was sent to the people of Bani Israel when they had fallen into the worship of the idol Baal, abandoning the worship of Allah. He confronted them boldly, asking, 'Will you not fear Allah? Will you call upon Baal and leave the Best of Creators?' Despite his sincere call, the majority of his people rejected him and persisted in their idol worship. He is praised in the Quran as being among the messengers and among those who did good.",
    lesson:
      "A true prophet speaks the truth regardless of how unpopular it may be, standing firm against the tide of falsehood.",
    keyVerse: "37:123",
    icon: "🌿",
  },
  {
    name: "Alyasa",
    arabicName: "اليسع",
    quranMentions: 2,
    era: "Kingdom of Israel",
    summary:
      "Alyasa is mentioned in the Quran as one of the righteous prophets, listed among the best of creation. He succeeded Ilyas in guiding the people of Bani Israel and continued the call to monotheism and righteousness. He is praised alongside Ibrahim, Ismail, Yaqub, and other great prophets as being among the chosen and the good. Though the Quran does not elaborate on the details of his mission, his inclusion among the finest prophets attests to his high rank.",
    lesson:
      "Continuing the work of righteous predecessors and maintaining the message of truth is itself a great and honored mission.",
    keyVerse: "6:86",
    icon: "🍃",
  },
  {
    name: "Yunus",
    arabicName: "يونس",
    title: "Dhun-Nun",
    quranMentions: 4,
    era: "Kingdom of Israel",
    summary:
      "Yunus was sent to the people of Nineveh, and when they rejected his message, he departed in anger before receiving Allah's permission. He boarded a ship that was caught in a storm, and when lots were drawn, he was cast into the sea where a great whale swallowed him. In the darkness of the whale's belly, he cried out, 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.' Allah accepted his repentance, commanded the whale to release him, and his people of over a hundred thousand believed.",
    lesson:
      "No matter how deep the darkness or dire the situation, sincere supplication and repentance can bring deliverance from Allah.",
    keyVerse: "21:87",
    icon: "🐋",
  },
  {
    name: "Zakariyya",
    arabicName: "زكريا",
    quranMentions: 7,
    era: "Pre-Isa",
    summary:
      "Zakariyya was an elderly prophet who served as the guardian of Maryam (Mary) in the temple. He would find her miraculously provided with food, which inspired him to call upon Allah for an heir despite his old age and his wife's barrenness. Allah answered his prayer and gave him glad tidings of a son named Yahya, a name never given to anyone before. As a sign, Zakariyya was unable to speak to people for three days, during which he glorified Allah through gestures.",
    lesson:
      "It is never too late to ask Allah for anything, for He answers the prayers of those who call upon Him with sincerity, regardless of circumstances.",
    keyVerse: "19:7",
    icon: "🙏",
  },
  {
    name: "Yahya",
    arabicName: "يحيى",
    quranMentions: 5,
    era: "Pre-Isa",
    summary:
      "Yahya was the son of Zakariyya, born miraculously to elderly parents as an answer to his father's heartfelt prayer. Allah gave him wisdom and compassion from childhood, and he was described as noble, chaste, and a prophet from among the righteous. He was commanded to hold firmly to the Scripture and was given judgment and understanding while still a young boy. He was gentle and dutiful to his parents, and peace was upon him the day he was born, the day he died, and the day he will be raised alive.",
    lesson:
      "Devotion to Allah and compassion toward others from an early age shape a life of extraordinary purpose and honor.",
    keyVerse: "19:12",
    icon: "📖",
  },
  {
    name: "Isa",
    arabicName: "عيسى",
    title: "Ruhullah (Spirit of Allah)",
    quranMentions: 25,
    era: "Isa",
    summary:
      "Isa was born miraculously to Maryam without a father, by Allah's command of 'Be, and it is.' He spoke from the cradle to defend his mother's honor and declared himself a servant and prophet of Allah. He was given the Injeel (Gospel) and performed miracles by Allah's permission: healing the blind and the leper, giving life to the dead, and fashioning birds from clay. When his enemies plotted to kill him, Allah raised him up to the heavens, and he was neither killed nor crucified.",
    lesson:
      "A prophet's greatness lies in servitude to Allah, and miracles are signs from Allah, not proof of divinity.",
    keyVerse: "3:45",
    icon: "✨",
  },
  {
    name: "Muhammad \uFDFA",
    arabicName: "محمد",
    title: "Habibullah (Beloved of Allah)",
    quranMentions: 4,
    era: "The Final Messenger",
    summary:
      "Muhammad is the Seal of the Prophets, sent as a mercy to all of creation with the final and complete revelation, the Quran. Born in Makkah, he received the first revelation at the age of 40 in the cave of Hira and spent 23 years conveying Allah's message despite severe persecution. He established a just society in Madinah, united the Arabian Peninsula under Islam, and demonstrated the perfection of character that the Quran describes. His life, teachings, and example (Sunnah) remain the guide for all of humanity until the Day of Judgment.",
    lesson:
      "The Prophet's life exemplifies that mercy, justice, and steadfastness in truth are the foundations of the final message to humanity.",
    keyVerse: "33:40",
    icon: "⭐",
  },
]
