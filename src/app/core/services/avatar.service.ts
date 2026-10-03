import { Injectable } from '@angular/core';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

// Genera avatares por defecto con iniciales (DiceBear, open source) cuando la entidad no tiene foto propia.
@Injectable({ providedIn: 'root' })
export class AvatarService {
  fromSeed(seed: string): string {
    return createAvatar(initials, {
      seed: seed || '?',
      backgroundColor: ['22c55e', '15803d', '14532d', '052e16'],
    }).toDataUri();
  }

  // Devuelve la foto real si existe; si no, el avatar generado.
  resolve(foto: string | undefined | null, seed: string): string {
    return foto && foto.trim().length > 0 ? foto : this.fromSeed(seed);
  }
}
