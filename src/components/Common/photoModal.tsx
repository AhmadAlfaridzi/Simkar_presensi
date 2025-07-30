'use client'
import { Dialog, DialogContent, DialogHeader,  DialogTitle  } from '@/components/ui/dialog'
import Image from 'next/image'

interface PhotoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string
  title?: string
  description?: string
}

export function PhotoModal({ 
  open, 
  onOpenChange, 
  imageUrl, 
  title = 'Foto Bukti',
  description 
}: PhotoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95dvh] md:max-w-[70vw]">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </DialogHeader>
              
         <div className="relative mt-4 w-full h-[60dvh] max-h-[400px] md:h-[calc(90dvh-150px)] md:max-h-[600px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain rounded-md"
            unoptimized
            sizes="(max-width: 768px) 95vw, 70vw"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}