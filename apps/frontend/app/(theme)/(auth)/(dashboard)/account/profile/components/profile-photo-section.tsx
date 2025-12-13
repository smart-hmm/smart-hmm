"use client";

import { useRef, useState } from "react";
import { Card } from "./card";
import { AvatarCropModal } from "./avatar-crop-modal";

export function ProfilePhotoSection() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // final cropped preview
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null); // selected before crop
  const [cropOpen, setCropOpen] = useState(false);

  const initials = "HV";

  return (
    <Card title="Profile photo">
      <p className="mb-6 text-sm text-slate-500">
        Your photo will be visible to your clients and coworkers.
      </p>

      <div className="flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--color-muted)] bg-[var(--color-accent)] text-3xl font-semibold text-slate-900">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="rounded-md bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
          >
            {avatarUrl ? "Change photo" : "Add a photo"}
          </button>

          {avatarUrl && (
            <button
              onClick={() => {
                setAvatarUrl(null);
              }}
              className="rounded-md px-4 py-2 text-sm text-slate-500 hover:bg-[var(--color-muted)]"
            >
              Remove
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Basic guard: limit size (optional)
            if (file.size > 8 * 1024 * 1024) {
              alert("Max file size is 8MB.");
              return;
            }

            // Create object URL for cropper
            const url = URL.createObjectURL(file);
            setRawImageUrl(url);
            setCropOpen(true);

            // reset input so selecting same file again works
            e.currentTarget.value = "";
          }}
        />
      </div>

      {/* Crop modal */}
      <AvatarCropModal
        open={cropOpen}
        imageSrc={rawImageUrl}
        onClose={() => setCropOpen(false)}
        onSave={(blob, previewUrl) => {
          // You can upload `blob` to your server/S3 here.
          // For now: just keep preview in UI.
          setAvatarUrl(previewUrl);

          // Clean up rawImageUrl to avoid memory leaks
          if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
          setRawImageUrl(null);

          // Example: convert to File if you need:
          // const file = new File([blob], "avatar.jpg", { type: blob.type });
        }}
      />
    </Card>
  );
}
