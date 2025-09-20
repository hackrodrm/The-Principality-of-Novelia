const DB_NAME = 'NoveliaDB';
const DB_VERSION = 1;

const STORES = {
    citizens: 'citizens',
    ministers: 'ministers',
    books: 'books',
    poll: 'poll',
    agendas: 'agendas',
    archive: 'archive',
    kv: 'kv',
};

let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(true);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Database error:', request.error);
            reject('Error opening database');
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(true);
        };

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            if (!dbInstance.objectStoreNames.contains(STORES.citizens)) {
                dbInstance.createObjectStore(STORES.citizens, { keyPath: 'id' });
            }
            if (!dbInstance.objectStoreNames.contains(STORES.ministers)) {
                dbInstance.createObjectStore(STORES.ministers, { keyPath: 'id' });
            }
            if (!dbInstance.objectStoreNames.contains(STORES.books)) {
                dbInstance.createObjectStore(STORES.books, { keyPath: 'id' });
            }
            if (!dbInstance.objectStoreNames.contains(STORES.poll)) {
                dbInstance.createObjectStore(STORES.poll, { keyPath: 'id' });
            }
            if (!dbInstance.objectStoreNames.contains(STORES.agendas)) {
                dbInstance.createObjectStore(STORES.agendas, { keyPath: 'id' });
            }
            if (!dbInstance.objectStoreNames.contains(STORES.archive)) {
                dbInstance.createObjectStore(STORES.archive, { keyPath: 'id' });
            }
            if (!dbInstance.objectStoreNames.contains(STORES.kv)) {
                dbInstance.createObjectStore(STORES.kv, { keyPath: 'key' });
            }
        };
    });
};

export const getAll = <T>(storeName: string): Promise<T[]> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
};

export const get = <T>(storeName: string, key: any): Promise<T | undefined> => {
     return new Promise(async (resolve, reject) => {
        await initDB();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export const put = <T>(storeName: string, item: T): Promise<IDBValidKey> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const remove = (storeName: string, key: any): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        await initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const putAll = <T>(storeName: string, items: T[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        if (!items || items.length === 0) return resolve();
        await initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        items.forEach(item => store.put(item));
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};
