'use client';

import { useFormState } from "react-dom";
import { saveWishlist, SaveWishlistState } from "@/app/actions/saveWishlist";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ItemType, parseWishlist } from "@/utils/parseWishlist";
import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import IconPlus from '@mui/icons-material/Add';
import IconDel from '@mui/icons-material/Delete';

const initialState: SaveWishlistState = {
  error: null,
  saved: false,
};

export default function FormComponent({ originWishlist }: { originWishlist: string }) {
  const router = useRouter();
  const [state, formAction] = useFormState(saveWishlist, initialState);

  const [wishlist, setWishlist] = useState(originWishlist);
  const [currentCategory, setCurrentCategory] = useState(-1);

  const items = parseWishlist(wishlist);
  const category = items.find((item) => currentCategory === item.index);
  const categoryItems = category !== undefined ? items.filter((item) => item.parent === category.index && item.type === 'item') : [];
  const headings = items.filter((item) => item.type === 'heading');

  const handleAddCategory = () => {
    setWishlist((prev) => {
      return `${prev}\n# Новая категория`;
    });
  };

  const handleSelectCategory = ({ index }: ItemType) => {
    setCurrentCategory(index);
  };

  const handleItemCategory = (item: ItemType) => {
    const nextItems = items.map((prevItem) => prevItem.index === item.index
      ? item
      : prevItem
    );

    setWishlist(
      nextItems
        .map((nextItem) => nextItem.type === 'heading' ? `#${nextItem.content}` : nextItem.type === 'item' ? nextItem.content : '')
        .join('\n')
    );
  };

  const handleCategoryNameChange = (nextName: string) => {
    if (category) {
      handleItemCategory({ ...category, content: nextName });
    }
  };

  const handleWishNameChange = (nextName: string, item: ItemType) => {
    handleItemCategory({ ...item, content: nextName });
  }

  const handleAddWish = () => {
    const nextItems: ItemType[] = [];
    const nextCurrentCategoryItems = [...categoryItems, { blocked: false, content: 'Новый виш', index: -2, parent: category?.index || 0, type: 'item' } as ItemType];

    headings.forEach((headingItem) => {
      nextItems.push(headingItem);
      if (headingItem.index === category?.index) {
        nextCurrentCategoryItems.forEach(_ => nextItems.push(_));
      } else {
        const catItems = category !== undefined ? items.filter((item) => item.parent === headingItem.index && item.type === 'item') : [];
        catItems.forEach(_ => nextItems.push(_));
      }
    });

    setWishlist(
      nextItems
        .map((nextItem) => nextItem.type === 'heading' ? `#${nextItem.content}` : nextItem.type === 'item' ? nextItem.content : '')
        .join('\n')
    );
  }

  const handleDeleteWish = (index: number) => {
    setWishlist(
      items
        .filter((item) => item.index !== index)
        .map((nextItem) => nextItem.type === 'heading' ? `#${nextItem.content}` : nextItem.type === 'item' ? nextItem.content : '')
        .join('\n')
    );
  }

  const handleDeleteCategory = (index: number) => {
    setWishlist(
      items
        .filter((item) => item.index !== index && item.parent !== index)
        .map((nextItem) => nextItem.type === 'heading' ? `#${nextItem.content}` : nextItem.type === 'item' ? nextItem.content : '')
        .join('\n')
    );
  }

  useEffect(() => {
    if (state.saved) {
      alert('Сохранено!');
      router.refresh();
    }
  }, [state.saved, router]);

  useEffect(() => {
    if (state.error) {
      alert(state.error);
    }
  }, [state.error]);

  const drawerWidth = 120;

  return (
    <form action={formAction}>
      <Stack direction="column" gap={4}>
        <Box>
          <Button type="submit" variant="contained">Сохранить изменения</Button>
        </Box>

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

            <Divider />

            <ListItem disablePadding>
              <ListItemButton onClick={handleAddCategory}>
                <ListItemIcon>
                  <IconPlus />
                </ListItemIcon>
                <ListItemText primary="Добавить категорию" />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider orientation="vertical" variant="middle" flexItem />

          {category === undefined && (
            <Typography padding={2}>Выбери категорию слева</Typography>
          )}

          {category !== undefined && (
            <Stack padding={2} gap={2} direction="column">
              <Stack direction="row" gap={1}>
                <TextField
                  sx={{ width: 480 }}
                  label={`Название категории #${category.index}`}
                  value={category.content}
                  onChange={(ev) => handleCategoryNameChange(ev.target.value)}
                />

                <Button color="error" onClick={() => handleDeleteCategory(category.index)}>Удалить категорию</Button>
              </Stack>

              <Typography>Виши:</Typography>

              <Stack paddingY={1} gap={1} direction="column">
                {categoryItems.map((item) => (
                  <Stack key={item.index} direction="row">
                    <TextField
                      sx={{ width: 640 }}
                      label={`Виш #${item.index}`}
                      value={item.content}
                      onChange={(ev) => handleWishNameChange(ev.target.value, item)}
                    />

                    <Button onClick={() => handleDeleteWish(item.index)}><IconDel color="error" /></Button>
                  </Stack>
                ))}

                <Button variant="outlined" onClick={handleAddWish}>Добавить виш</Button>
              </Stack>
            </Stack>
          )}

          <textarea style={{ width: '100%', display: 'none' }} rows={50} value={wishlist} name="wishlist" />
        </Stack>
      </Stack>
    </form>
  );
}
