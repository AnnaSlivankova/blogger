import { Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../domain/device.entity';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(Device)
    private readonly device: Repository<Device>,
  ) {}

  async save(device: Device): Promise<boolean> {
    try {
      const res = await this.device.save(device);

      return !!res;
    } catch (e) {
      console.log('DevicesRepository/save', e);
      return false;
    }
  }

  async deleteAllEcxeptCurrent(
    userId: string,
    deviceId: string,
  ): Promise<string[] | null> {
    try {
      const devicesForDelete = await this.device.find({
        where: { userId: userId, deviceId: Not(deviceId) },
      });

      await this.device.remove(devicesForDelete);

      return devicesForDelete.map((el) => el.rt);
    } catch (e) {
      console.log('DevicesRepository/deleteAllEcxeptCurrent', e);
      return null;
    }
  }

  async deleteByDeviceId(userId: string, deviceId: string): Promise<boolean> {
    try {
      const res = await this.device.delete({ userId, deviceId });

      return !!res.affected;
    } catch (e) {
      console.log('DevicesRepository/deleteByDeviceId', e);
      return false;
    }
  }

  async getDevice(userId: string, deviceId: string): Promise<Device | null> {
    try {
      return await this.device.findOne({
        where: { userId, deviceId },
      });
    } catch (e) {
      console.log('DevicesRepository/deleteByDeviceId', e);
      return null;
    }
  }
}
