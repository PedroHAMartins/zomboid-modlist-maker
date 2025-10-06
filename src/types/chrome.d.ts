// Chrome Extension API types
declare namespace chrome {
  namespace runtime {
    function sendMessage(
      message: unknown,
      callback?: (response: unknown) => void
    ): void;
    const onMessage: {
      addListener(
        callback: (
          message: unknown,
          sender: unknown,
          sendResponse: (response?: unknown) => void
        ) => void
      ): void;
      removeListener(
        callback: (
          message: unknown,
          sender: unknown,
          sendResponse: (response?: unknown) => void
        ) => void
      ): void;
    };
  }

  namespace storage {
    namespace local {
      function get(
        keys: string | string[] | object,
        callback: (result: unknown) => void
      ): void;
      function set(items: object, callback?: () => void): void;
    }
  }

  namespace tabs {
    function query(
      queryInfo: { active?: boolean; currentWindow?: boolean },
      callback: (tabs: unknown[]) => void
    ): void;
  }

  namespace downloads {
    function download(options: { url: string; filename: string }): void;
  }
}
