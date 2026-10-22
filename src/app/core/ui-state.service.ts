import { Injectable, signal } from '@angular/core';

/** Open/closed state of the overlays, shared between the top bar, palette and assistant. */
@Injectable({ providedIn: 'root' })
export class UiStateService {
  readonly paletteOpen = signal(false);
  readonly drawerOpen = signal(false);
  readonly miniChatOpen = signal(false);

  /** Resolves when the first-visit boot intro has finished (or was skipped). */
  private bootResolve!: () => void;
  readonly bootDone: Promise<void> = new Promise<void>((r) => { this.bootResolve = r; });
  finishBoot(): void { this.bootResolve(); }

  closeAll(): void {
    this.paletteOpen.set(false);
    this.drawerOpen.set(false);
    this.miniChatOpen.set(false);
  }
}
