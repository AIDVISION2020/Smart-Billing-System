let db;

const DB_NAME = "SmartBillingSystemDB";
const STORE_NAME = "UnfinishedBills";
const KEY_PATH = "billId";

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

export const saveCurrentBill = (bill) => {
  const currTime = Date.now();
  if (!bill.createdAt) bill.createdAt = currTime;
  bill.lastUpdatedAt = currTime;
  bill.completed = bill.completed || false;

  return new Promise((resolve, reject) => {
    if (!db)
      return reject("Database not initialized. Call openDatabase first.");
    if (!bill) return reject("Bill is required and should be an object.");

    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(bill);

    request.onsuccess = () => resolve("Bill saved successfully.");
    request.onerror = (event) =>
      reject(`Error saving bill: ${event.target.errorCode}`);
  });
};

export const getUnfinishedBills = ({ billId, createdBy }) => {
  return new Promise((resolve, reject) => {
    if (!db)
      return reject("Database not initialized. Call openDatabase first.");

    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);

    if (billId) {
      // If billId is provided, get the specific bill
      const request = store.get(billId);

      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result && (!createdBy || result.createdBy === createdBy)) {
          resolve(result);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        reject(`Error retrieving bill: ${event.target.errorCode}`);
      };
    } else {
      // Get all bills and filter based on createdBy if provided
      const request = store.getAll();

      request.onsuccess = (event) => {
        let bills = event.target.result || [];
        if (createdBy) {
          bills = bills.filter((bill) => bill.createdBy === createdBy);
        }
        resolve(bills);
      };

      request.onerror = (event) => {
        reject(`Error retrieving bills: ${event.target.errorCode}`);
      };
    }
  });
};

export const deleteBill = (billId) => {
  return new Promise((resolve, reject) => {
    if (!db)
      return reject("Database not initialized. Call openDatabase first.");
    if (!billId || typeof billId !== "string")
      return reject("billId is required and should be a string.");

    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(billId);

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

export const checkBillExists = (billId) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject("Database not initialized. Call openDatabase first.");
    }
    if (!billId || typeof billId !== "string") {
      return reject("billId is required and should be a string.");
    }

    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(billId);

    request.onsuccess = (event) => {
      const result = event.target.result;
      resolve(result); // Resolves with bill object if bill exists, false otherwise
    };

    request.onerror = (event) => {
      reject(`Error checking bill existence: ${event.target.errorCode}`);
    };
  });
};
