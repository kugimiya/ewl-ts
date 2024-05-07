'use client';

import { useFormState } from "react-dom";
import { saveWishlist, SaveWishlistState } from "@/app/actions/saveWishlist";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState: SaveWishlistState = {
  error: null,
  saved: false,
};

export default function FormComponent({ wishlist }: { wishlist: string }) {
  const router = useRouter();
  const [state, formAction] = useFormState(saveWishlist, initialState);

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

  return (
    <form action={formAction}>
      <textarea style={{ width: '100%' }} rows={50} defaultValue={wishlist} name="wishlist" />
      <input type="submit" value="Сохранить" />
    </form>
  );
}
