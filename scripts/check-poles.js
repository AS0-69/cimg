const { sequelize } = require('./src/config/database');

async function checkPoles() {
  try {
    const [rows] = await sequelize.query('SELECT * FROM poles');
    console.log('Pôles dans la base de données:');
    rows.forEach(r => {
      console.log(`  - ID: ${r.id}, Nom: "${r.name}"`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

checkPoles();
