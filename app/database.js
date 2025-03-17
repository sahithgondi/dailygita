import * as SQLite from 'expo-sqlite';
let db;

const initializeDB = async () => {
  db = await SQLite.openDatabaseAsync("gita.db");
};

initializeDB();

export const shlokas = [
  {
    chapter_id: "A",
    id: 1,
    shloka: "om pārthāya pratibodhitāṁ bhagavatā\n nārāyaṇena svayaṁ\n vyāsena grathitāṁ purāṇamuninā\n madhye mahābhāratam |\n advaitāmṛta-varṣiṇīṁ bhagavatīṁ\n aṣṭādaśādhyāyinīṁ\n ambatvām anusandadhāmi\n bhagavadgīte bhavadveṣiṇīm ||",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 2,
    shloka: "namo'stute vyāsa viśāla buddhe\n phullāravindāyata patranetra |\n yenatvayā bhārata taila pūrṇaḥ\n prajvālito jñāna mayaḥ pradīpaḥ ||",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 3,
    shloka: "prapanna pārijātāya\n totravetraika pāṇaye |\n jñānamudrāya kṛṣṇāya\n gītāmṛtaduhe namaḥ ||",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 4,
    shloka: "vasudeva sutaṁ devaṁ\n kaṁsa cāṇūra mardanam |\n devakī paramānandaṁ\n kṛṣṇaṁ vande jagadgurum ||",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 5,
    shloka: "bhīṣmadroṇataṭā jayadrathajalā\n gāndhāra nīlotpalā\n śalyagrāhavātī kṛpeṇa vahanī\n kārṇena velākulā |\n aśvatthāmā vikarṇa ghoramakarā\n duryodhanāvartinī\n sottīrṇā khalu pāṇḍavai raṇanadi\n kaivartakaḥ keśavaḥ ||",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 6,
    shloka: "pārāśarya vacassarojamamalaṁ\n gītārtha gandhotkaṭaṁ\n nānākhyānaka kesaraṁ harikathā\n sambodhanā bodhitam |\n loke sajana ṣaṭpadairaharahaḥ\n pepīyamānaṁ mudā\n bhūyāt bhārata paṅkajaṁ kalimala\n pradhvaṁsinaśśreyase ||\n",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 7,
    shloka: "mūkaṁ karoti vācālaṁ\n paṅguṁ laṅghayate girim |\n yat kṛpā tamahaṁ vande\n paramānanda mādhavam ||\n",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 8,
    shloka: "śāntākāraṁ bhujagaśayanam\n padmanābhaṁ sureśaṁ\n viśvādhāraṁ gaganasadṛśaṁ\n meghavarṇaṁ śubhāṅgam |\n lakśmīkāntaṁ kamalanayanam\n yogihṛddhyānagamyam\n vande viṣṇuṁ bhavabhayaharaṁ\n sarva lokaikanātham ||\n",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 9,
    shloka: "yaṁ brahmāvaruṇendrarudramarutaḥ\n stunvanti divyaisstavaiḥ\n vedaissāṅgapadakramopaniṣadaiḥ\n gāyanti yaṁ sāmagaḥ |\n dhyānāvasthita tadgatena manasā\n paśyanti yaṁ yoginaḥ\n yasyāntaṁ na vidussurāsuragaṇāḥ\n devāya tasmai namaḥ ||\n",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 10,
    shloka: "nārāyaṇaṁ namaskṛtya\n narañcaiva narottamam |\n devīṁ sarasvatīṁ vyāsaṁ\n tato jayamudīrayet ||\n",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 11,
    shloka: "saccidānandarūpāya\n kṛṣṇāyākliṣṭakāriṇe |\n namo vedāntavedyāya\n gurave buddhisākṣiṇe ||\n",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 12,
    shloka: "sarvopaniṣado gāvo\n dogdhā gopālanandanaḥ |\n pārtho vatsassudhīrbhoktā\n dugdhaṁ gītāmṛtaṁ mahat ||\n",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 13,
    shloka: "*gītāśāstramidaṁ puṇyam\n yaḥ paṭhet prayataḥ pumān\n viṣṇoḥ padamavāpnoti\n bhaya-śokādi varjitaḥ |\n",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 14,
    shloka: "*ekaṁ śāstraṁ devakīputragītam\n eko devo devakīputra eva\n eko mantrastasya nāmāni yāni\n karmāpyekaṁ tasya devasya sevā ||\n",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 1,
    uvaca: "dhṛtarāṣṭra uvāca -",
    shloka: "dharmakṣetre kurukṣetre\n samavetā yuyutsavaḥ |\n māmakāḥ pāṇḍavāścaiva\n kimakurvata sañjaya ||",
    uvaca_meaning: "Dhritarashtra asked:",
    shloka_meaning: "Sanjaya! On the sacred field of Kurukshetra, having gathered ready for battle, what have my son Duryodhana and the others, and the sons of Pandu, been doing?",
    noti_id: "1",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 2,
    uvaca: "sañjaya uvāca -",
    shloka: "dṛṣṭvā tu pāṇḍavānīkaṁ\n vyūḍhaṁ duryodhanastadā |\n ācāryamupasaṅgamya\n rājā vacanamabravīt ||",
    uvaca_meaning: "Sanjaya replied:",
    shloka_meaning: "Duryodhana, the prince, viewing the Pandava army arrayed for battle, approached his teacher Drona, and spoke thus:",
    noti_id: "2",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 3,
    shloka: "paśyaitāṁ pāṇḍuputrāṇām\n ācārya mahatīṁ camūm |\n vyūḍhāṁ drupadaputreṇa\n tava śiṣyeṇa dhīmatā ||",
    shloka_meaning: "O Master! See how your bright pupil Dhrishtadyumna, the son od King Drupada, has strategically arranged the army of the Pandavas!",
    noti_id: "3",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 4,
    shloka: "atra śūrā maheṣvāsāḥ\n bhīmārjunasamā yudhi |\n yuyudhāno virāṭaśca\n drupadaśca mahārathaḥ ||",
    noti_id: "4",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 5,
    shloka: "dhṛṣṭaketuścekitānaḥ\n kāśirājaśca vīryavān |\n purujitkuntibhojaśca\n śaibyaśca narapuṅgavaḥ ||",
    noti_id: "4",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 6,
    shloka: "yudhāmanyuśca vikrāntaḥ\n uttamaujāśca vīryavān |\n saubhadro draupadeyāśca\n sarva eva mahārathaḥ ||",
    shloka_meaning: "In this Pandava army, several great chariot warriors are gathered, every one of them equal in valor to Bhima and Arjuna, such as Yuyudhanu (Satyaki), Virata, Drupada, Dhrishtaketu, Chekitana, King of Kasi, Purujit, Kuntibhoja, and the noble Saibya, the valiant Yudhamanyu, powerful Uttamauja, Abhimanyu, the son of Subhadra, and the sons of Draupadi.",
    noti_id: "4",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 7,
    shloka: "asmākaṁ tu viśiṣṭā ye\n tānnibodha dvijottama |\n nāyakā mama sainyasya\n sañjñārthaṁ tānbravīmi te ||",
    shloka_meaning: "O noble brahmin, allow me to give you details of the warriors and commanders on our side.",
    noti_id: "5",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 8,
    shloka: "bhavān bhīṣmaśca karṇaśca\n kṛpaśca samitiñjayaḥ |\n aśvatthāmā vikarṇaśca\n saumadattistathaiva ca ||",
    shloka_meaning: "Yourself, Bhishma, Karna, the victorious Kripa, Aswatthama, Vikarna, the son of Somadatta (Bhoorisravas), and several others, are highly skillfull warriors on our side.",
    noti_id: "6",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 9,
    shloka: "anye ca bahavaśśūrāḥ\n madarthe tyaktajīvitāḥ |\n nānāśastrapraharaṇāḥ\n sarve yuddhaviśāradāḥ ||",
    shloka_meaning: "There are many other fighters, experts at missile warfare, now prepared to lay down their lives for me.",
    noti_id: "7",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 10,
    shloka: "aparyāptaṁ tadasmākaṁ\n balaṁ bhīṣmābhirakṣitam |\n paryāptaṁ tvidameteṣāṁ\n balaṁ bhīmābhirakṣitam ||",
    shloka_meaning: "The strength of our army, protected by Bhishma, is inadequate, wehras the strength of the Pandava army, protected by Bhima, is plentiful. (Although the Kaurava army was larger in numbers compared to that of the Pandava army, Duryodhana is expressing a contrary view, because, Bhishma's loyalty is undivided between both sides, whereas Bhima's loyalty is undivided. Hence, Duryodhana believes that the strength of the Pandavas is greater.)",
    noti_id: "8",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 11,
    shloka: "ayaneṣu ca sarveṣu\n yathābhāgamavasthitāḥ |\n bhīṣmamevābhirakṣantu\n bhavantassarva eva hi ||",
    shloka_meaning: "Therefore, each of you, holding your commanding posts, must focus on safeguarding Bhishma at any cost. It is Bhishma who will protect the rest of us.",
    noti_id: "9",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 12,
    shloka: "tasya sañjanayanharṣaṁ\n kuruvṛddhaḥ pitāmahaḥ |\n siṁhanādaṁ vinadyoccaiḥ\n śaṅkhaṁ dadhmau pratāpavān ||",
    shloka_meaning: "Hearing the deferential words spoken by Duryodhana, the hoary and venerable Bhishma, roaring like a lion, blew his conch. Duryodhana's heart swelled with joy.",
    noti_id: "10",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 13,
    shloka: "tataśśaṅkhāśca bheryaśca\n paṇavānakagomukhāḥ |\n sahasaivābhyahanyanta\n saśabdastumulo'bhavat ||",
    shloka_meaning: "Bhishma's zeal for battle raised the spirits of all the assembled warriors. A massive clamor arose all at once, with the blowing of conches, sounding of trumpets, and beating of war drums.",
    noti_id: "11",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 14,
    shloka: "tataśśvetairhayairyukte\n mahati syandane sthitau |\n mādhavaḥ pāṇḍavaścaiva\n divyau śaṅkhau pradadhmatuḥ ||",
    shloka_meaning: "Concurrently, Sri Krishna and Arjuna, seated in a divine chariot tethered with white horses also blew their conches, signaling readiness for battle.",
    noti_id: "12",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 15,
    shloka: "pāñcajanyaṁ hṛṣīkeśaḥ\n devadattaṁ dhanañjayaḥ |\n pauṇḍraṁ dadhmau mahāśaṅkhaṁ\n bhīmakarmā vṛkodaraḥ ||",
    shloka_meaning: "Hrishikesa (Krishna) blew the conch Panchajanya. Dhananjaya (Arjuna) blew the conch Devadatta. Striking terror, Bhima blew the Paundra.",
    noti_id: "13",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 16,
    shloka: "anantavijayaṁ rājā\n kuntīputro yudhiṣṭhiraḥ |\n nakulassahadevaśca\n sughoṣamaṇipuṣpakau ||",
    shloka_meaning: "Kunti's son Yudhishthira (Dharmaraja) blew Ananta Vijaya. Nakula blew the Sugosha. Sahadeva blew the conch Manipushpaka.",
    noti_id: "14",
    starred: false,
    note: "",
  },
  {
    chapter_id: "1",
    id: 17,
    shloka: ""
  }



  
];


// ✅ Initialize Database & Create Table
export const setupDatabase = async () => {
  if (!db) {
    console.log("⏳ Waiting for database to initialize...");
    await initializeDB();
  }

  try {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS shlokas (
        chapter_id TEXT,
        id INTEGER PRIMARY KEY,
        uvaca TEXT,
        shloka TEXT,
        uvaca_meaning TEXT,
        shloka_meaning TEXT,
        noti_id TEXT,
        starred BOOLEAN DEFAULT 0,
        note TEXT DEFAULT ''
      );`
    );
    console.log("✅ Table created successfully");

    // ✅ Insert shlokas if database is empty
    const result = await db.getAllAsync("SELECT COUNT(*) AS count FROM shlokas");

    if (result[0].count === 0) {
      console.log("📥 Inserting shlokas into database...");
      for (const { chapter_id, id, uvaca, shloka, uvaca_meaning, shloka_meaning, noti_id } of shlokas) {
        await db.runAsync(
          "INSERT INTO shlokas (chapter_id, id, uvaca, shloka, uvaca_meaning, shloka_meaning, noti_id, starred, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [chapter_id, id, uvaca || null, shloka, uvaca_meaning || null, shloka_meaning || null, noti_id || null, 0, ""]
        );
      }
      console.log("✅ Shlokas inserted successfully!");
    } else {
      console.log("✅ Database already contains shlokas.");
    }
  } catch (error) {
    console.log("❌ Error setting up database:", error);
  }
};

// ✅ Fetch all shlokas for a given chapter
export const getShlokasByChapter = async (chapterId) => {
  if (!db) await initializeDB();
  try {
    return await db.getAllAsync(
      "SELECT * FROM shlokas WHERE chapter_id = ?",
      [chapterId]
    );
  } catch (error) {
    console.log("❌ Error fetching shlokas:", error);
    return [];
  }
};

// ✅ Fetch a random shloka
export const getRandomShloka = async () => {
  if (!db) await initializeDB();
  try {
    const result = await db.getAllAsync(
      "SELECT * FROM shlokas WHERE noti_id IS NOT NULL ORDER BY RANDOM() LIMIT 1;"
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.log("❌ Error fetching random shloka:", error);
    return null;
  }
};

// ✅ Toggle bookmark status
export const toggleBookmark = async (id, currentStatus) => {
  if (!db) await initializeDB();
  const newStatus = currentStatus ? 0 : 1;
  try {
    await db.runAsync(
      "UPDATE shlokas SET starred = ? WHERE id = ?",
      [newStatus, id]
    );
    console.log(`⭐ Bookmark ${newStatus ? "added" : "removed"} for shloka ID ${id}`);
  } catch (error) {
    console.log("❌ Error updating bookmark:", error);
  }
};

// ✅ Add or update a note for a shloka
export const addNote = async (id, note) => {
  if (!db) await initializeDB();
  try {
    await db.runAsync(
      "UPDATE shlokas SET note = ? WHERE id = ?",
      [note, id]
    );
    console.log(`📝 Note added for shloka ID ${id}`);
  } catch (error) {
    console.log("❌ Error updating note:", error);
  }
};

// ✅ Fetch all bookmarked shlokas
export const getBookmarkedShlokas = async () => {
  if (!db) await initializeDB();
  try {
    return await db.getAllAsync(
      "SELECT * FROM shlokas WHERE starred = 1"
    );
  } catch (error) {
    console.log("❌ Error fetching bookmarked shlokas:", error);
    return [];
  }
};

// ✅ Initialize database when imported
setupDatabase();

export default db;