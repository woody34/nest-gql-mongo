import { Test, TestingModule } from '@nestjs/testing';
import { OrgResolver } from 'src/org/resolvers/org.resolver';

describe('OrgResolver', () => {
  let resolver: OrgResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgResolver],
    }).compile();

    resolver = module.get<OrgResolver>(OrgResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
