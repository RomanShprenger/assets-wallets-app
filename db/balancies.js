import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("awa_wallets");

export const recreateBalanciesDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `drop table if exists balancies;`,
      [],
      () => console.log('Table balancies deleted successfully'),
      (_, error) => console.log('Error deleting balancies table', error)
    );
    tx.executeSql(
      'create table if not exists balancies (id integer primary key autoincrement, address text, chain text, value float);',
      [],
      () => console.log('Table balancies created successfully'),
      (_, error) => console.log('Error creating balancies table', error)
    );
  });
};

export function saveBalancies(balances) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `insert into balancies (address, chain, value) values ${balances
          .map(
            item =>
              `("${item.address}", "${item.chain}", "${item.value}")`
          )
          .join(", ")}`
      );
    }, reject, resolve);
  });
};

export function selectBalancies() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("select * from balancies order by chain desc", [], (_, { rows }) => {
        resolve(rows._array),
        (_, error) => reject(error)
      });
    }, reject);
  });
};