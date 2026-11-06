import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidatedActingContext } from '../guards/acting-context.guard';

export const CurrentContext = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ValidatedActingContext | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.actingContext || null;
  },
);

