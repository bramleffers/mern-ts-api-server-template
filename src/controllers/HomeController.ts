import * as express from 'express';
import { injectable, inject } from 'inversify';
import { injectableSingleton } from "../lib/IocContainer";
import { controller, httpGet, requestParam } from 'inversify-express-utils';

import config from './../lib/AppConfig';
import Controller from './../lib/Controller';

@injectable()
@controller('/')
export class HomeController extends Controller {
  @httpGet('/')
  public get(): string {
    return `<b>Server:</b> ${new Date()}`;
  }
}