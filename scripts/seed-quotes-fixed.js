const { sequelize } = require('../src/config/database');
const Quote = require('../src/models/Quote');

async function seedQuotes() {
  try {
    console.log('🗑️  Suppression des citations existantes...');
    await Quote.destroy({ where: {}, truncate: true });
    
    console.log('\n📖 Création de 30 citations avec texte arabe et français...');
    
    const quotes = await Quote.bulkCreate([
      // 8 Citations du Coran
      {
        text_original: 'إِنَّ بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        text_fr: 'Certes, c\'est par l\'évocation d\'Allah que les cœurs se tranquillisent.',
        author: 'Coran 13:28',
        active: true
      },
      {
        text_original: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
        text_fr: 'Ô vous qui croyez ! Cherchez secours dans la patience et la prière. Allah est avec les patients.',
        author: 'Coran 2:153',
        active: true
      },
      {
        text_original: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
        text_fr: 'Et quiconque craint Allah, Il lui donnera une issue favorable, et lui accordera Ses dons par des moyens sur lesquels il ne comptait pas.',
        author: 'Coran 65:2-3',
        active: true
      },
      {
        text_original: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى',
        text_fr: 'Entraidez-vous dans l\'accomplissement des bonnes œuvres et de la piété.',
        author: 'Coran 5:2',
        active: true
      },
      {
        text_original: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
        text_fr: 'Allah n\'impose à aucune âme une charge supérieure à sa capacité.',
        author: 'Coran 2:286',
        active: true
      },
      {
        text_original: 'وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنفَعُ الْمُؤْمِنِينَ',
        text_fr: 'Et rappelle car le rappel profite aux croyants.',
        author: 'Coran 51:55',
        active: true
      },
      {
        text_original: 'يَا أَيُّهَا الَّذِينَ آمَنُوا عَلَيْكُمْ أَنفُسَكُمْ',
        text_fr: 'Ô les croyants ! Vous êtes responsables de vous-mêmes.',
        author: 'Coran 5:105',
        active: true
      },
      {
        text_original: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
        text_fr: 'Les actions ne valent que par les intentions.',
        author: 'Coran - Parole célèbre',
        active: true
      },
      
      // 9 Hadiths du Prophète Muhammad (SWS)
      {
        text_original: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
        text_fr: 'Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne.',
        author: 'Prophète Muhammad (SWS) - Al-Bukhari',
        active: true
      },
      {
        text_original: 'الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا',
        text_fr: 'Le croyant est pour le croyant comme une construction dont les parties se soutiennent mutuellement.',
        author: 'Prophète Muhammad (SWS) - Al-Bukhari',
        active: true
      },
      {
        text_original: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ',
        text_fr: 'J\'ai été envoyé pour parfaire les nobles caractères.',
        author: 'Prophète Muhammad (SWS) - Ahmad',
        active: true
      },
      {
        text_original: 'مَنْ لَا يَرْحَمُ لَا يُرْحَمُ',
        text_fr: 'Celui qui ne fait pas preuve de miséricorde n\'en bénéficiera pas.',
        author: 'Prophète Muhammad (SWS) - Al-Bukhari',
        active: true
      },
      {
        text_original: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
        text_fr: 'Le musulman est celui dont les musulmans sont à l\'abri de sa langue et de sa main.',
        author: 'Prophète Muhammad (SWS) - Al-Bukhari',
        active: true
      },
      {
        text_original: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ',
        text_fr: 'Ton sourire au visage de ton frère est une aumône.',
        author: 'Prophète Muhammad (SWS) - At-Tirmidhi',
        active: true
      },
      {
        text_original: 'الدِّينُ النَّصِيحَةُ',
        text_fr: 'La religion, c\'est le bon conseil.',
        author: 'Prophète Muhammad (SWS) - Muslim',
        active: true
      },
      {
        text_original: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ',
        text_fr: 'Celui qui croit en Allah et au Jour Dernier, qu\'il honore son invité.',
        author: 'Prophète Muhammad (SWS) - Al-Bukhari',
        active: true
      },
      {
        text_original: 'لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ',
        text_fr: 'N\'entrera pas au Paradis celui qui a dans son cœur le poids d\'un atome d\'orgueil.',
        author: 'Prophète Muhammad (SWS) - Muslim',
        active: true
      },
      
      // 5 Citations des Compagnons (Ra)
      {
        text_original: 'لَا تَنْظُرْ إِلَى صِغَرِ الذَّنْبِ وَلَكِنِ انْظُرْ إِلَى عَظَمَةِ مَنْ عَصَيْتَ',
        text_fr: 'Ne regarde pas la petitesse du péché, mais regarde la grandeur de Celui que tu as désobéi.',
        author: 'Abdullah Ibn Mas\'ud (Ra)',
        active: true
      },
      {
        text_original: 'مَنْ أَخْلَصَ لِلَّهِ أَرْبَعِينَ صَبَاحًا ظَهَرَتْ يَنَابِيعُ الْحِكْمَةِ مِنْ قَلْبِهِ عَلَى لِسَانِهِ',
        text_fr: 'Celui qui est sincère envers Allah pendant quarante matinées, les sources de sagesse jailliront de son cœur vers sa langue.',
        author: 'Ali Ibn Abi Talib (Ra)',
        active: true
      },
      {
        text_original: 'أَشَدُّ النَّاسِ عَذَابًا يَوْمَ الْقِيَامَةِ عَالِمٌ لَمْ يَنْفَعْهُ اللَّهُ بِعِلْمِهِ',
        text_fr: 'Les gens qui auront le châtiment le plus sévère au Jour du Jugement sont les savants qu\'Allah n\'a pas fait profiter de leur science.',
        author: 'Abu Bakr As-Siddiq (Ra)',
        active: true
      },
      {
        text_original: 'كُنَّا نَتَعَلَّمُ الْإِيمَانَ قَبْلَ الْقُرْآنِ',
        text_fr: 'Nous apprenions la foi avant le Coran.',
        author: 'Omar Ibn Al-Khattab (Ra)',
        active: true
      },
      {
        text_original: 'مَنْ أَرَادَ أَنْ يَكُونَ أَعَزَّ النَّاسِ فَلْيَتَّقِ اللَّهَ',
        text_fr: 'Celui qui veut être le plus honorable des gens, qu\'il craigne Allah.',
        author: 'Abu Hurayra (Ra)',
        active: true
      },
      
      // 8 Citations des Savants
      {
        text_original: 'لَا تُؤَجِّلِ التَّوْبَةَ فَإِنَّ الْمَوْتَ يَأْتِي بَغْتَةً',
        text_fr: 'Ne retarde pas le repentir, car la mort vient soudainement.',
        author: 'Ibn Al-Qayyim',
        active: true
      },
      {
        text_original: 'الْعِلْمُ مَا نَفَعَ، لَيْسَ الْعِلْمُ مَا حُفِظَ',
        text_fr: 'La science est ce qui profite, la science n\'est pas ce qui est mémorisé.',
        author: 'Imam Ash-Shafi\'i',
        active: true
      },
      {
        text_original: 'إِذَا لَمْ تَسْتَطِعْ أَنْ تَصُومَ فَأَطْعِمْ',
        text_fr: 'Si tu ne peux pas jeûner, alors nourris les autres.',
        author: 'Imam Malik',
        active: true
      },
      {
        text_original: 'الْعِزُّ فِي الْقَنَاعَةِ وَالذُّلُّ فِي الطَّمَعِ',
        text_fr: 'L\'honneur est dans le contentement et l\'humiliation est dans l\'avidité.',
        author: 'Imam Ahmad Ibn Hanbal',
        active: true
      },
      {
        text_original: 'لَكَ مِنْ جِسْمِكَ حَقٌّ، وَلِنَفْسِكَ حَقٌّ، وَلِأَهْلِكَ حَقٌّ',
        text_fr: 'Votre corps a un droit sur vous, votre âme a un droit sur vous, et votre famille a un droit sur vous.',
        author: 'Imam Abu Hanifa',
        active: true
      },
      {
        text_original: 'لَا تَكُنْ عَبْدًا لِبَطْنِكَ وَشَهْوَتِكَ',
        text_fr: 'Ne sois pas esclave de ton ventre et de tes passions.',
        author: 'Hassan Al-Basri',
        active: true
      },
      {
        text_original: 'الْإِخْلَاصُ يُكَثِّرُ الْقَلِيلَ وَالرِّيَاءُ يُقَلِّلُ الْكَثِيرَ',
        text_fr: 'La sincérité rend le peu d\'actes nombreux, et l\'ostentation rend les nombreux actes insignifiants.',
        author: 'Ibn Ata Allah Al-Iskandari',
        active: true
      },
      {
        text_original: 'الدُّنْيَا جِسْرٌ فَاعْبُرُوهُ وَلَا تَعْمُرُوهُ',
        text_fr: 'Le monde est un pont, traversez-le sans vous y installer.',
        author: 'Aicha (Ra)',
        active: true
      }
    ]);
    
    console.log(`✅ ${quotes.length} citations créées avec texte arabe et français`);
    console.log('\n🎊 Script terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécution
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie\n');
    await seedQuotes();
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
})();
