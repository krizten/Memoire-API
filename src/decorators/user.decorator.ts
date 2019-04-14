import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string, request) => {
  return data ? request.user[data] : request.user;
});
