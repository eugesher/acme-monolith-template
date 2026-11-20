import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { randomBytes } from 'crypto';
import helmet, { type HelmetOptions } from 'helmet';
import type { INestApplication } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'http';

import { ErrorResponseDto } from '@acme-libs/http';
import { AppNameEnum } from '@acme-libs/kernel';

export class ApiReference {
  private static readonly DOCUMENTS: Record<
    AppNameEnum,
    { title: string; description: string; bearer: boolean }
  > = {
    [AppNameEnum.STAFF_APP]: {
      title: 'ACME staff API',
      description:
        'The back-office surface: staff users, roles and permissions, the product catalog, sales orders, warehouse stock, the ledger, and the notes and tags of the staff.',
      bearer: true,
    },
    [AppNameEnum.CUSTOMER_APP]: {
      title: 'ACME customer API',
      description:
        'The customer-facing surface: sign-up and sign-in, the product catalog, and the orders of the signed-in customer.',
      bearer: true,
    },
    [AppNameEnum.PROCESSOR_APP]: {
      title: 'ACME processor app',
      description:
        'The background worker: it appends the ledger records the APIs enqueue, archives a published product an order leaves without stock, and purges expired and stuck idempotency keys every five minutes; it serves the health probes alone.',
      bearer: false,
    },
  };
  private static readonly ERROR_DESCRIPTION =
    'Any other error: VALIDATION_FAILED for a request the DTO refuses, the code of a refused header, or the name of the HTTP status, such as UNAUTHORIZED, FORBIDDEN, TOO_MANY_REQUESTS or INTERNAL_SERVER_ERROR';
  private static readonly SCRIPT_HOST = 'https://cdn.jsdelivr.net';
  private static readonly FONT_HOST = 'https://fonts.scalar.com';

  public static setup(app: INestApplication, appName: AppNameEnum): void {
    const config = app.get(ConfigService);

    if (!config.getOrThrow<boolean>('API_USE_API_REFERENCE')) {
      return;
    }

    const prefix = config.getOrThrow<string>('API_PREFIX');
    const { title, description, bearer } = ApiReference.DOCUMENTS[appName];
    const builder = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .addGlobalResponse({
        status: 'default',
        description: ApiReference.ERROR_DESCRIPTION,
        type: ErrorResponseDto,
      });

    if (bearer) {
      builder.addBearerAuth().addSecurityRequirements('bearer');
    }

    const options = builder.build();
    const document = SwaggerModule.createDocument(app, options);
    const nonces = new WeakMap<ServerResponse, string>();
    const assignNonce = (_req: IncomingMessage, res: ServerResponse, next: () => void): void => {
      nonces.set(res, randomBytes(16).toString('base64'));
      next();
    };
    const helmetOptions = ApiReference.helmetOptions(nonces);
    const headers = helmet(helmetOptions);
    const render = (req: IncomingMessage, res: ServerResponse): void => {
      const nonce = nonces.get(res);
      const reference = apiReference({ content: document, nonce });

      reference(req, res);
    };

    app.use(`/${prefix}/reference`, assignNonce, headers, render);
  }

  private static helmetOptions(nonces: WeakMap<ServerResponse, string>): HelmetOptions {
    const nonce = (_req: IncomingMessage, res: ServerResponse): string =>
      `'nonce-${nonces.get(res)}'`;

    return {
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'none'"],
          scriptSrc: ["'self'", ApiReference.SCRIPT_HOST, nonce],
          styleSrc: ["'self'", "'unsafe-inline'"],
          fontSrc: ["'self'", ApiReference.FONT_HOST],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          baseUri: ["'none'"],
          formAction: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      frameguard: { action: 'deny' },
    };
  }
}
