import { TFile, Vault, EventRef } from "obsidian";
import { IndexOperations } from "./indexOperations";

interface VaultEventCallback {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): unknown;
}

/**
 * IndexEventHandler — reindexa automáticamente archivos modificados, creados o eliminados.
 * Los event listeners se registran en el constructor y se limpian con unregister()
 * para evitar leaks al recargar el plugin.
 */
export class IndexEventHandler {
  private vault: Vault;
  private indexOps: IndexOperations;
  private enabled: boolean = true;
  private eventRefs: EventRef[] = [];

  constructor(vault: Vault, indexOps: IndexOperations) {
    this.vault = vault;
    this.indexOps = indexOps;
    this.registerEvents();
  }

  private registerEvents(): void {
    const v = this.vault as unknown as {
      on(name: string, cb: VaultEventCallback): EventRef;
    };
    this.eventRefs.push(
      v.on("create", async (file: TFile) => {
        if (!this.enabled || !(file instanceof TFile)) return;
        if (file.extension !== "md") return;
        await this.indexOps.indexFile(file);
      })
    );

    this.eventRefs.push(
      v.on("modify", async (file: TFile) => {
        if (!this.enabled || !(file instanceof TFile)) return;
        if (file.extension !== "md") return;
        await this.indexOps.indexFile(file);
      })
    );

    this.eventRefs.push(
      v.on("delete", async (file: TFile) => {
        if (!this.enabled || !(file instanceof TFile)) return;
        if (file.extension !== "md") return;
        await this.indexOps.removeFile(file.path);
      })
    );
  }

  unregister(): void {
    for (const ref of this.eventRefs) {
      this.vault.offref(ref);
    }
    this.eventRefs = [];
  }

  setEnabled(enable: boolean): void {
    this.enabled = enable;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
