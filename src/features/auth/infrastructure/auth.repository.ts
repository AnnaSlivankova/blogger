import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(private readonly entityManager: EntityManager) {}
}
