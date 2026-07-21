import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'John',
  })
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    example: 'john@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
  })
  @MinLength(6)
  password!: string;
}