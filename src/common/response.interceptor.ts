import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const res = context.switchToHttp().getResponse();
		return next.handle().pipe(
			map((data) => {
				if (
					data &&
					typeof data === 'object' &&
					'data' in data &&
					'meta' in data
				) {
					return {
						success: true,
						data: data.data,
						meta: data.meta,
					};
				}
				return {
					success: true,
					data,
				};
			}),
			catchError((err) => {
				let status =
					err instanceof HttpException
						? err.getStatus()
						: HttpStatus.INTERNAL_SERVER_ERROR;
				let message =
					err instanceof HttpException
						? err.getResponse()
						: err.message;
				if (typeof message === 'object' && message.message)
					message = message.message;
				if (Array.isArray(message) && message.length === 1)
					message = message[0];
				res.status(status);
				console.error(err);
				return [
					{
						success: false,
						message,
					},
				];
			}),
		);
	}
}
