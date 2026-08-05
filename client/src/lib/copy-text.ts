export const copyToClipboard = async (
  text: string,
  setIsCopying: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    await navigator.clipboard.writeText(text);

    setIsCopying(true);

    setTimeout(() => {
      setIsCopying(false);
    }, 2000);
  } catch (err) {
    console.error("Error al copiar:", err);
  }
};
