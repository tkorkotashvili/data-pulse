import { ITableItem } from '../interfaces/table-item';

export function reconstructDataFromBuffer(buffer: ArrayBuffer): ITableItem[] {
  const BYTES_PER_STRING = 2; // using 2 bytes for each character (UTF-16)
  const BYTES_PER_INT = 4;
  const BYTES_PER_FLOAT = 8;
  const view = new DataView(buffer);
  const items = [];
  let offset = 0;

  while (offset < buffer.byteLength) {
    const id = deserializeString(view, offset, 9);
    offset += 9 * BYTES_PER_STRING;

    const int = view.getUint32(offset, true);
    offset += BYTES_PER_INT;

    const float = view.getFloat64(offset, true);
    offset += BYTES_PER_FLOAT;

    const color = deserializeString(view, offset, 7);
    offset += 7 * BYTES_PER_STRING;

    const childId = deserializeString(view, offset, 9);
    offset += 9 * BYTES_PER_STRING;

    const childColor = deserializeString(view, offset, 7);
    offset += 7 * BYTES_PER_STRING;

    items.push({
      id,
      int,
      float,
      color,
      child: {
        id: childId,
        color: childColor,
      },
    });
  }

  return items;
}

function deserializeString(
  view: DataView,
  offset: number,
  length: number,
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(view.getUint16(offset, true));
    offset += 2; // 2 bytes for each character
  }
  return result;
}
