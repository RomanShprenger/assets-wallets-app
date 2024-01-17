import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("awa_wallets");

export const recreatePortfolioDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `drop table if exists portfolio;`,
      [],
      () => console.log('Table portfolio deleted successfully'),
      (_, error) => console.log('Error deleting portfolio table', error)
    );
    tx.executeSql(
      'create table if not exists portfolio (id integer primary key autoincrement, symbol text, name text, value float, amount float);',
      [],
      () => console.log('Table portfolio created successfully'),
      (_, error) => console.log('Error creating portfolio table', error)
    );
  });
};

export async function createPortfolioTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          "create table if not exists portfolio (id integer primary key autoincrement, symbol text, name text, value float, amount float);"
        );
      },
      reject,
      resolve
    );
  });
}

export const updatePortfolio = (positions) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `insert or replace into portfolio (symbol, name, value, amount) values ${positions
          .map(
            item => `("${item.symbol}", "${item.name}", "${item.value}",  "${item.amount}")`
          )
          .join(", ")}`,
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
      );
    });
  });
}

export const selectPortfolio = () => {
  return new Promise(resolve => {
    db.transaction(tx => {
      tx.executeSql("select * from portfolio order by value desc", [], (_, { rows }) => {
        resolve(rows._array),
        (_, error) => reject(error)
      });
    });
  });
}

export async function filterByQuery(query) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from portfolio where name like ? order by value desc`,
        [`%${query}%`],
        (_, { rows }) => {
          resolve(rows._array);
        }
      );
    }, reject);
  });
}
