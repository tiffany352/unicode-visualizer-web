import { useEffect, useState } from "react";
import Unicode, { fetchCompressedDatabase } from "./Unicode";

export enum Status {
  Loading,
  Loaded,
  Error
}

export type Result<T> =
  | {
      status: Status.Loading;
    }
  | {
      status: Status.Loaded;
      data: T;
    }
  | {
      status: Status.Error;
      message: string;
    };

export default function useUnicodeData<T>(
  func: (database: Unicode) => T
): Result<T> {
  const initial: Result<T> = {
    status: Status.Loading
  };
  const [state, setState]: [any, any] = useState(initial);
  useEffect(() => {
    async function fetch() {
      try {
        const database = await fetchCompressedDatabase();
        const data = func(database);
        setState({
          status: Status.Loaded,
          data
        });
      } catch (e) {
        setState({
          status: Status.Error,
          message: e.toString()
        });
      }
    }

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
