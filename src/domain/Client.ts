import { Error } from "./Error";

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: (error: Error) => void;
}
