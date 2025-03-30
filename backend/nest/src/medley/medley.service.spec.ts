import { Test, TestingModule } from '@nestjs/testing'
import { MedleyService } from './medley.service'

describe('MedleyService', () => {
  let service: MedleyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedleyService]
    }).compile()

    service = module.get<MedleyService>(MedleyService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
