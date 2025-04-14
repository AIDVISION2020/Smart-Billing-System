let db;

const DB_NAME = "SmartBillingSystemDB";
const STORE_NAME = "UnfinishedBills";
const KEY_PATH = "billName";

export const checkIfIndexedDBSupported = () => {
  return typeof window !== "undefined" && !!window.indexedDB;
};

export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: KEY_PATH });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve("Database opened successfully.");
    };

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.errorCode}`);
    };
  });
};

export const saveCurrentBill = (
  bill = {
    customerName: "customer_2025-04-14_18-30-05", // must be unique
    billName: "Bill12",
    items: [
      { name: "Item A", quantity: 2, price: 100 },
      { name: "Item B", quantity: 1, price: 50 },
    ],
    totalAmount: 250,
    timestamp: Date.now(), // optional, helps track when it was last updated
  }
) => {
  return new Promise((resolve, reject) => {
    if (!db)
      return reject("Database not initialized. Call openDatabase first.");
    if (!bill || !bill.billName || !bill.items || !bill.totalAmount) {
      return reject(
        "Invalid bill: billName, items, and totalAmount are required."
      );
    }

    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(bill);

    request.onsuccess = () => resolve("Bill saved successfully.");
    request.onerror = (event) =>
      reject(`Error saving bill: ${event.target.errorCode}`);
  });
};

export const getUnfinishedBills = (billName = "") => {
  return new Promise((resolve, reject) => {
    if (!db)
      return reject("Database not initialized. Call openDatabase first.");
    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);

    const request = billName ? store.get(billName) : store.getAll();

    request.onsuccess = (event) => {
      const result = event.target.result;
      resolve(result || (billName ? null : []));
    };

    request.onerror = (event) => {
      reject(`Error retrieving bill(s): ${event.target.errorCode}`);
    };
  });
};

export const deleteBill = (billName) => {
  return new Promise((resolve, reject) => {
    if (!db)
      return reject("Database not initialized. Call openDatabase first.");
    if (!billName)
      return reject("billName is required to delete a specific bill.");

    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(billName);

    request.onsuccess = () => resolve("Bill deleted successfully.");
    request.onerror = (event) =>
      reject(`Error deleting bill: ${event.target.errorCode}`);
  });
};

export const deleteIndexedDb = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => resolve("Database deleted successfully.");
    request.onerror = (event) =>
      reject(`Error deleting database: ${event.target.errorCode}`);
  });
};
