/** Fallback avatar used when a cat has no uploaded picture. */
const DEFAULT_CAT_AVATARS = [
  "/createCat/avatars/tuxedo_avatar.png",
  "/createCat/avatars/calico_avatar.png",
  "/createCat/avatars/gray_avatar.png",
  "/createCat/avatars/orange_avatar.png",
  "/createCat/avatars/siamese_avatar.png",
  "/createCat/avatars/tabby_avatar.png",
  "/createCat/avatars/black_avatar.png",
];

export const getRandomAvatar = () => {
  const randomInd = Math.floor(Math.random() * DEFAULT_CAT_AVATARS.length);
  return DEFAULT_CAT_AVATARS[randomInd];
};
