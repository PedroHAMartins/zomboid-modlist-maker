// Chrome Extension API types
declare namespace chrome {
  namespace runtime {
    function sendMessage(
      message: any,
      callback?: (response: any) => void
    ): void;
    const onMessage: {
      addListener(
        callback: (
          message: any,
          sender: any,
          sendResponse: (response?: any) => void
        ) => void
      ): void;
    };
  }

  namespace storage {
    namespace local {
      function get(
        keys: string | string[] | object,
        callback: (result: any) => void
      ): void;
      function set(items: object, callback?: () => void): void;
    }
  }

  namespace tabs {
    function query(
      queryInfo: { active?: boolean; currentWindow?: boolean },
      callback: (tabs: any[]) => void
    ): void;
  }

  namespace downloads {
    function download(options: { url: string; filename: string }): void;
  }
}
