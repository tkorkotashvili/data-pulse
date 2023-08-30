import { ITableItem } from '../interfaces/table-item';

export const BYTES_PER_STRING = 2; // using 2 bytes for each character (UTF-16)
export const BYTES_PER_INT = 4;
export const BYTES_PER_FLOAT = 8;

export function convertDataToBuffer(data: ITableItem[]): ArrayBuffer {
  const bytesPerItem =
    9 * BYTES_PER_STRING * 2 + // ID for item and child
    BYTES_PER_INT +
    BYTES_PER_FLOAT +
    7 * BYTES_PER_STRING * 2; // color for item and child

  const buffer = new ArrayBuffer(data.length * bytesPerItem);
  const view = new DataView(buffer);
  let offset = 0;

  for (const item of data) {
    offset = serializeString(view, item.id, offset);
    view.setUint32(offset, item.int, true);
    offset += BYTES_PER_INT;

    view.setFloat64(offset, item.float, true);
    offset += BYTES_PER_FLOAT;

    offset = serializeString(view, item.color, offset);
    offset = serializeString(view, item.child.id, offset);
    offset = serializeString(view, item.child.color, offset);
  }

  return buffer;
}

export function serializeString(view: any, str: any, offset: any) {
  for (let char of str) {
    view.setUint16(offset, char.charCodeAt(0), true);
    offset += BYTES_PER_STRING;
  }
  return offset;
}
