export function createUUID(): string {
    let uuid = crypto.randomUUID();

    uuid = uuid.replace(/[.#$[\]]/g, '');
  
    while (uuid.length < 36) {
      uuid += crypto.randomUUID().replace(/[.#$[\]]/g, '');
    }
  
    return uuid.slice(0, 36);
  }