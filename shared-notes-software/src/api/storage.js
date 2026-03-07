// utils/storage.js

let store = null;

export async function initStorage() {
  if (store) return store;

  if (typeof window !== "undefined" && window.__TAURI__) {
    const { load } = await import("@tauri-apps/plugin-store");
    store = await load("settings.json", { autoSave: true });
  } else {
    store = {
      async get(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      },
      async set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
      },
      async delete(key) {
        localStorage.removeItem(key);
      }
    };
  }

  return store;
}

export async function getItem(key) {
  const s = await initStorage();
  return s.get(key);
}

export async function setItem(key, value) {
  const s = await initStorage();
  return s.set(key, value);
}

export async function removeItem(key) {
  const s = await initStorage();
  return s.delete(key);
}