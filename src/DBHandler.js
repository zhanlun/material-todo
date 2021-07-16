export default class DBHandler {
    constructor(databaseName) {
        this.databaseName = databaseName;
        this.addData = this.addData.bind(this);
        this.removeData = this.removeData.bind(this);
        this.readAllData = this.readAllData.bind(this);
    }

    setDatabaseStores(event) {
        const db = event.target.result;
        const userObjectStore = db.createObjectStore("tasks", {
            keyPath: "task_id"
        });
        userObjectStore.createIndex("title", "title", { unique: false });
        userObjectStore.createIndex("is_done", "is_done", { unique: false });
        userObjectStore.createIndex("create_date", "create_date", { unique: false });
    }

    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.databaseName);
            request.onerror = function (e) {
                reject();
            };
            request.onsuccess = event => {
                this.db = event.target.result;
                resolve(event.target.result);
            };
            request.onupgradeneeded = this.setDatabaseStores;
        });
    }


    async addData(data) {
        return new Promise((resolve, reject) => {
            const userReadWriteTransaction = this.db.transaction(
                ["tasks"],
                "readwrite"
            );
            const newObjectStore = userReadWriteTransaction.objectStore("tasks");

            const addRequest = newObjectStore.add(data);
            addRequest.onsuccess = function () {
                resolve();
            };

            addRequest.onerror = e => {
                reject(e);
            };
        });
    }

    async removeData(id) {
        return new Promise((resolve, reject) => {
            const request = this.db
                .transaction("tasks", "readwrite")
                .objectStore("tasks")
                .delete(id);

            request.onsuccess = () => {
                resolve();
            };
        });
    }

    async readData(id) {
        return new Promise((resolve, reject) => {
            const readTransaction = this.db.transaction(["tasks"]);
            const objectStore = readTransaction.objectStore("tasks");
            const request = objectStore.get(id);
            request.onsuccess = function (event) {
                resolve(event.result);
            };
        });
    }

    async readAllData() {
        return new Promise((resolve, reject) => {
            const readTransaction = this.db.transaction(["tasks"]);
            const objectStore = readTransaction.objectStore("tasks");
            objectStore.getAll().onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    }
}