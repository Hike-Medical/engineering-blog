import { Injectable } from '@nestjs/common';
import { hello as helloService } from '@hike/services';
import { hello as helloTypes } from '@hike/types';
import { hello as helloUtils } from '@hike/utils';
import { hello as helloUI } from '@hike/ui';

@Injectable()
export class AppService {
  getHello(): string {
    return [helloService(), helloTypes(), helloUtils(), helloUI()].join(', ');
  }
}
