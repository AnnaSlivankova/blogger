import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PATH } from '../../../settings/app.settings';
import { DevicesService } from '../application/services/devices.service';
import { DevicesQueryRepository } from '../infrastructure/devices-query.repository';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from '../../../infrastructure/guards/refresh.token.guard';
import { DeviceOutputModel } from './models/output/device.output.model';

@Controller(PATH.DEVICES)
export class DevicesController {
  constructor(
    private devicesService: DevicesService,
    private devicesQueryRepository: DevicesQueryRepository,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get()
  async getAllActiveDevices(
    @Req() req: Request,
    @Res() res: Response<DeviceOutputModel[]>,
  ) {
    const userId = req['userId'];
    const devices = await this.devicesQueryRepository.getAll(userId);
    if (!devices) throw new NotFoundException();

    return res.status(200).send(devices);
  }

  @UseGuards(RefreshTokenGuard)
  @Delete()
  async deleteAllOtherDevices(@Req() req: Request, @Res() res: Response) {
    const userId = req['userId'];
    const deviceId = req['deviceId'];

    const isDeleted = await this.devicesService.deleteAllOtherDevices(
      userId,
      deviceId,
    );

    if (!isDeleted) throw new NotFoundException();

    return res.sendStatus(204);
  }

  @UseGuards(RefreshTokenGuard)
  @Delete(':deviceId')
  async deleteDeviceById(@Req() req: Request, @Res() res: Response) {
    const deviceId = req.params.deviceId;
    // if (!deviceId) throw new NotFoundException();
    const userId = req['userId'];

    const isDeleted = await this.devicesService.deleteDeviceById(
      userId,
      deviceId,
    );

    if (!isDeleted) throw new NotFoundException();

    return res.sendStatus(204);
  }
}
