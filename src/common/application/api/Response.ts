export default interface Response {
  body: unknown;
  statusCode: number;
  headers: { [id: string]: string };
}
