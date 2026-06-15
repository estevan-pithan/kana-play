import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

import { useFavorites } from '@/contexts/FavoritesContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/** Values used to pre-fill the form when a track is selected. */
export interface FavoriteDefaults {
  trackName: string
  artist: string
  album: string
}

interface AddFavoriteDialogProps {
  defaults: FavoriteDefaults | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FavoriteForm {
  trackName: string
  artist: string
  album: string
  notes: string
}

export function AddFavoriteDialog({
  defaults,
  open,
  onOpenChange,
}: AddFavoriteDialogProps) {
  const { t } = useTranslation()
  const { addFavorite } = useFavorites()

  const schema = useMemo(
    () =>
      z.object({
        trackName: z.string().min(1, t('collection.form.errorRequired')),
        artist: z.string().min(1, t('collection.form.errorRequired')),
        album: z.string(),
        notes: z.string(),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FavoriteForm>({
    resolver: zodResolver(schema),
    defaultValues: { trackName: '', artist: '', album: '', notes: '' },
  })

  // Re-seed the form whenever a new track is selected.
  useEffect(() => {
    if (defaults) {
      reset({ ...defaults, notes: '' })
    }
  }, [defaults, reset])

  function onSubmit(values: FavoriteForm) {
    addFavorite({
      trackName: values.trackName,
      artist: values.artist,
      album: values.album,
      notes: values.notes || undefined,
    })
    toast.success(t('collection.form.successToast'))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 bg-bg-near-black/90 text-white sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t('collection.form.title')}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e)
          }}
          className="flex flex-col gap-4"
        >
          <Field
            label={t('collection.form.trackName')}
            error={errors.trackName?.message}
          >
            <input className="glass-input w-full px-3 py-2 text-sm" {...register('trackName')} />
          </Field>

          <Field label={t('collection.form.artist')} error={errors.artist?.message}>
            <input className="glass-input w-full px-3 py-2 text-sm" {...register('artist')} />
          </Field>

          <Field label={t('collection.form.album')}>
            <input className="glass-input w-full px-3 py-2 text-sm" {...register('album')} />
          </Field>

          <Field label={t('collection.form.notes')}>
            <textarea
              rows={3}
              placeholder={t('collection.form.notesPlaceholder')}
              className="glass-input w-full resize-none px-3 py-2 text-sm"
              {...register('notes')}
            />
          </Field>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false)
              }}
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-brand rounded-full px-5 py-2 text-sm disabled:opacity-70"
            >
              {isSubmitting
                ? t('collection.form.submitting')
                : t('collection.form.submit')}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  )
}
