import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("awa_wallets");

export const recreateWalletsDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `drop table if exists wallets;`,
      [],
      () => console.log('Table wallets deleted successfully'),
      (_, error) => console.log('Error deleting wallets table', error)
    );
    tx.executeSql(
      'create table if not exists wallets (id integer primary key autoincrement, name text, address text, total float);',
      [],
      () => console.log('Table wallets created successfully'),
      (_, error) => console.log('Error creating wallets table', error)
    );
  });
};


export const createWalletsTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          "create table if not exists wallets (id integer primary key autoincrement, name text, address text, total float);"
        );
      },
      reject,
      resolve
    );
  });
}

export const selectWallets = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("select * from wallets order by total desc", [], (_, { rows }) => {
        resolve(rows._array),
        (_, error) => reject(error)
      });
    }, reject);
  });
}

export const saveWallets = (wallets) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `insert into wallets (name, address, total) values ${wallets
          .map(
            item =>
              `("${item.name}", "${item.address}", "${item.total}")`
          )
          .join(", ")}`
      );
    }, reject, resolve);
  });
}

export const addWallet = (wallet) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'insert into wallets (name, address, total) values (?, ?, ?);',
        [wallet.name, wallet.address, wallet.total],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteWallet = (walletId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'delete from wallets where id = ?;',
        [walletId],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};