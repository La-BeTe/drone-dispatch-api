import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalInterceptors(new ResponseInterceptor());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const config = new DocumentBuilder()
		.setTitle('Drone Dispatch API')
		.setDescription('API documentation for the Drone Dispatch API')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	app.use('/spec', (_, res) => res.json(document));

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
