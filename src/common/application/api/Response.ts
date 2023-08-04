export interface Response<T> {
  body: T;
  statusCode: number;
  headers: { [id: string]: string };
}
