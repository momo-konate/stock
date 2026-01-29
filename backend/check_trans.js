import { ClientTransaction } from './models/clientTransaction.model.js';
import { Client } from './models/client.model.js';

async function checkTransactions() {
  try {
    const count = await ClientTransaction.count();
    console.log(`Total des transactions : ${count}`);
    
    if (count > 0) {
      const last = await ClientTransaction.findOne({ order: [['date', 'DESC']] });
      console.log('Dernière transaction :', JSON.stringify(last, null, 2));
    }

    const clients = await Client.findAll({ where: { totalDebt: { [Symbol.for('gt')]: 0 } } });
    console.log(`Clients avec dette : ${clients.length}`);
    for (const c of clients) {
        const tCount = await ClientTransaction.count({ where: { clientId: c.id } });
        console.log(`Client ${c.name} (${c.id}) : ${tCount} transactions (Dette: ${c.totalDebt})`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Erreur :', error);
    process.exit(1);
  }
}

checkTransactions();
