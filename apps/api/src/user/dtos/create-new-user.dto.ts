export class CreateNewUserDto {
  email: string;
  password: string;
  verify_email_token: string;
  verify_email_expires: Date;
}