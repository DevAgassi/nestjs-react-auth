import {
  /*HttpException,
  HttpStatus,
  UnauthorizedException,*/
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /* handleRequest(err, user, info, context, status) {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;
    console.log('user');
    if (err || !user) {
      if (!email) {
        throw new HttpException({ message: '手机号不能为空' }, HttpStatus.OK);
      } else if (!password) {
        throw new HttpException({ message: '密码不能为空' }, HttpStatus.OK);
      } else {
        throw err || new UnauthorizedException();
      }
    }
    return user;
  }*/
}
