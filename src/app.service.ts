import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  home(){

    return{
      application:"Cattle Management Backend",
      version:"1.0.0",
      status:"Running"
    }

  }

}