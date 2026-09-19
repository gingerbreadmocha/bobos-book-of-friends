import { useRef, useState } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { upload } from "@imagekit/react";
import { useImageKitAuth } from "../../hooks/imageKitUploader";

export type SelectedAvatar = {
  kind: "upload" | "default";
  src: string;
};

type AvatarUploaderProps = {
  /** Save the img URL to our form. */
  setImageUrl: Dispatch<SetStateAction<string | null>>;
};

const DEFAULT_AVATARS = [
  { label: "Black cat", src: "createCat/avatars/black_avatar.png" },
  { label: "Calico cat", src: "createCat/avatars/calico_avatar.png" },
  { label: "Gray cat", src: "createCat/avatars/gray_avatar.png" },
  { label: "Orange cat", src: "createCat/avatars/orange_avatar.png" },
  { label: "Siamese cat", src: "createCat/avatars/siamese_avatar.png" },
  { label: "Tabby cat", src: "createCat/avatars/tabby_avatar.png" },
  { label: "Tuxedo cat", src: "createCat/avatars/tuxedo_avatar.png" },
];

function CameraIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
      />
    </svg>
  );
}

export function AvatarUploader({ setImageUrl }: AvatarUploaderProps) {
  const getAuth = useImageKitAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    // Local preview
    setUploadPreview(URL.createObjectURL(file));

    try {
      setUploading(true);

      // Get temporary Imagekit credentials from server
      const { token, expire, signature, publicKey } = await getAuth();

      // Upload directly to Imagekit
      const result = await upload({
        file,
        fileName: file.name,
        token,
        expire,
        signature,
        publicKey,
        folder: "/bobo-guestbook",
      });

      if (result.url) {
        setImageUrl?.(result.url);
      }
    } catch (err) {
      console.error("Upload failed: ", err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const clearPhoto = () => {
    // TODO: Delete from ImageKit
    setUploadPreview(null);
    setImageUrl(null);
  };

  const selectAvatar = (src: string) => {
    setUploadPreview(null);
    setSelectedAvatar(src);
    setImageUrl(src);
  };

  return (
    <div className="mt-4 flex flex-col gap-6 sm:flex-row">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-disabled={uploading}
          className="group relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-input bg-white/60 text-muted-foreground transition-colors duration-150 hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-muted disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="flex flex-col items-center gap-1">
              <span
                className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">Uploading…</span>
            </span>
          ) : uploadPreview ? (
            <>
              <img
                src={uploadPreview}
                alt="Your cat photo preview"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-overlay/50 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <CameraIcon />
                <span className="text-sm font-medium">Change photo</span>
              </span>
            </>
          ) : (
            <>
              <CameraIcon />
              <span className="mt-1 text-sm font-medium">Click to upload</span>
            </>
          )}
        </button>
        {uploadPreview && (
          <button
            type="button"
            onClick={clearPhoto}
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground-subtle hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Remove photo
          </button>
        )}
      </div>

      <div className="flex justify-center items-center">OR</div>

      <ul aria-label="Default avatars" className="grid grid-cols-4 gap-3">
        {DEFAULT_AVATARS.map((avatar) => {
          const isSelected = selectedAvatar === avatar.src;
          return (
            <li key={avatar.src}>
              <button
                type="button"
                onClick={() => selectAvatar(avatar.src)}
                aria-pressed={isSelected}
                className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <img
                  src={avatar.src}
                  alt={avatar.label}
                  className={[
                    "h-20 w-20 rounded-full object-cover transition-all duration-150",
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-80 hover:opacity-100",
                  ].join(" ")}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
