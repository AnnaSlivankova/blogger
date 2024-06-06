import { Device } from '../../../domain/device.entity';

export class DeviceOutputModel {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
}

//MAPPER
export const deviceOutputModelMapper = (device: Device): DeviceOutputModel => {
  const outputModel = new DeviceOutputModel();
  outputModel.ip = device.ip;
  outputModel.title = device.userAgent;
  outputModel.lastActiveDate = device.updatedAt.toISOString();
  outputModel.deviceId = device.deviceId;

  return outputModel;
};
