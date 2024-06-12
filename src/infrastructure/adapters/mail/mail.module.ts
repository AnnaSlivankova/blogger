import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { CONFIG } from '../../../settings/app.settings';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: CONFIG.CORP_EMAIL,
          pass: CONFIG.CORP_PASS,
        },
      },
      defaults: {
        from: `no-reply <${CONFIG.CORP_EMAIL}>`,
      },
      template: {
        dir: join(__dirname, './'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
