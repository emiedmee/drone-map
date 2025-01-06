// https://akilic.com/blog/database/storing-and-editing-geojson-data-within-indexeddb
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

const DB_NAME = "datasets-db";
const STORE_DATASET = "datasets";

/**
 * @enum {Number}
 */
const EJobType = {
  CreateDB: 1,
  AddDataset: 2,
  UpdateDataset: 3,
  DeleteDataset: 4,
  DeleteAllDatasets: 5,
  GetDataset: 6,
  GetAllDatasets: 7,
};

/**
 * @typedef {{
 *  type: EJobType,
 *  params: Object,
 *  callback: Function,
 * }}
 */
const IJob = null;

/**
 * Class that simplifies the interaction with IndexedDB and is used to store datasets.
 * Can create, read, update and delete datasets.
 * Has a mechanism to queue jobs, so they happen in order and makes sure everything happens inside transactions.
 */
class DBDatasets {
  constructor() {
    /** @type {String} */
    this.db_name = DB_NAME;

    /** @type {String} */
    this.localStorageName = this.db_name + '-indexedDB-version';

    /** @type {Array<IJob>} */
    this.jobs = [];

    this.addJob({
      type: EJobType.CreateDB,
      params: {
        db_name: this.db_name,
      },
    });
  }

  /**
   * Set the version of the database.
   * 
   * @param {String|Number} version New version of the database
   */
  setVersion(version) {
    localStorage.setItem(this.localStorageName, version);
  }

  /**
   * Get the current version of the database.
   */
  getVersion() {
    var version = localStorage.getItem(this.localStorageName);
    if (version == null || version == '') {
      localStorage.setItem(this.localStorageName, 1);
    }
    version = localStorage.getItem(this.localStorageName);
    return parseInt(version, 10);
  }

  /**
   * Add a job to the queue of jobs to be executed on the database.
   * 
   * @param {IJob} job
   */
  addJob(job) {
    this.jobs.push(job);
    if (this.jobs.length == 1) {
      this.nextJob();
    }
  }

  /**
   * Perform the next job in the queue.
   */
  nextJob() {
    const self = this;
    if (this.jobs.length > 0) {
      const job = this.jobs[0];
      switch (job.type) {

        case EJobType.CreateDB:
          this.createDB((result) => {
            if (job.callback !== undefined) {
              job.callback(result);
            }
            self.jobs.splice(0, 1);
            self.nextJob();
          });
          break;

        case EJobType.AddDataset:
          this.addDataset(job.params.name, job.params.validTimeDays, job.params.value, (result) => {
            if (job.callback !== undefined) {
              job.callback(result);
            }
            self.jobs.splice(0, 1);
            self.nextJob();
          });
          break;

        case EJobType.UpdateDataset:
          this.updateDataset(job.params.name, job.params.validTimeDays, job.params.value, (result) => {
            if (job.callback !== undefined) {
              job.callback(result);
            }
            self.jobs.splice(0, 1);
            self.nextJob();
          });
          break;

        case EJobType.DeleteDataset:
          this.deleteDataset(job.params.name, (result) => {
            if (job.callback !== undefined) {
              job.callback(result);
            }
            self.jobs.splice(0, 1);
            self.nextJob();
          });
          break;

        case EJobType.DeleteAllDatasets:
          this.deleteAllDatasets((result) => {
            if (job.callback !== undefined) {
              job.callback(result);
            }
            self.jobs.splice(0, 1);
            self.nextJob();
          });
          break;

        case EJobType.GetDataset:
          this.getDataset(job.params.name, (result) => {
            if (job.callback !== undefined) {
              job.callback(result);
            }
            self.jobs.splice(0, 1);
            self.nextJob();
          });
          break;

        case EJobType.GetAllDatasets:
          this.getAllDatasets((result) => {
            if (job.callback !== undefined) {
              job.callback(result);
            }
            self.jobs.splice(0, 1);
            self.nextJob();
          });
          break;

        default:
          break;
      }
    }
  }

  /**
   * Create the database schema if needed.
   * 
   * @param {Function} callback Callback function to indicate, after it completed, if this function was succesfull
   */
  createDB(callback) {
    const self = this;
    const request = window.indexedDB.open(this.db_name);

    request.onsuccess = (event) => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      const newVersion = db.version + 1;
      self.setVersion(newVersion);
      const tableNames = db.objectStoreNames;

      db.close();

      if (tableNames.length == 0) {
        const req = window.indexedDB.open(this.db_name, newVersion);

        req.onupgradeneeded = (ev) => {
          /** @type {IDBDatabase} */
          const db = ev.target.result;
          const datasetsTable = db.createObjectStore(STORE_DATASET, { keyPath: "name" });
          datasetsTable.createIndex("name", "name", { unique: true });
          datasetsTable.createIndex("validUntil", "validUntil", { unique: false });
          datasetsTable.createIndex("value", "value", { unique: false });
          db.close();
          callback(true);
        };

      } else {
        callback(true);
      }
    };

    request.onerror = (event) => {
      console.error("IndexedDB error while creating database:", event.target.error?.message);
      event.target.result.close();
      callback(false);
    };
  }

  /**
   * Add a dataset to the database.
   * 
   * @param {String} name Name of the dataset
   * @param {Number} validTimeDays How long the dataset is valid, in days
   * @param {Object} geoJson The GeoJSON data, the content of the dataset
   * @param {Function} callback Callback function for the result
   */
  addDataset(name, validTimeDays, value, callback) {
    const request = window.indexedDB.open(this.db_name, this.getVersion());

    request.onsuccess = (event) => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      const data = {
        name: name,
        validFrom: Date.now(),
        validUntil: Date.now() + (1000 * 60 * 60 * 24 * validTimeDays),
        value: value,
      };
      const store = db.transaction([STORE_DATASET], "readwrite").objectStore(STORE_DATASET);
      const req = store.add(data);

      req.onsuccess = (ev) => {
        callback(true);
      }

      req.onerror = (ev) => {
        console.error("Error adding dataset into database:", ev.target.error?.message);
        callback(false);
      }

      db.close();
    };

    request.onerror = (event) => {
      console.error("IndexedDB error while opening database:", event.target.error?.message);
      event.target.result.close();
      callback(false);
    }
  }

  /**
   * Update a dataset in the database.
   * 
   * @param {String} name Name of the dataset
   * @param {Number} validTimeDays How long the dataset is valid, in days
   * @param {Object} geoJson The GeoJSON data, the content of the dataset
   * @param {Function} callback Callback function for the result
   */
  updateDataset(name, validTimeDays, value, callback) {
    const request = window.indexedDB.open(this.db_name, this.getVersion());

    request.onsuccess = (event) => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      const data = {
        name: name,
        validFrom: Date.now(),
        validUntil: Date.now() + (1000 * 60 * 60 * 24 * validTimeDays),
        value: value,
      };
      const store = db.transaction([STORE_DATASET], "readwrite").objectStore(STORE_DATASET);
      const req = store.put(data);

      req.onsuccess = (ev) => {
        callback(true);
      };

      req.onerror = (ev) => {
        console.error("Error updating dataset in database:", ev.target.error?.message);
        callback(false);
      }

      db.close();
    };

    request.onerror = (event) => {
      console.error("IndexedDB error while opening database:", event.target.error?.message);
      event.target.result.close();
      callback(false);
    }
  }

  /**
   * Delete a dataset from the database.
   * 
   * @param {String} name Name of the dataset
   * @param {Function} callback Callback function for the result
   */
  deleteDataset(name, callback) {
    const request = window.indexedDB.open(this.db_name, this.getVersion());

    request.onsuccess = (event) => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      const store = db.transaction([STORE_DATASET], "readwrite").objectStore(STORE_DATASET);
      const req = store.delete(name);

      req.onsuccess = (ev) => {
        callback(true);
      }

      req.onerror = (ev) => {
        console.error("Error deleting dataset from database:", ev.target.error?.message);
        callback(false);
      }
    };

    request.onerror = (event) => {
      console.error("IndexedDB error while opening database:", event.target.error?.message);
      event.target.result.close();
      callback(false);
    };
  }

  /**
   * Delete all datasets from the database.
   * 
   * @param {Function} callback Callback function for the result
   */
  deleteAllDatasets(callback) {
    const request = window.indexedDB.open(this.db_name, this.getVersion());

    request.onsuccess = (event) => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      const store = db.transaction([STORE_DATASET], "readwrite").objectStore(STORE_DATASET);
      const req = store.clear();

      req.onsuccess = (ev) => {
        callback(true);
      };

      req.onerror = (ev) => {
        console.error("Error deleting all dataset from database:", event.target.error?.message);
        callback(false);
      }

      db.close();
    };

    request.onerror = (event) => {
      console.error("IndexedDB error while opening database:", event.target.error?.message);
      event.target.result.close();
      callback(false);
    };
  }

  /**
   * Get a dataset from the database.
   * 
   * @param {String} name Name of the dataset
   * @param {Function} callback Callback function for the result
   */
  getDataset(name, callback) {
    const request = window.indexedDB.open(this.db_name, this.getVersion());

    request.onsuccess = (event) => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      const store = db.transaction([STORE_DATASET], "readonly").objectStore(STORE_DATASET);
      const req = store.get(name);

      req.onsuccess = (ev) => {
        callback(ev.target.result);
      };

      req.onerror = (ev) => {
        console.error("Error getting dataset from database:", event.target.error?.message);
        callback(false);
      };

      db.close();
    };

    request.onerror = (event) => {
      console.error("Error getting dataset from database:", event.target.error?.message);
      event.target.result.close();
      callback(false);
    };
  }

  /**
   * Get all datasets from the database.
   * 
   * @param {Function} callback Callback function for the result
   */
  getAllDatasets(callback) {
    const request = window.indexedDB.open(this.db_name, this.getVersion());

    request.onsuccess = (event) => {
      /** @type {IDBDatabase} */
      const db = event.target.result;
      const store = db.transaction([STORE_DATASET], "readonly").objectStore(STORE_DATASET);
      const req = store.openCursor();
      const result = [];

      req.onsuccess = (ev) => {
        /** @type {IDBCursor} */
        const cursor = ev.target.result;
        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          callback(result);
        }
      };

      req.onerror = (ev) => {
        console.error("Error getting all datasets from database:", ev.target.error?.message);
        callback(false);
      }

      db.close();
    };

    request.onerror = (event) => {
      console.error("IndexedDB error while opening database:", event.target.error?.message);
      event.target.result.close();
      callback(false);
    };
  }
}
