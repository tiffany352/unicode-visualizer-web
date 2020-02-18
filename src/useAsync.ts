import { useEffect, useState } from "react";

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

export default function useAsync<T>(func: () => Promise<T>): Result<T> {
  const [state, setState] = useState<Result<T>>({
    status: Status.Loading
  });
  useEffect(() => {
    async function fetch() {
      try {
        const data = await func();
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
