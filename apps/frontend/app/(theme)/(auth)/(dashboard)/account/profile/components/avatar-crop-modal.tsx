"use client";

import { useCallback, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { X } from "lucide-react";
import { cropImageToBlob } from "./cropImage";

type Area = { x: number; y: number; width: number; height: number };

export function AvatarCropModal({
  open,
  imageSrc,
  onClose,
  onSave,
}: {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onSave: (blob: Blob, previewUrl: string) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const canRender = open && imageSrc;

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const zoomLabel = useMemo(() => `${Math.round(zoom * 100)}%`, [zoom]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl rounded-xl bg-[var(--color-background)] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
            Crop avatar
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-slate-500 hover:text-[var(--color-danger)]" />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative h-[360px] overflow-hidden rounded-lg border border-[var(--color-muted)] bg-black">
          {canRender ? (
            <Cropper
              image={imageSrc!}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-300">
              No image selected
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Zoom</span>
            <span className="font-medium text-[var(--color-foreground)]">
              {zoomLabel}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-slate-500 hover:bg-[var(--color-muted)]"
          >
            Cancel
          </button>

          <button
            disabled={!imageSrc || !croppedAreaPixels || saving}
            onClick={async () => {
              if (!imageSrc || !croppedAreaPixels) return;
              setSaving(true);
              try {
                const blob = await cropImageToBlob(
                  imageSrc,
                  croppedAreaPixels,
                  {
                    mimeType: "image/jpeg",
                    quality: 0.92,
                    size: 512,
                  }
                );
                const previewUrl = URL.createObjectURL(blob);
                onSave(blob, previewUrl);
                onClose();
              } finally {
                setSaving(false);
              }
            }}
            className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
