'use client';

import { toggleItemInWishlist } from "@/app/actions/toggleItemInWishlist";
import { ItemType, parseWishlist } from "@/utils/parseWishlist";
import { Divider, List, ListItem, ListItemButton, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function WishlistPageComponent({ rawWishlist, nickname }: { rawWishlist: string, nickname: string }) {
  const router = useRouter();

  const [currentCategory, setCurrentCategory] = useState(0);

  const items = parseWishlist(rawWishlist);
  const category = items.find((item) => currentCategory === item.index);
  const categoryItems = category !== undefined ? items.filter((item) => item.parent === category.index && item.type === 'item') : [];
  const headings = items.filter((item) => item.type === 'heading');

  const handleCheck = (index: number) => async () => {
    if (confirm(`Ты точно хочешь подарить ${items[index].content}? Это действие необратимо для вас, отменить может только пользователь ${nickname}`)) {
      try {
        await toggleItemInWishlist(nickname, index);
        router.refresh();
        alert('Подарил!');
      } catch (e) {
        alert('Какая-то ошибка... ' + (e as Error).message);
      }
    }
  }

  const handleSelectCategory = ({ index }: ItemType) => {
    setCurrentCategory(index);
  };

  return (
    <Stack direction="row" component={Paper}>
      <List sx={{ width: 320, maxWidth: 320 }}>
        <Typography paddingX={2} paddingBottom={1} variant="body2" fontWeight="500">Категории</Typography>

        {headings.map((headingItem) => (
          <ListItem disablePadding key={headingItem.index}>
            <ListItemButton onClick={() => handleSelectCategory(headingItem)} selected={currentCategory === headingItem.index}>
              <ListItemText primary={headingItem.content} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider orientation="vertical" variant="middle" flexItem />

      {category !== undefined && (
        <Stack padding={2} gap={2} direction="column">
          {categoryItems.map((item) => (
            <Stack key={item.index} direction="row">
              <label htmlFor={`ch_${item.index}`} style={{ cursor: item.blocked ? 'not-allowed' : 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input id={`ch_${item.index}`} type='checkbox' checked={item.blocked} disabled={item.blocked} onChange={handleCheck(item.index)} />
                <span style={{ textDecoration: item.blocked ? 'line-through' : undefined }}>{item.content}</span>
              </label>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
