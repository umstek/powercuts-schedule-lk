declare const COMMON: KVNamespace;

const prefix = 'powercuts-schedule-lk/';

export async function save(path: string, data: any): Promise<void> {
  return COMMON.put(prefix + path, data);
}

export async function load(path: string, type: any): Promise<any> {
  return COMMON.get(prefix + path, type);
}
