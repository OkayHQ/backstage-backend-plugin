/*
 * Copyright 2020 Okay Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';

import crypto from 'crypto';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(options: RouterOptions): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    response.send({ status: 'ok' });
  });

  router.get('/iframe_url/:id', (request, response) => {
    logger.debug(`Creating Okay iframe URL for id ${request.params.id}`);
    const dashboardUuid = request.params.id;

    const secret = config.getString('okay.iframe.secret');
    const id = config.getString('okay.iframe.id');
    const domainOpt = config.getOptionalString('okay.iframe.domain');
    const domain = (domainOpt ? domainOpt : 'https://app.okayhq.com').trim().replace(/\/+$/, '');

    // securely generate a nonce and TS, then sign the payload
    const nonce = crypto.randomBytes(16).toString('base64');
    const ts = new Date().toISOString();
    const signature = crypto
      .createHmac('sha1', secret)
      .update([id, nonce, ts].join('-'))
      .digest('hex');

    response.json({
      url: `${domain}/dashboards/${dashboardUuid}?showSidebar=false&readOnly=true&nonce=${nonce}&ts=${ts}&id=${id}&signature=${signature}`
    });
  });

  router.use(errorHandler());
  return router;
}
