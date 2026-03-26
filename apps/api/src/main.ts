import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Praise App example')
    .setDescription('The Praise App API description')
    .setVersion('1.0')
    .addTag('praise-app')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory)

  const configService = app.get(ConfigService)
  await app.listen(configService.get('port'))

  console.log(`docs at http://localhost:${configService.get('port')}/docs`)
  console.log(`api at http://localhost:${configService.get('port')}/api`)
}
bootstrap()
