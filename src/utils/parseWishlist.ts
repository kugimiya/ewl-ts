export type ItemType = {
  type: 'heading' | 'item' | 'empty';
  blocked: boolean;
  content: string;
  index: number;
  parent: number;
};

export const parseWishlist = (rawWishlist: string): ItemType[] => {
  let parent = -1;
  const strings: ItemType[] = rawWishlist
    .replaceAll('\t', ' ')
    .replaceAll('\r\n', '\n')
    .split('\n')
    .map((line, index) => {
      if (line.startsWith('#')) {
        parent = index;
        return {
          type: 'heading',
          blocked: false,
          content: line.replace('#', ''),
          index,
          parent: -1,
        };
      }

      if (line.startsWith('(занято)')) {
        return {
          type: 'item',
          blocked: true,
          content: line.replace('(занято) ', ''),
          index,
          parent,
        };
      }

      return {
        type: 'item',
        blocked: false,
        content: line,
        index,
        parent,
      };
    });

  return strings;
}
