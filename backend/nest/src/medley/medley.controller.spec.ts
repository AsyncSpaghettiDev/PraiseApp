import { Test, TestingModule } from '@nestjs/testing'
import { MedleyController } from './medley.controller'

describe('MedleyController', () => {
  let controller: MedleyController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedleyController]
    }).compile()

    controller = module.get<MedleyController>(MedleyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
