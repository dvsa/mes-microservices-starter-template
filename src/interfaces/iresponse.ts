export interface IResponse {
	body: any,
	statusCode: number,
	headers: { [id: string]: string; }
}