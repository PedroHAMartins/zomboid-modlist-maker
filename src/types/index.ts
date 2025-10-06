export interface ModItem {
  publishedFileId: string;
  modName: string;
  url: string;
  modIds: string[];
  mapFolders: string[];
  addedAt: string;
}

export interface ChromeMessage {
  action: string;
  modInfo?: ModItem;
}

export interface ChromeResponse {
  success: boolean;
  message?: string;
}
