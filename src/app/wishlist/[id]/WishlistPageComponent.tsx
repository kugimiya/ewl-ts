'use client';

import { toggleItemInWishlist } from "@/app/actions/toggleItemInWishlist";
import { useRouter } from "next/navigation";

type ItemType = {
  type: string;
  blocked: boolean;
  content: string;
  index: number
};

export function WishlistPageComponent({ rawWishlist, nickname }: { rawWishlist: string, nickname: string }) {
  const router = useRouter();
  const strings: ItemType[] = rawWishlist.split('\n')
    .map(line => line.trim())
    .map((line, index) => {
      if (line.startsWith('#')) {
        return {
          type: 'heading',
          blocked: false,
          content: line.replace('#', ''),
          index
        };
      }

      if (line.startsWith('(занято)')) {
        return {
          type: 'item',
          blocked: true,
          content: line.replace('(занято) ', ''),
          index
        };
      }

      if (line === '') {
        return {
          type: 'empty',
          blocked: true,
          content: '',
          index
        };
      }

      return {
        type: 'item',
        blocked: false,
        content: line,
        index
      };
    });

  const handleCheck = (index: number) => async () => {
    if (confirm(`Ты точно хочешь подарить ${strings[index].content}? Это действие необратимо для вас, отменить может только пользователь ${nickname}`)) {
      try {
        await toggleItemInWishlist(nickname, index);
        router.refresh();
        alert('Подарил!');
      } catch (e) {
        alert('Какая-то ошибка... ' + (e as Error).message);
      }
    }
  }

  const getContent = (item: ItemType): JSX.Element => {
    if (item.type === 'heading') {
      return <h3>{item.content}</h3>
    }

    if (item.type === 'item') {
      return (
        <label htmlFor={`ch_${item.index}`} style={{ cursor: item.blocked ? 'not-allowed' : 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input id={`ch_${item.index}`} type='checkbox' checked={item.blocked} disabled={item.blocked} onChange={handleCheck(item.index)} />
          <span style={{ textDecoration: item.blocked ? 'line-through' : undefined }}>{item.content}</span>
        </label>
      );
    }

    return <></>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      {strings.map(item => (
        <div key={item.index} style={{ minHeight: '16px' }}>{getContent(item)}</div>
      ))}
    </div>
  );
}
