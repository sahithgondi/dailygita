import * as SQLite from "expo-sqlite";

// ✅ Open the database
const db = SQLite.openDatabase("gita.db");

// ✅ Manually entered shlokas
export const shlokas = [
  {
    chapter_id: "A",
    id: 1,
    shloka: "om pārthāya pratibodhitāṁ bhagavatā\n nārāyaṇena svayaṁ\n vyāsena grathitāṁ purāṇamuninā\n madhye mahābhāratam |\n advaitāmṛta-varṣiṇīṁ bhagavatīṁ\n aṣṭādaśādhyāyinīṁ\n ambatvām anusandadhāmi\n bhagavadgīte bhavadveṣiṇīm ||",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 2,
    shloka: "namo’stute vyāsa viśāla buddhe\n phullāravindāyata patranetra |\n yenatvayā bhārata taila pūrṇaḥ\n prajvālito jñāna mayaḥ pradīpaḥ ||",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 3,
    shloka: "prapanna pārijātāya\n totravetraika pāṇaye |\n jñānamudrāya kṛṣṇāya\n gītāmṛtaduhe namaḥ ||",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 4,
    shloka: "vasudeva sutaṁ devaṁ\n kaṁsa cāṇūra mardanam |\n devakī paramānandaṁ\n kṛṣṇaṁ vande jagadgurum ||",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 5,
    shloka: "bhīṣmadroṇataṭā jayadrathajalā\n gāndhāra nīlotpalā\n śalyagrāhavātī kṛpeṇa vahanī\n kārṇena velākulā |\n aśvatthāmā vikarṇa ghoramakarā\n duryodhanāvartinī\n sottīrṇā khalu pāṇḍavai raṇanadi\n kaivartakaḥ keśavaḥ ||",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 6,
    shloka: "pārāśarya vacassarojamamalaṁ\n gītārtha gandhotkaṭaṁ\n nānākhyānaka kesaraṁ harikathā\n sambodhanā bodhitam |\n loke sajana ṣaṭpadairaharahaḥ\n pepīyamānaṁ mudā\n bhūyāt bhārata paṅkajaṁ kalimala\n pradhvaṁsinaśśreyase ||\n",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 7,
    shloka: "mūkaṁ karoti vācālaṁ\n paṅguṁ laṅghayate girim |\n yat kṛpā tamahaṁ vande\n paramānanda mādhavam ||\n",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 8,
    shloka: "śāntākāraṁ bhujagaśayanam\n padmanābhaṁ sureśaṁ\n viśvādhāraṁ gaganasadṛśaṁ\n meghavarṇaṁ śubhāṅgam |\n lakśmīkāntaṁ kamalanayanam\n yogihṛddhyānagamyam\n vande viṣṇuṁ bhavabhayaharaṁ\n sarva lokaikanātham ||\n",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 9,
    shloka: "yaṁ brahmāvaruṇendrarudramarutaḥ\n stunvanti divyaisstavaiḥ\n vedaissāṅgapadakramopaniṣadaiḥ\n gāyanti yaṁ sāmagaḥ |\n dhyānāvasthita tadgatena manasā\n paśyanti yaṁ yoginaḥ\n yasyāntaṁ na vidussurāsuragaṇāḥ\n devāya tasmai namaḥ ||\n",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 10,
    shloka: "nārāyaṇaṁ namaskṛtya\n narañcaiva narottamam |\n devīṁ sarasvatīṁ vyāsaṁ\n tato jayamudīrayet ||\n",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 11,
    shloka: "saccidānandarūpāya\n kṛṣṇāyākliṣṭakāriṇe |\n namo vedāntavedyāya\n gurave buddhisākṣiṇe ||\n",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 12,
    shloka: "sarvopaniṣado gāvo\n dogdhā gopālanandanaḥ |\n pārtho vatsassudhīrbhoktā\n dugdhaṁ gītāmṛtaṁ mahat ||\n",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 13,
    shloka: "*gītāśāstramidaṁ puṇyam\n yaḥ paṭhet prayataḥ pumān\n viṣṇoḥ padamavāpnoti\n bhaya-śokādi varjitaḥ |\n",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {
    chapter_id: "A",
    id: 14,
    shloka: "*ekaṁ śāstraṁ devakīputragītam\n eko devo devakīputra eva\n eko mantrastasya nāmāni yāni\n karmāpyekaṁ tasya devasya sevā ||\n",
    shloka_meaning: "",
    noti_id: "NULL",
    starred: false,
    note: "",
  },
  {

  }
  
];

// ✅ Initialize Database & Create Table
export const setupDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS shlokas (
        chapter_id TEXT,
        id INTEGER,
        uvaca TEXT,
        shloka TEXT,
        shloka_meaning TEXT,
        noti_id TEXT,
        starred BOOLEAN DEFAULT 0,
        note TEXT DEFAULT ''
        PRIMARY KEY (chapter_id, id)
      );`,
      [],
      () => console.log("✅ Table created successfully"),
      (_, error) => console.log("❌ Error creating table:", error)
    );
  });

  // ✅ Insert shlokas if database is empty
  db.transaction((tx) => {
    tx.executeSql("SELECT COUNT(*) AS count FROM shlokas", [], (_, { rows }) => {
      if (rows._array[0].count === 0) {
        console.log("📥 Inserting shlokas into database...");
        shlokas.forEach(({ chapter_id, id, shloka, shloka_meaning, noti_id }) => {
          tx.executeSql(
            "INSERT INTO shlokas (chapter_id, id, uvaca, shloka, shloka_meaning, noti_id, starred, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [chapter_id, id, uvaca || null , shloka, shloka_meaning || null, noti_id || null, 0, ""]
          );
        });
        console.log("✅ Shlokas inserted successfully!");
      } else {
        console.log("✅ Database already contains shlokas.");
      }
    });
  });
};

// ✅ Fetch all shlokas for a given chapter
export const getShlokasByChapter = (chapterId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM shlokas WHERE chapter_id = ?",
      [chapterId],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.log("❌ Error fetching shlokas:", error)
    );
  });
};

// ✅ Fetch a random shloka
export const getRandomShloka = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM shlokas WHERE noti_id IS NOT NULL ORDER BY RANDOM() LIMIT 1;",
      [],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.log("❌ Error fetching random shloka:", error)
    );
  });
};

// ✅ Toggle bookmark status
export const toggleBookmark = (id, currentStatus) => {
  const newStatus = currentStatus ? 0 : 1;
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE shlokas SET starred = ? WHERE id = ?",
      [newStatus, id],
      () => console.log(`⭐ Bookmark ${newStatus ? "added" : "removed"} for shloka ID ${id}`),
      (_, error) => console.log("❌ Error updating bookmark:", error)
    );
  });
};

// ✅ Add or update a note for a shloka
export const addNote = (id, note) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE shlokas SET note = ? WHERE id = ?",
      [note, id],
      () => console.log(`📝 Note added for shloka ID ${id}`),
      (_, error) => console.log("❌ Error updating note:", error)
    );
  });
};

// ✅ Fetch all bookmarked shlokas
export const getBookmarkedShlokas = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM shlokas WHERE starred = 1",
      [],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.log("❌ Error fetching bookmarked shlokas:", error)
    );
  });
};

// ✅ Initialize database when imported
setupDatabase();

export default db;
