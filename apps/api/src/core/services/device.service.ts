import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as useragent from 'express-useragent';
import { createHash } from 'node:crypto';

export type Device = {
  type: string;
  name: string;
  os: string;
  ip: string;
  userAgent: string;
  device_id: string;
};

@Injectable()
export class DeviceService {
  constructor() {}

  generateDeviceKey(req: Request): string {
    const source = req.headers['user-agent'] || '';
    const ua = useragent.parse(source);
    const os = ua.os ? `${ua.os}` : 'unknown';
    const ip = req.ip;

    const comps = [source, ua, os, ip];

    return createHash('sha256').update(comps.join('|')).digest('hex');
  }

  getDeviceType(ua: useragent.Details): string {
    if (ua.isMobile) return 'mobile';
    if (ua.isTablet) return 'tablet';
    if (ua.isDesktop) return 'desktop';
    if (ua.isBot) return 'bot';
    return 'unknown';
  }
}
