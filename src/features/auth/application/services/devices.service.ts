import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DevicesRepository } from '../../infrastructure/devices.repository';
import { RtBlackListRepository } from '../../infrastructure/rt-black-list.repository';
import { RtBlackList } from '../../domain/rt-black-list.entity';

@Injectable()
export class DevicesService {
  constructor(
    private jwtService: JwtService,
    private readonly devicesRepository: DevicesRepository,
    private readonly rtBlackListRepository: RtBlackListRepository,
  ) {}

  async deleteAllOtherDevices(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const tokens = await this.devicesRepository.deleteAllEcxeptCurrent(
      userId,
      deviceId,
    );

    const tokensForBlackList = tokens.map((t) => RtBlackList.create(t));

    return await this.rtBlackListRepository.putInBlackList(tokensForBlackList);
  }

  async deleteDeviceById(userId: string, deviceId: string): Promise<boolean> {
    const device = await this.devicesRepository.getByDeviceId(deviceId);
    if (!device) throw new NotFoundException();
    if (device.userId !== userId) throw new ForbiddenException();

    const tokenForBlackList = RtBlackList.create(device.rt);
    const isInBlackList = await this.rtBlackListRepository.putInBlackList([
      tokenForBlackList,
    ]);
    if (!isInBlackList) throw new BadRequestException();

    return await this.devicesRepository.deleteByDeviceId(userId, deviceId);
  }
}
