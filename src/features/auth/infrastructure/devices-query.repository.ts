import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../domain/device.entity';
import {
  DeviceOutputModel,
  deviceOutputModelMapper,
} from '../api/models/output/device.output.model';

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectRepository(Device)
    private readonly device: Repository<Device>,
  ) {}

  async getAll(userId: string): Promise<DeviceOutputModel[] | null> {
    try {
      const devices = await this.device.find({
        where: { userId },
      });

      return devices.map(deviceOutputModelMapper);
    } catch (e) {
      console.log('DevicesQueryRepository/getAll', e);
      return null;
    }
  }
}
